/**
 * Configuração e envio de formulários para Google Sheets via Google Apps Script.
 * Substitua `appsScriptUrl` pela URL do seu Web App publicado no Google Apps Script.
 */
window.INES_FORMS_CONFIG = {
  appsScriptUrl: 'https://script.google.com/macros/s/SEU_DEPLOYMENT_ID_AQUI/exec',
  timeoutMs: 15000
};

(function () {
  'use strict';

  function getFieldLabel(field, form) {
    if (field.placeholder) return field.placeholder.trim();
    if (field.id) {
      var label = form.querySelector('label[for="' + field.id + '"]');
      if (label) return label.textContent.trim();
    }
    return field.name || field.id || 'campo';
  }

  function showFormMessage(form, type, text) {
    var old = form.querySelector('.elementor-message');
    if (old) old.remove();

    var msg = document.createElement('div');
    msg.className = 'elementor-message elementor-message-' + type;
    msg.setAttribute('role', 'alert');
    msg.style.marginTop = '12px';
    msg.style.padding = '10px 14px';
    msg.style.borderRadius = '4px';
    msg.style.fontSize = '14px';
    msg.style.lineHeight = '1.4';
    if (type === 'success') {
      msg.style.backgroundColor = '#edf7ed';
      msg.style.color = '#1e4620';
      msg.style.border = '1px solid #c3e6cb';
    } else {
      msg.style.backgroundColor = '#fdecea';
      msg.style.color = '#611a15';
      msg.style.border = '1px solid #f5c6cb';
    }
    msg.textContent = text;
    form.appendChild(msg);
  }

  function readFileAsBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result
        });
      };
      reader.onerror = function () {
        reject(new Error('Falha ao ler o arquivo: ' + file.name));
      };
      reader.readAsDataURL(file);
    });
  }

  async function collectFormPayload(form) {
    var payload = {
      formName: form.getAttribute('name') || 'Formulario',
      pageTitle: document.title,
      pageUrl: window.location.href,
      submittedAt: new Date().toISOString(),
      fields: {}
    };

    var elements = form.querySelectorAll('input, select, textarea');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (!el.name || el.type === 'submit' || el.type === 'button') continue;
      if (el.name === '_gotcha') {
        payload._gotcha = el.value;
        continue;
      }
      if (el.type === 'hidden') {
        if (el.name === 'post_id' || el.name === 'form_id' || el.name === 'queried_id') {
          payload[el.name] = el.value;
        }
        continue;
      }

      var key = getFieldLabel(el, form);

      if (el.type === 'checkbox') {
        payload.fields[key] = el.checked ? 'Sim' : 'Não';
      } else if (el.type === 'radio') {
        if (el.checked) payload.fields[key] = el.value;
      } else if (el.type === 'file') {
        if (el.files && el.files.length > 0) {
          var file = el.files[0];
          var maxMb = parseFloat(el.getAttribute('data-maxsize') || '5');
          if (file.size > maxMb * 1024 * 1024) {
            throw new Error(el.getAttribute('data-maxsize-message') || 'O arquivo excede o tamanho máximo permitido.');
          }
          payload.fields[key] = await readFileAsBase64(file);
        }
      } else {
        payload.fields[key] = el.value.trim();
      }
    }

    return payload;
  }

  function attachFormHandler(form) {
    if (form.dataset.inesBound === '1') return;
    form.dataset.inesBound = '1';

    // Honeypot anti-spam invisível
    var honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = '_gotcha';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    honeypot.style.position = 'absolute';
    honeypot.style.left = '-9999px';
    honeypot.style.opacity = '0';
    honeypot.setAttribute('aria-hidden', 'true');
    form.appendChild(honeypot);

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      var originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

      try {
        var payload = await collectFormPayload(form);

        // Se o honeypot foi preenchido por robô, finge sucesso sem enviar
        if (payload._gotcha) {
          form.reset();
          showFormMessage(form, 'success', 'Mensagem enviada com sucesso! Em breve entraremos em contato.');
          return;
        }

        var endpoint = (window.INES_FORMS_CONFIG && window.INES_FORMS_CONFIG.appsScriptUrl) || '';
        if (!endpoint || endpoint.indexOf('SEU_DEPLOYMENT_ID_AQUI') !== -1) {
          showFormMessage(
            form,
            'danger',
            'Endpoint do Google Apps Script ainda não configurado em assets/js/forms.js.'
          );
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.7';
          var textEl = submitBtn.querySelector('.elementor-button-text');
          if (textEl) textEl.textContent = 'Enviando...';
        }

        var controller = new AbortController();
        var timeoutId = setTimeout(function () {
          controller.abort();
        }, (window.INES_FORMS_CONFIG && window.INES_FORMS_CONFIG.timeoutMs) || 15000);

        // text/plain evita preflight CORS no Google Apps Script Web App
        var response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          redirect: 'follow',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }

        form.reset();
        showFormMessage(form, 'success', 'Dados enviados com sucesso! Nossa equipe entrará em contato em breve.');
      } catch (err) {
        console.error('Erro ao enviar formulário:', err);
        showFormMessage(
          form,
          'danger',
          err && err.message && err.message.indexOf('arquivo') !== -1
            ? err.message
            : 'Não foi possível enviar no momento. Tente novamente ou fale conosco pelo WhatsApp.'
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('form.elementor-form');
    for (var i = 0; i < forms.length; i++) {
      attachFormHandler(forms[i]);
    }
  });
})();

