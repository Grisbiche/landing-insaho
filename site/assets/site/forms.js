/*
 * Formulaires du site Insaho (remplace le traitement de l'ancien CMS Hapi).
 * Les envois sont reçus par Netlify Forms, qui les transmet par e-mail à bonjour@insaho.fr
 * (notification à configurer dans Netlify : Site > Forms > Form notifications).
 *
 *  - Formulaire "Contactez-nous"         -> formulaire Netlify "contact"
 *  - Bloc "Abonnez-vous à la newsletter" -> formulaire Netlify "newsletter"
 */
(function () {
  'use strict';

  var FORMS = {
    'Form_1523': 'contact',
    'Form_1576': 'newsletter',
    'form_newsletter': 'newsletter'
  };
  var MSG_OK = 'Merci, votre demande a bien été envoyée. Nous revenons vers vous très rapidement.';
  var MSG_ERR = 'Une erreur est survenue lors de l’envoi. Merci de réessayer ou de nous écrire à bonjour@insaho.fr.';
  var MSG_REQUIRED = 'Merci de remplir les champs obligatoires.';
  var MSG_EMAIL = 'Merci de saisir une adresse e-mail valide.';

  function netlifyName(form) {
    if (form.classList.contains('form_newsletter')) return FORMS.form_newsletter;
    var m = (form.id || '').match(/Form_\d+/);
    return m ? FORMS[m[0]] : null;
  }

  // "Form_1523_19999_1[lastname]" -> "lastname"
  function fieldName(name) {
    var m = name.match(/\[([^\]]+)\]$/);
    return m ? m[1] : name;
  }

  function setMessage(form, text, ok) {
    var box = form.querySelector('.insaho-form-message');
    if (!box) {
      box = document.createElement('p');
      box.className = 'insaho-form-message';
      box.setAttribute('role', 'status');
      var action = form.querySelector('.form-action, button[type=submit]');
      (action && action.parentNode ? action.parentNode : form).insertBefore(box, action ? action.nextSibling : null);
    }
    box.textContent = text;
    box.style.cssText = 'margin:1em 0;font-weight:600;color:' + (ok ? 'inherit' : '#d0021b') + ';';
  }

  // Valeur d'un champ du CMS : le champ "Mobile" est transformé par intl-tel-input
  // (champ visible + champ caché synchronisé), on prend donc la valeur la plus complète.
  function groupValue(g) {
    var named = g.querySelector('[name*="["]');
    var visible = g.querySelector('input:not([type=hidden]), textarea, select');
    var v = ((named && named.value) || '').trim();
    if (!v && visible) {
      v = (visible.value || '').trim();
      var flag = g.querySelector('.selected-flag[title]');
      if (v && flag && v.charAt(0) !== '+') v += ' (' + flag.getAttribute('title') + ')';
    }
    return { value: v, input: visible || named, name: g.getAttribute('data-code') || (named ? fieldName(named.name) : '') };
  }

  function fields(form) {
    var groups = form.querySelectorAll('.form-group[data-code]');
    if (groups.length) return Array.prototype.map.call(groups, function (g) {
      var f = groupValue(g); f.group = g; f.required = !!g.querySelector('sup.mandatory'); return f;
    });
    // Formulaire newsletter court (un seul champ e-mail)
    var email = form.querySelector('input.email, input[name=email]');
    return email ? [{ value: email.value.trim(), input: email, name: 'email', required: true }] : [];
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(form, list) {
    var firstBad = null, emailBad = false;
    list.forEach(function (f) {
      var isEmail = f.name === 'email';
      var bad = (f.required && !f.value) || (isEmail && f.value && !EMAIL_RE.test(f.value));
      if (bad && isEmail && f.value) emailBad = true;
      if (f.group) f.group.classList.toggle('has-error', bad);
      if (f.input) f.input.style.borderColor = bad ? '#d0021b' : '';
      if (bad && !firstBad) firstBad = f.input;
    });
    if (firstBad) {
      setMessage(form, emailBad ? MSG_EMAIL : MSG_REQUIRED, false);
      try { firstBad.focus(); } catch (e) {}
      return false;
    }
    return true;
  }

  function onSubmit(e) {
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;
    var name = netlifyName(form);
    if (!name) return;
    // Empêche le traitement de l'ancien CMS
    e.preventDefault();
    e.stopImmediatePropagation();
    var list = fields(form);
    if (form.dataset.sending === '1' || !validate(form, list)) return;

    var data = new URLSearchParams();
    data.append('form-name', name);
    data.append('page', document.title + ' - ' + location.pathname);
    list.forEach(function (f) { if (f.name) data.append(f.name, f.value); });

    var btn = form.querySelector('button[type=submit]');
    form.dataset.sending = '1';
    if (btn) btn.disabled = true;

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data.toString()
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      form.reset();
      setMessage(form, MSG_OK, true);
    }).catch(function () {
      setMessage(form, MSG_ERR, false);
    }).then(function () {
      form.dataset.sending = '';
      if (btn) btn.disabled = false;
    });
  }

  // Phase de capture : passe avant les gestionnaires de l'ancien CMS
  window.addEventListener('submit', onSubmit, true);
})();
