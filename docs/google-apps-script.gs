/**
 * Google Apps Script - Receptor dos formulários do site Inês Assessoria
 *
 * Como publicar:
 * 1. Abra sua planilha no Google Sheets.
 * 2. Vá em Extensões > Apps Script.
 * 3. Cole este código, salve e clique em "Implantar" > "Nova implantação".
 * 4. Tipo: "App da Web" | Executar como: "Eu" | Quem pode acessar: "Qualquer pessoa".
 * 5. Copie a URL gerada e cole em `assets/js/forms.js` na propriedade `appsScriptUrl`.
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || '{}');
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = sanitizeSheetName(data.formName || 'Leads');
    var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

    var fields = data.fields || {};
    var fieldKeys = Object.keys(fields);

    if (sheet.getLastRow() === 0) {
      var headers = ['Data/Hora', 'Página', 'URL'].concat(fieldKeys);
      sheet.appendRow(headers);
    }

    var rowHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    // Adiciona novas colunas caso um envio traga campos ainda não mapeados
    fieldKeys.forEach(function (k) {
      if (rowHeaders.indexOf(k) === -1) {
        rowHeaders.push(k);
        sheet.getRange(1, rowHeaders.length).setValue(k);
      }
    });

    var row = rowHeaders.map(function (header) {
      if (header === 'Data/Hora') return new Date();
      if (header === 'Página') return data.pageTitle || '';
      if (header === 'URL') return data.pageUrl || '';
      var val = fields[header];
      if (val && typeof val === 'object' && val.name) {
        return val.name + ' (' + Math.round((val.size || 0) / 1024) + ' KB)';
      }
      return val !== undefined ? val : '';
    });

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sanitizeSheetName(name) {
  return String(name).replace(/[\\\/\?\*\[\]:]/g, '').slice(0, 80) || 'Leads';
}

