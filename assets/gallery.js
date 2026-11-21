(function () {
  var box = document.getElementById('lightbox');
  if (!box) return;
  var links = Array.prototype.slice.call(document.querySelectorAll('a.shot'));
  var img = document.getElementById('lb-img');
  var dateEl = document.getElementById('lb-date');
  var capEl = document.getElementById('lb-caption');
  var counter = document.getElementById('lb-counter');
  var current = -1;
  var lastFocus = null;
  var originalTitle = document.title;

  function show(i) {
    if (!links.length) return;
    current = (i + links.length) % links.length;
    var a = links[current];
    // preload next
    var next = links[(current+1)%links.length];
    if (next) { var pre = new Image(); pre.src = next.getAttribute('data-full'); }
    img.src = a.getAttribute('data-full');
    var thumb = a.querySelector('img');
    img.alt = thumb ? thumb.alt : '';
    dateEl.textContent = a.getAttribute('data-date') || '';
    capEl.textContent = a.getAttribute('data-caption') || '';
    counter.textContent = (current + 1) + ' / ' + links.length;
    document.title = (a.getAttribute('data-date') || 'Galería') + ' · Percy Quasar';
  }

  function open(i) {
    lastFocus = document.activeElement;
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    show(i);
    document.getElementById('lb-close').focus();
  }

  function close() {
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.documentElement.style.overscrollBehavior = '';
    img.removeAttribute('src');
    document.title = originalTitle;
    if (lastFocus) lastFocus.focus();
  }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      open(i);
    });
  });

  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', function () { show(current - 1); });
  document.getElementById('lb-next').addEventListener('click', function () { show(current + 1); });

  box.addEventListener('click', function (e) {
    if (e.target === box) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });

  // swipe support for iOS / Android
  var startX = 0, startY = 0, deltaX = 0;
  var threshold = 50;
  box.addEventListener('touchstart', function(e){
    if (!box.classList.contains('open')) return;
    var t = e.touches[0];
    startX = t.clientX; startY = t.clientY; deltaX = 0;
  }, {passive:true});
  box.addEventListener('touchmove', function(e){
    if (!startX) return;
    var t = e.touches[0];
    deltaX = t.clientX - startX;
    // prevent vertical scroll when swiping horizontally
    if (Math.abs(deltaX) > 20) e.preventDefault();
  }, {passive:false});
  box.addEventListener('touchend', function(e){
    if (!startX) return;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) show(current - 1); else show(current + 1);
    }
    startX = 0; deltaX = 0;
  }, {passive:true});
})();
