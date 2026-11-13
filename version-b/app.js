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

    range.addEventListener('keydown', function (e) {
      var key = e.key;
      if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'ArrowUp' && key !== 'ArrowDown') return;
      e.preventDefault();
      stopAnim();
      markInteracted();
      var delta = e.shiftKey ? 10 : 5;
      var cur = parseFloat(range.value);
      if (isNaN(cur)) cur = 50;
      if (key === 'ArrowLeft' || key === 'ArrowDown') setPos(cur - delta);
      else setPos(cur + delta);
    });

    // Intro sweep: start fully "before", then move to the midpoint
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

    var played = false;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !played) {
            played = true;
            setTimeout(function () {
              if (!el.classList.contains('interacted')) {
                setPos(100);
                sweep(100, 50, 1600);
              }
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

  /* ---------- Preview-only quote form. Nothing is sent or stored. ---------- */
  var form = document.querySelector('.quote-form');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) {
        status.className = 'form-status';
        status.textContent = 'Preview only. Nothing was sent, stored, or monitored.';
      }
    });
  }

  /* ---------- Work collage zoom (hover is CSS; tap/keyboard toggles) ---------- */
  var collage = document.querySelector('.photo-collage');
  if (collage) {
    var items = collage.querySelectorAll('.collage-item');
    var fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduceZoom = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setOrigin(item) {
      var rect = item.getBoundingClientRect();
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var extraX = (rect.width * 0.56) / 2 + 8;
      var extraY = (rect.height * 0.56) / 2 + 8;
      var x = 'center';
      var y = 'center';
      if (rect.left < extraX) x = 'left';
      else if (vw - rect.right < extraX) x = 'right';
      if (rect.top < extraY) y = 'top';
      else if (vh - rect.bottom < extraY) y = 'bottom';
      var img = item.querySelector('img');
      if (img) img.style.transformOrigin = x + ' ' + y;
    }

    function clearZoom(except) {
      items.forEach(function (item) {
        if (item !== except) {
          item.classList.remove('is-zoomed');
          item.setAttribute('aria-pressed', 'false');
        }
      });
    }

    function toggleZoom(item) {
      if (reduceZoom) return;
      var on = !item.classList.contains('is-zoomed');
      clearZoom(on ? item : null);
      if (on) {
        setOrigin(item);
        item.classList.add('is-zoomed');
        item.setAttribute('aria-pressed', 'true');
      } else {
        item.classList.remove('is-zoomed');
        item.setAttribute('aria-pressed', 'false');
      }
    }

    items.forEach(function (item) {
      item.addEventListener('pointerenter', function () {
        setOrigin(item);
      });
      item.addEventListener('click', function (e) {
        if (fineHover) return; /* desktop hover already enlarges */
        e.preventDefault();
        toggleZoom(item);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleZoom(item);
        }
        if (e.key === 'Escape') {
          clearZoom();
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!collage.contains(e.target)) clearZoom();
    });
  }

  /* ---------- Reviews: tap to expand clamped quotes on small screens ---------- */
  var reviewGrid = document.querySelector('.review-grid');
  if (reviewGrid) {
    reviewGrid.querySelectorAll('.review-card').forEach(function (card) {
      card.setAttribute('aria-expanded', 'false');
    });
    reviewGrid.addEventListener('click', function (e) {
      if (!window.matchMedia('(max-width: 640px)').matches) return;
      var card = e.target.closest('.review-card');
      if (!card) return;
      var on = card.getAttribute('aria-expanded') !== 'true';
      reviewGrid.querySelectorAll('.review-card').forEach(function (c) {
        c.classList.toggle('is-expanded', on && c === card);
        c.setAttribute('aria-expanded', on && c === card ? 'true' : 'false');
      });
    });
  }
})();
