(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Before / after compare sliders ---------- */
  function setupCompare(el) {
    var range = el.querySelector('.compare-range');
    if (!range) return;
    var raf = null;
    var animating = false;

    function setPos(v) {
      v = Math.max(0, Math.min(100, v));
      el.style.setProperty('--pos', v + '%');
      if (String(range.value) !== String(v)) range.value = v;
    }

    function stopAnim() {
      animating = false;
      if (raf) cancelAnimationFrame(raf);
    }

    function markInteracted() {
      el.classList.add('interacted');
    }

    range.addEventListener('input', function () {
      stopAnim();
      markInteracted();
      setPos(parseFloat(range.value));
    });

    // Pointer feedback: press state + jump-to-point on click/tap
    range.addEventListener('pointerdown', function (e) {
      stopAnim();
      markInteracted();
      el.classList.add('dragging');
      var rect = el.getBoundingClientRect();
      setPos(((e.clientX - rect.left) / rect.width) * 100);
    });
    function release() {
      el.classList.remove('dragging');
    }
    range.addEventListener('pointerup', release);
    range.addEventListener('pointercancel', release);
    range.addEventListener('blur', release);

    // Intro sweep: start fully "before", reveal the "after" to the midpoint
    function sweep(from, to, duration) {
      if (reduceMotion) {
        setPos(to);
        return;
      }
      animating = true;
      var start = null;
      function ease(t) {
        return 1 - Math.pow(1 - t, 3);
      }
      function frame(ts) {
        if (!animating) return;
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / duration);
        setPos(from + (to - from) * ease(t));
        if (t < 1) raf = requestAnimationFrame(frame);
        else animating = false;
      }
      raf = requestAnimationFrame(frame);
    }

    setPos(100);
    var played = false;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !played) {
            played = true;
            setTimeout(function () {
              if (!el.classList.contains('interacted')) sweep(100, 50, 1600);
            }, el.hasAttribute('data-autoplay') ? 350 : 150);
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
  }

  document.querySelectorAll('[data-compare]').forEach(setupCompare);

  /* ---------- Header ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      mobileNav.hidden = open;
      if (!open) header.classList.add('scrolled');
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        mobileNav.hidden = true;
      });
    });
  }

  /* ---------- Scroll reveals ---------- */
  var revealTargets = document.querySelectorAll(
    '.statement, .section-head, .work-item, .services-intro, .service-row, .process-copy, .process-figure, .review, .quote-copy, .quote-form'
  );
  revealTargets.forEach(function (n) {
    n.classList.add('reveal');
  });
  var rio = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          rio.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
  );
  revealTargets.forEach(function (n) {
    rio.observe(n);
  });

  /* ---------- Demo quote form ---------- */
  var form = document.querySelector('.quote-form');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      if (!form.checkValidity()) {
        status.classList.add('err');
        status.textContent = 'Please add your name, phone number and project type so we can reach you.';
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim().split(' ')[0];
      var type = (data.get('type') || 'project').toString().toLowerCase();
      status.classList.add('ok');
      status.textContent =
        'Thanks' + (name ? ', ' + name : '') + '. We\u2019ll call about your ' + type + ' shortly. (Demo only: nothing was sent.)';
      form.reset();
    });
  }
})();
