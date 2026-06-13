(function () {
  'use strict';

  var LANG_KEY = 'rc2_lang';

  /* ── Send log to API ───────────────────────────────── */
  function sendLog(event, data) {
    try {
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: event, data: data || {} }),
      }).catch(function () {});
    } catch (e) {}
  }

  /* Log page visit once per session */
  if (!sessionStorage.getItem('rc_visited')) {
    sessionStorage.setItem('rc_visited', '1');
    sendLog('visit', { lang: localStorage.getItem(LANG_KEY) || 'unknown' });
  }

  /* ── Shared AudioContext ────────────────────────────── */
  var audioCtx = null;
  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  /* ── Click sound (Web Audio API) ───────────────────── */
  function playClick() {
    try {
      var ctx    = getCtx();
      var osc    = ctx.createOscillator();
      var gain   = ctx.createGain();
      var filter = ctx.createBiquadFilter();

      filter.type            = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value         = 0.8;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  }

  /* ── Ambient music ──────────────────────────────────── */
  var musicNodes    = [];
  var musicPlaying  = false;
  var masterGain    = null;

  function startAmbientMusic() {
    if (musicPlaying) return;
    try {
      var ctx = getCtx();

      /* Master gain — fade in over 4 s */
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 4);
      masterGain.connect(ctx.destination);

      /* Warm low-pass filter */
      var lpf = ctx.createBiquadFilter();
      lpf.type            = 'lowpass';
      lpf.frequency.value = 900;
      lpf.Q.value         = 0.4;
      lpf.connect(masterGain);

      /* Reverb-style delay for space */
      var delay = ctx.createDelay(2);
      delay.delayTime.value = 0.38;
      var delayGain = ctx.createGain();
      delayGain.gain.value = 0.28;
      delay.connect(delayGain);
      delayGain.connect(lpf);
      delayGain.connect(delay); /* feedback */

      /* A-major ambient chord: A2 E3 A3 C#4 E4 */
      var freqs = [110, 164.81, 220, 277.18, 329.63];
      var types = ['sine', 'sine', 'triangle', 'sine', 'sine'];
      var vols  = [0.28, 0.22, 0.20, 0.16, 0.14];

      freqs.forEach(function (freq, i) {
        var osc = ctx.createOscillator();
        osc.type          = types[i];
        osc.frequency.value = freq;
        osc.detune.value  = (i % 2 === 0 ? 4 : -4); /* subtle richness */

        var og = ctx.createGain();
        og.gain.value = vols[i] / freqs.length;

        osc.connect(og);
        og.connect(lpf);
        og.connect(delay);
        osc.start();
        musicNodes.push(osc, og);
      });

      /* Slow LFO — gentle breathing effect (0.07 Hz) */
      var lfo     = ctx.createOscillator();
      var lfoGain = ctx.createGain();
      lfo.frequency.value  = 0.07;
      lfoGain.gain.value   = 0.018;
      lfo.connect(lfoGain);
      lfoGain.connect(masterGain.gain);
      lfo.start();
      musicNodes.push(lfo, lfoGain, lpf, delay, delayGain);

      musicPlaying = true;
      updateMusicBtn();
    } catch (e) {}
  }

  function stopAmbientMusic() {
    if (!musicPlaying || !masterGain) return;
    try {
      var ctx = audioCtx;
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
      var snapshot = musicNodes.slice();
      setTimeout(function () {
        snapshot.forEach(function (n) {
          try { if (n.stop) n.stop(); } catch (_) {}
          try { n.disconnect(); } catch (_) {}
        });
        try { masterGain.disconnect(); } catch (_) {}
      }, 1300);
    } catch (e) {}
    musicNodes   = [];
    masterGain   = null;
    musicPlaying = false;
    updateMusicBtn();
  }

  function updateMusicBtn() {
    var btn = document.getElementById('rc-music-btn');
    if (!btn) return;
    btn.title     = musicPlaying ? 'Desligar música' : 'Ligar música';
    btn.innerHTML = musicPlaying
      ? '<span style="font-size:18px">🎵</span>'
      : '<span style="font-size:18px;opacity:.5">🔇</span>';
    btn.style.borderColor  = musicPlaying ? 'rgba(59,130,246,0.55)' : 'rgba(59,130,246,0.2)';
    btn.style.background   = musicPlaying ? 'rgba(37,99,235,0.22)'  : 'rgba(37,99,235,0.10)';
    btn.style.boxShadow    = musicPlaying ? '0 0 16px rgba(59,130,246,0.25)' : 'none';
  }

  function createMusicBtn() {
    if (document.getElementById('rc-music-btn')) return;
    var btn = document.createElement('button');
    btn.id = 'rc-music-btn';
    btn.innerHTML = '<span style="font-size:18px;opacity:.5">🔇</span>';
    btn.title = 'Ligar música';
    btn.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:24px', 'z-index:9000',
      'width:46px', 'height:46px', 'border-radius:50%',
      'background:rgba(37,99,235,0.10)',
      'border:1px solid rgba(59,130,246,0.2)',
      'color:#fff', 'cursor:pointer',
      'display:flex', 'align-items:center', 'justify-content:center',
      'transition:all 0.25s ease',
      'box-shadow:none',
      'backdrop-filter:blur(10px)',
      '-webkit-backdrop-filter:blur(10px)',
    ].join(';');
    btn.addEventListener('click', function () {
      playClick();
      if (musicPlaying) { stopAmbientMusic(); } else { startAmbientMusic(); }
    });
    btn.addEventListener('mouseenter', function () {
      btn.style.transform = 'scale(1.1)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = 'scale(1)';
    });
    document.body.appendChild(btn);
  }

  /* ── Token enforcement ─────────────────────────────── */
  var tokenGeneratedInSession = false;

  var WARN_MSGS = {
    en: 'Generate a token first to access the game.',
    es: 'Genera un token primero para acceder al juego.',
    pt: 'Gere um token primeiro para acessar o jogo.',
    ru: 'Сначала создайте токен, чтобы войти в игру.',
  };

  function showWarning() {
    var lang = localStorage.getItem(LANG_KEY) || 'en';
    var msg  = WARN_MSGS[lang] || WARN_MSGS.en;
    var existing = document.getElementById('rc-token-warning');
    if (existing) return;
    var warn = document.createElement('div');
    warn.id = 'rc-token-warning';
    warn.style.cssText = [
      'position:fixed', 'bottom:80px', 'left:50%', 'transform:translateX(-50%)',
      'background:#1c2028', 'border:1px solid #ef4444', 'color:#fca5a5',
      'font-size:13px', 'font-weight:600', 'padding:10px 20px',
      'border-radius:12px', 'z-index:999999', 'white-space:nowrap',
      'box-shadow:0 4px 20px rgba(0,0,0,.6)',
      'font-family:Outfit,Inter,sans-serif',
    ].join(';');
    warn.textContent = msg;
    document.body.appendChild(warn);
    setTimeout(function () { warn.remove(); }, 2800);
  }

  /* ── Language overlay logic ─────────────────────────── */
  function dismissOverlay(lang) {
    localStorage.setItem(LANG_KEY, lang);
    sendLog('language', { lang: lang });
    var overlay = document.getElementById('rc-lang-overlay');
    if (overlay) {
      overlay.style.animation = 'rc-fadeout .2s ease forwards';
      setTimeout(function () { overlay.classList.add('rc-hidden'); }, 210);
    }
    /* Start ambient music on first user interaction */
    setTimeout(startAmbientMusic, 600);
  }

  /* ── MutationObserver: sound + token enforcement ───── */
  var observer = new MutationObserver(function () {
    document.querySelectorAll('button:not([data-rc-s]), a:not([data-rc-s])').forEach(function (el) {
      el.setAttribute('data-rc-s', '1');
      el.addEventListener('click', playClick);
    });

    document.querySelectorAll('[data-testid="button-access-game"]:not([data-rc-e])').forEach(function (el) {
      el.setAttribute('data-rc-e', '1');
      el.addEventListener('click', function (e) {
        if (!tokenGeneratedInSession) {
          e.preventDefault();
          e.stopImmediatePropagation();
          showWarning();
        } else {
          var game = el.closest('[data-game]') || document.querySelector('[data-game]');
          sendLog('access', {
            lang: localStorage.getItem(LANG_KEY) || 'unknown',
            game: game ? game.getAttribute('data-game') : 'unknown',
          });
        }
      }, true);
    });

    document.querySelectorAll('[data-testid="button-generate-token"]:not([data-rc-t])').forEach(function (el) {
      el.setAttribute('data-rc-t', '1');
      el.addEventListener('click', function () {
        tokenGeneratedInSession = true;
        var game = el.closest('[data-game]') || document.querySelector('[data-game]');
        sendLog('token', {
          lang: localStorage.getItem(LANG_KEY) || 'unknown',
          game: game ? game.getAttribute('data-game') : 'unknown',
        });
      });
    });

    document.querySelectorAll('[data-testid="modal-game"]:not([data-rc-m])').forEach(function (el) {
      el.setAttribute('data-rc-m', '1');
      sendLog('modal', {
        lang: localStorage.getItem(LANG_KEY) || 'unknown',
        game: el.getAttribute('data-game') || 'unknown',
      });
    });
  });

  /* Reset token state when modal closes */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t) return;
    if (
      (t.tagName === 'BUTTON' && t.dataset && t.dataset.testid === 'button-close-modal') ||
      t.id === 'rc-lang-overlay'
    ) {
      tokenGeneratedInSession = false;
    }
  }, true);

  /* ── Wire up language buttons ───────────────────────── */
  document.querySelectorAll('#rc-lang-overlay .rc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      playClick();
      dismissOverlay(btn.dataset.lang);
    });
  });

  /* ── Roblox account verification (800+ days) ────────── */
  var VERIFIED_KEY = 'rc_verified';

  function showVerifyOverlay() {
    var v = document.getElementById('rc-verify-overlay');
    if (v) v.style.display = 'flex';
    var l = document.getElementById('rc-lang-overlay');
    if (l) l.classList.add('rc-hidden');
  }

  function revealLangOverlay() {
    var v = document.getElementById('rc-verify-overlay');
    if (v) {
      v.style.animation = 'rc-fadeout .25s ease forwards';
      setTimeout(function () { v.style.display = 'none'; }, 260);
    }
    var l = document.getElementById('rc-lang-overlay');
    if (l) { l.classList.remove('rc-hidden'); l.style.animation = 'rc-fadein .3s ease'; }
  }

  function setupVerifyOverlay() {
    var btn   = document.getElementById('rc-verify-btn');
    var input = document.getElementById('rc-verify-input');
    var msg   = document.getElementById('rc-verify-msg');
    if (!btn || !input) return;

    function doVerify() {
      var username = input.value.trim();
      if (!username) return;
      btn.disabled = true;
      btn.textContent = 'Verificando…';
      msg.className = 'rc-verify-msg';
      msg.textContent = '';

      fetch('/api/roblox-check?username=' + encodeURIComponent(username))
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.valid) {
            msg.className = 'rc-verify-msg success';
            msg.textContent = '✅ Conta verificada! Bem-vindo, ' + data.username + ' (' + data.days + ' dias)';
            localStorage.setItem(VERIFIED_KEY, '1');
            localStorage.setItem('rc_roblox_user', data.username);
            sendLog('verify', { username: data.username, days: data.days });
            setTimeout(revealLangOverlay, 900);
          } else {
            msg.className = 'rc-verify-msg error';
            if (data.error === 'user_not_found') {
              msg.textContent = '❌ Usuário não encontrado no Roblox.';
            } else if (data.error === 'account_too_new') {
              msg.textContent = '❌ Sua conta tem apenas ' + data.days + ' dias. Mínimo: 800 dias.';
            } else {
              msg.textContent = '❌ Erro ao verificar. Tente novamente.';
            }
            btn.disabled = false;
            btn.textContent = 'Verificar';
          }
        })
        .catch(function () {
          msg.className = 'rc-verify-msg error';
          msg.textContent = '❌ Erro de conexão. Tente novamente.';
          btn.disabled = false;
          btn.textContent = 'Verificar';
        });
    }

    btn.addEventListener('click', doVerify);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doVerify(); });
  }

  if (!localStorage.getItem(VERIFIED_KEY)) {
    showVerifyOverlay();
  }
  setupVerifyOverlay();

  /* ── Init ───────────────────────────────────────────── */
  createMusicBtn();
  observer.observe(document.body, { childList: true, subtree: true });

})();
