/* Gen Z Epoxy — hero before/after slider */
(function () {
  var stage = document.getElementById("ba-stage");
  if (!stage) return;

  var handle = document.getElementById("ba-handle");
  var badgeBefore = document.getElementById("ba-badge-before");
  var badgeAfter = document.getElementById("ba-badge-after");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pos = 50;
  var dragging = false;
  var animating = false;
  var animId = 0;
  var pointerId = null;

  function setPos(p) {
    pos = Math.max(0, Math.min(100, p));
    stage.style.setProperty("--pos", pos + "%");
    if (handle) {
      handle.setAttribute("aria-valuenow", String(Math.round(pos)));
    }
    if (badgeBefore) badgeBefore.style.opacity = pos < 12 ? "0" : "1";
    if (badgeAfter) badgeAfter.style.opacity = pos > 88 ? "0" : "1";
  }

  function cancelAnim() {
    if (animId) cancelAnimationFrame(animId);
    animating = false;
    animId = 0;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateTo(from, to, duration, done) {
    cancelAnim();
    animating = true;
    var start = performance.now();
    function frame(now) {
      if (!animating) return;
      var t = Math.min(1, (now - start) / duration);
      setPos(from + (to - from) * easeOutCubic(t));
      if (t < 1) {
        animId = requestAnimationFrame(frame);
      } else {
        animating = false;
        animId = 0;
        if (done) done();
      }
    }
    animId = requestAnimationFrame(frame);
  }

  function clientXToPos(clientX) {
    var rect = stage.getBoundingClientRect();
    if (rect.width <= 0) return pos;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function onPointerDown(e) {
    if (e.target.closest && e.target.closest("a,button,input,select,textarea,label")) return;
    cancelAnim();
    dragging = true;
    pointerId = e.pointerId;
    try { stage.setPointerCapture(pointerId); } catch (err) {}
    setPos(clientXToPos(e.clientX));
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!dragging) return;
    if (pointerId !== null && e.pointerId !== pointerId) return;
    setPos(clientXToPos(e.clientX));
    e.preventDefault();
  }

  function onPointerUp(e) {
    if (!dragging) return;
    if (pointerId !== null && e.pointerId !== pointerId) return;
    dragging = false;
    try { stage.releasePointerCapture(pointerId); } catch (err) {}
    pointerId = null;
  }

  stage.addEventListener("pointerdown", onPointerDown);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerup", onPointerUp);
  stage.addEventListener("pointercancel", onPointerUp);

  if (handle) {
    handle.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 10 : 2;
      var next = pos;
      if (e.key === "ArrowLeft") next = pos - step;
      else if (e.key === "ArrowRight") next = pos + step;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = 100;
      else return;
      e.preventDefault();
      cancelAnim();
      setPos(next);
    });
  }

  // Opening animation: start at 100% (full Before), pause 400ms, glide to 50%
  if (!reduced) {
    setPos(100);
    var imgs = stage.querySelectorAll("img.ba-img");
    var pending = imgs.length;
    var started = false;
    var safety = setTimeout(startReveal, 500);

    function maybeReady() {
      pending -= 1;
      if (pending <= 0) startReveal();
    }

    function startReveal() {
      if (started) return;
      started = true;
      clearTimeout(safety);
      setTimeout(function () {
        if (dragging) return;
        animateTo(100, 50, 1350);
      }, 400);
    }

    imgs.forEach(function (img) {
      if (img.complete && img.naturalWidth) maybeReady();
      else {
        img.addEventListener("load", maybeReady, { once: true });
        img.addEventListener("error", maybeReady, { once: true });
        if (img.decode) img.decode().then(maybeReady).catch(maybeReady);
      }
    });
  } else {
    setPos(50);
  }

  // Mobile nav toggle
  var btn = document.querySelector(".menu-btn");
  if (btn) {
    btn.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
  }

  // Sample quote form
  var form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("quote-note");
      if (note) {
        note.hidden = false;
        note.textContent = "Sample preview form — not connected yet. Please call (817) 925-8395 for a free quote.";
      }
    });
  }
})();
