document.addEventListener('DOMContentLoaded', () => {
    /* --- 1. MOBILE MENU TOGGLE --- */
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMobileMenu() {
        const isClosed = mobileMenu.classList.contains('hidden');
        if (isClosed) {
            mobileMenu.classList.remove('hidden');
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        } else {
            mobileMenu.classList.add('hidden');
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    /* --- 2. SERVICE DETAILS MODAL (SEO-Crawlable HTML Panes) --- */
    const modal = document.getElementById('serviceModal');
    const modalContainer = document.getElementById('modalContainer');
    const modalTitle = document.getElementById('modalTitle');
    const modalClose = document.getElementById('modalClose');
    const modalDismiss = document.getElementById('modalDismiss');
    const serviceTriggers = document.querySelectorAll('.service-modal-trigger');
    const servicePanes = document.querySelectorAll('.service-detail-pane');

    function openModal(serviceKey, customTitle) {
        let found = false;
        servicePanes.forEach((pane) => {
            const isMatch = pane.getAttribute('data-service-pane') === serviceKey;
            pane.classList.toggle('hidden', !isMatch);
            if (isMatch) found = true;
        });

        if (!found) return;

        modalTitle.textContent = customTitle || 'Service Overview';
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');

        setTimeout(() => {
            modalContainer.classList.remove('scale-95', 'opacity-0');
            modalContainer.classList.add('scale-100', 'opacity-100');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalContainer.classList.remove('scale-100', 'opacity-100');
        modalContainer.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }, 200);
    }

    serviceTriggers.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const key = e.currentTarget.getAttribute('data-service');
            const title = e.currentTarget.getAttribute('data-service-title');
            openModal(key, title);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalDismiss) modalDismiss.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    /* --- 3. INTERACTIVE LIMASSOL VECTOR MAP (PAN, ZOOM, LAZY LIVE MAP, FULLSCREEN) --- */
    const mapViewport = document.getElementById('map-viewport');
    const vectorMapView = document.getElementById('vector-map-view');
    const liveMapView = document.getElementById('live-map-view');
    const osmIframe = document.getElementById('osm-iframe');
    const btnVectorMap = document.getElementById('btn-vector-map');
    const btnLiveMap = document.getElementById('btn-live-map');
    const zoomInBtn = document.getElementById('map-zoom-in');
    const zoomOutBtn = document.getElementById('map-zoom-out');
    const fullscreenBtn = document.getElementById('map-fullscreen');
    const mapParent = document.getElementById('map-parent');

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    function updateMapTransform() {
        if (mapViewport) {
            mapViewport.setAttribute('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
        }
    }

    if (btnVectorMap && btnLiveMap) {
        btnVectorMap.addEventListener('click', () => {
            vectorMapView.classList.remove('hidden');
            liveMapView.classList.add('hidden');
            btnVectorMap.classList.add('bg-gold', '!text-black', 'border-gold');
            btnLiveMap.classList.remove('bg-gold', '!text-black', 'border-gold');
        });

        btnLiveMap.addEventListener('click', () => {
            if (osmIframe && !osmIframe.getAttribute('src') && osmIframe.dataset.src) {
                osmIframe.setAttribute('src', osmIframe.dataset.src);
            }
            vectorMapView.classList.add('hidden');
            liveMapView.classList.remove('hidden');
            btnLiveMap.classList.add('bg-gold', '!text-black', 'border-gold');
            btnVectorMap.classList.remove('bg-gold', '!text-black', 'border-gold');
        });
    }

    if (vectorMapView) {
        vectorMapView.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateMapTransform();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        vectorMapView.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                startX = e.touches[0].clientX - translateX;
                startY = e.touches[0].clientY - translateY;
            }
        }, { passive: true });

        vectorMapView.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 1) {
                translateX = e.touches[0].clientX - startX;
                translateY = e.touches[0].clientY - startY;
                updateMapTransform();
            }
        }, { passive: true });

        vectorMapView.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (scale < 3) {
                scale += 0.25;
                updateMapTransform();
            }
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (scale > 0.6) {
                scale -= 0.25;
                updateMapTransform();
            }
        });
    }

    if (fullscreenBtn && mapParent) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                if (mapParent.requestFullscreen) {
                    mapParent.requestFullscreen();
                } else if (mapParent.webkitRequestFullscreen) {
                    mapParent.webkitRequestFullscreen();
                }
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        });
    }
});