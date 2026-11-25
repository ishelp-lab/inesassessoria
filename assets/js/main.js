/**
 * Comportamentos interativos em JavaScript puro para o site Inês Assessoria.
 * Substitui os scripts de runtime do WordPress / Astra / Elementor / JetElements.
 */
(function () {
  'use strict';

  function decodeElementorAction(href) {
    if (!href || href.indexOf('elementor-action') === -1) return null;
    try {
      var decoded = decodeURIComponent(href.replace(/^#/, ''));
      var actionMatch = decoded.match(/action=([^&]+)/);
      var settingsMatch = decoded.match(/settings=([^&]+)/);
      var action = actionMatch ? actionMatch[1] : '';
      var settings = {};
      if (settingsMatch && settingsMatch[1]) {
        settings = JSON.parse(atob(settingsMatch[1]));
      }
      return { action: action, settings: settings };
    } catch (e) {
      return null;
    }
  }

  function getPopupElement(id) {
    return (
      document.getElementById('elementor-popup-modal-' + id) ||
      document.querySelector('[data-elementor-type="popup"][data-elementor-id="' + id + '"]')
    );
  }

  function openPopup(id) {
    var modal = getPopupElement(id);
    if (!modal) return;
    modal.style.display = 'flex';
    modal.classList.add('ines-popup-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('ines-modal-lock');
  }

  function closePopup(modal) {
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.remove('ines-popup-open');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.ines-popup-open')) {
      document.documentElement.classList.remove('ines-modal-lock');
    }
  }

  function closeAllPopups() {
    var openModals = document.querySelectorAll('.ines-popup-open, .elementor-popup-modal');
    for (var i = 0; i < openModals.length; i++) {
      closePopup(openModals[i]);
    }
  }

  function initPopups() {
    // Garante que todos os modais comecem ocultos até serem acionados
    var modals = document.querySelectorAll('.elementor-popup-modal, [data-elementor-type="popup"]');
    for (var i = 0; i < modals.length; i++) {
      var m = modals[i];
      if (!m.classList.contains('elementor-popup-modal')) {
        // Alguns templates ficam dentro de .elementor-popup-modal; se estiver solto, ignora
        continue;
      }
      m.style.display = 'none';
      m.setAttribute('aria-hidden', 'true');

      // Adiciona botão de fechar se não existir
      var content = m.querySelector('.dialog-widget-content');
      if (content && !content.querySelector('.dialog-close-button')) {
        var closeBtn = document.createElement('a');
        closeBtn.href = '#';
        closeBtn.className = 'dialog-close-button dialog-lightbox-close-button';
        closeBtn.setAttribute('aria-label', 'Fechar');
        closeBtn.innerHTML = '<i class="eicon-close" aria-hidden="true"></i>';
        closeBtn.addEventListener('click', function (ev) {
          ev.preventDefault();
          closePopup(this.closest('.elementor-popup-modal'));
        });
        content.appendChild(closeBtn);
      }

      // Fechar ao clicar no backdrop
      m.addEventListener('click', function (ev) {
        if (ev.target === this) {
          closePopup(this);
        }
      });
    }

    // Delegação global para links #elementor-action
    document.addEventListener('click', function (ev) {
      var link = ev.target.closest('a[href*="elementor-action"]');
      if (!link) return;
      var parsed = decodeElementorAction(link.getAttribute('href'));
      if (!parsed) return;

      ev.preventDefault();
      if (parsed.action === 'popup:open' && parsed.settings && parsed.settings.id) {
        var targetModal = getPopupElement(parsed.settings.id);
        if (parsed.settings.toggle && targetModal && targetModal.classList.contains('ines-popup-open')) {
          closePopup(targetModal);
        } else {
          openPopup(parsed.settings.id);
        }
      } else if (parsed.action === 'popup:close') {
        var parentModal = link.closest('.elementor-popup-modal');
        if (parentModal) {
          if (parsed.settings && parsed.settings.do_not_show_again) {
            try {
              localStorage.setItem('ines_popup_dismissed_' + parentModal.id, '1');
            } catch (e) {}
          }
          closePopup(parentModal);
        } else {
          closeAllPopups();
        }
      }
    });

    // Tecla ESC fecha popups
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        closeAllPopups();
      }
    });

    // Botão "Enviar Depoimento" ou triggers similares que apontam para popup 13415
    var depTriggers = document.querySelectorAll('[data-popup-id]');
    for (var j = 0; j < depTriggers.length; j++) {
      depTriggers[j].addEventListener('click', function (ev) {
        ev.preventDefault();
        openPopup(this.getAttribute('data-popup-id'));
      });
    }
  }

  function initMenus() {
    // Toggle de submenus no menu mobile / dropdown
    var subArrows = document.querySelectorAll('.elementor-nav-menu .sub-arrow, .elementor-nav-menu .menu-item-has-children > a');
    for (var i = 0; i < subArrows.length; i++) {
      subArrows[i].addEventListener('click', function (ev) {
        var li = this.closest('.menu-item-has-children');
        if (!li) return;
        var inVerticalMenu = li.closest('.elementor-nav-menu--layout-vertical, .elementor-nav-menu--dropdown');
        if (inVerticalMenu || this.classList.contains('sub-arrow') || this.getAttribute('href') === '#') {
          ev.preventDefault();
          ev.stopPropagation();
          li.classList.toggle('ines-submenu-open');
          var sub = li.querySelector(':scope > .sub-menu');
          if (sub) {
            var isOpen = li.classList.contains('ines-submenu-open');
            sub.style.display = isOpen ? 'block' : '';
          }
        }
      });
    }
  }

  function initAnimations() {
    var invisibleEls = document.querySelectorAll('.elementor-invisible');
    if (!invisibleEls.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.remove('elementor-invisible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05 }
      );
      for (var i = 0; i < invisibleEls.length; i++) {
        observer.observe(invisibleEls[i]);
      }
    } else {
      for (var j = 0; j < invisibleEls.length; j++) {
        invisibleEls[j].classList.remove('elementor-invisible');
      }
    }
  }

  function initSmoothScroll() {
    document.addEventListener('click', function (ev) {
      var link = ev.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href === '#' || href.indexOf('elementor-action') !== -1) return;
      var target = document.querySelector(href);
      if (target) {
        ev.preventDefault();
        closeAllPopups();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPopups();
    initMenus();
    initAnimations();
    initSmoothScroll();
  });
})();

