  document.addEventListener('DOMContentLoaded', function () {

    /* --- Menu de navigation mobile --- */
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    /* --- Galerie / modale PDF --- */
    var pdfModal = document.getElementById('pdf-modal');
    var pdfFrame = document.getElementById('pdf-modal-frame');
    if (pdfModal && pdfFrame) {
      var pdfCloseBtn = pdfModal.querySelector('.pdf-modal-close');

      document.querySelectorAll('.pdf-card').forEach(function (card) {
        card.addEventListener('click', function () {
          var pdfPath = card.getAttribute('data-pdf');
          pdfFrame.src = pdfPath;
          pdfModal.classList.add('open');
          pdfModal.setAttribute('aria-hidden', 'false');
        });
      });

      function fermerModalePdf() {
        pdfModal.classList.remove('open');
        pdfModal.setAttribute('aria-hidden', 'true');
        pdfFrame.src = '';
      }

      pdfCloseBtn.addEventListener('click', fermerModalePdf);
      pdfModal.addEventListener('click', function (e) {
        if (e.target === pdfModal) fermerModalePdf();
      });

      window.fermerModalePdf = fermerModalePdf;
    }

    /* --- Échap : ferme la modale PDF et/ou le zoom image --- */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (typeof window.fermerModalePdf === 'function') window.fermerModalePdf();
        fermerZoom();
      }
    });
  });

  /* --- Zoom image (overlay réutilisable, créé à la volée) --- */

  function ouvrirZoom(img) {
    const { overlay, image } = ensureOverlay();
    if (!overlay || !image) return;
    image.src = img.src;
    image.alt = img.alt || '';
    overlay.classList.add('actif');
    document.body.style.overflow = 'hidden';
  }

  function fermerZoom() {
    const overlay = document.getElementById('overlayZoom');
    if (!overlay) return;
    overlay.classList.remove('actif');
    document.body.style.overflow = '';
    const image = document.getElementById('imageZoomee');
    if (image) image.src = '';
  }

  // Crée l'overlay si nécessaire et retourne références à l'overlay et à l'image
  function ensureOverlay() {
    let overlay = document.getElementById('overlayZoom');
    let image = document.getElementById('imageZoomee');
    if (overlay && image) return { overlay, image };

    overlay = document.createElement('div');
    overlay.id = 'overlayZoom';
    overlay.className = 'overlay-zoom';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.display = 'none';
    overlay.addEventListener('click', fermerZoom);

    image = document.createElement('img');
    image.id = 'imageZoomee';
    image.className = 'image-zoomee';
    image.alt = '';

    overlay.appendChild(image);
    document.body.appendChild(overlay);
    return { overlay, image };
  }

  // Exposer les fonctions au scope global (utilisées par les attributs onclick dans le HTML)
  window.ouvrirZoom = ouvrirZoom;
  window.fermerZoom = fermerZoom;