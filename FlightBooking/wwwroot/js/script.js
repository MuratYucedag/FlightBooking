/* =========================================================
   SkyRoute — script.js
   Tüm arayüz etkileşimleri
   ========================================================= */

(function () {
    'use strict';

    /* ---------------------------------------------------------
       0. HAVALİMANI VERİSİ (autocomplete için)
    --------------------------------------------------------- */
    const AIRPORTS = [
        { city: 'İstanbul',  country: 'Türkiye',   name: 'İstanbul Havalimanı',          iata: 'IST' },
        { city: 'İstanbul',  country: 'Türkiye',   name: 'Sabiha Gökçen Havalimanı',     iata: 'SAW' },
        { city: 'Ankara',    country: 'Türkiye',   name: 'Esenboğa Havalimanı',          iata: 'ESB' },
        { city: 'İzmir',     country: 'Türkiye',   name: 'Adnan Menderes Havalimanı',    iata: 'ADB' },
        { city: 'Antalya',   country: 'Türkiye',   name: 'Antalya Havalimanı',           iata: 'AYT' },
        { city: 'Amsterdam', country: 'Hollanda',  name: 'Amsterdam Schiphol Havalimanı',iata: 'AMS' },
        { city: 'Milano',    country: 'İtalya',    name: 'Milano Malpensa Havalimanı',   iata: 'MXP' },
        { city: 'Milano',    country: 'İtalya',    name: 'Milano Linate Havalimanı',     iata: 'LIN' },
        { city: 'Milano',    country: 'İtalya',    name: 'Milano Bergamo Havalimanı',    iata: 'BGY' },
        { city: 'Paris',     country: 'Fransa',    name: 'Charles de Gaulle Havalimanı', iata: 'CDG' },
        { city: 'Roma',      country: 'İtalya',    name: 'Roma Fiumicino Havalimanı',    iata: 'FCO' },
        { city: 'Berlin',    country: 'Almanya',   name: 'Berlin Brandenburg Havalimanı',iata: 'BER' },
        { city: 'Londra',    country: 'İngiltere', name: 'Londra Heathrow Havalimanı',   iata: 'LHR' },
        { city: 'Londra',    country: 'İngiltere', name: 'Londra Gatwick Havalimanı',    iata: 'LGW' },
        { city: 'Barselona', country: 'İspanya',   name: 'Barselona El Prat Havalimanı', iata: 'BCN' },
        { city: 'Madrid',    country: 'İspanya',   name: 'Madrid Barajas Havalimanı',    iata: 'MAD' },
        { city: 'Viyana',    country: 'Avusturya', name: 'Viyana Uluslararası Havalimanı',iata: 'VIE' },
        { city: 'Münih',     country: 'Almanya',   name: 'Münih Havalimanı',             iata: 'MUC' }
    ];

    /* ---------------------------------------------------------
       1. POPÜLER ROTALAR VERİSİ
    --------------------------------------------------------- */
    const ROUTES = [
        { fromCity: 'İstanbul', fromIata: 'IST', toCity: 'Amsterdam', toIata: 'AMS', dur: '3 sa 35 dk', price: '4.799', img: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80' },
        { fromCity: 'İstanbul', fromIata: 'IST', toCity: 'Milano',    toIata: 'MXP', dur: '3 sa 05 dk', price: '4.299', img: 'https://images.unsplash.com/photo-1520440229-6469a149ac59?auto=format&fit=crop&w=800&q=80' },
        { fromCity: 'İstanbul', fromIata: 'IST', toCity: 'Paris',     toIata: 'CDG', dur: '3 sa 55 dk', price: '5.150', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
        { fromCity: 'İstanbul', fromIata: 'IST', toCity: 'Roma',      toIata: 'FCO', dur: '2 sa 55 dk', price: '3.999', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
        { fromCity: 'İstanbul', fromIata: 'IST', toCity: 'Berlin',    toIata: 'BER', dur: '3 sa 10 dk', price: '4.450', img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80' },
        { fromCity: 'İstanbul', fromIata: 'IST', toCity: 'Londra',    toIata: 'LHR', dur: '4 sa 05 dk', price: '5.650', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80' }
    ];

    /* ---------------------------------------------------------
       Yardımcı: kısa DOM seçici
    --------------------------------------------------------- */
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* =========================================================
       2. NAVBAR SCROLL DAVRANIŞI
    ========================================================= */
    const navbar = $('#mainNavbar');
    function handleNavbarScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('sr-scrolled');
        } else {
            navbar.classList.remove('sr-scrolled');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    /* =========================================================
       3. AUTOCOMPLETE (kalkış / varış)
    ========================================================= */
    function setupAutocomplete(inputId, resultsId) {
        const input   = $('#' + inputId);
        const results = $('#' + resultsId);

        // Sonuçları çiz
        function render(list) {
            if (!list.length) { results.classList.remove('show'); results.innerHTML = ''; return; }
            results.innerHTML = list.map(a => `
                <div class="sr-ac-item" data-city="${a.city}" data-country="${a.country}" data-iata="${a.iata}">
                    <i class="bi bi-airplane sr-ac-icon"></i>
                    <div class="sr-ac-main">
                        <div class="sr-ac-city">${a.city}, ${a.country}</div>
                        <div class="sr-ac-airport">${a.name}</div>
                    </div>
                    <span class="sr-ac-iata">${a.iata}</span>
                </div>`).join('');
            results.classList.add('show');

            // Seçim olayları
            $$('.sr-ac-item', results).forEach(item => {
                item.addEventListener('mousedown', function (e) {
                    e.preventDefault(); // input blur'unu engelle
                    input.value = `${this.dataset.city}, ${this.dataset.country} — ${this.dataset.iata}`;
                    input.dataset.iata = this.dataset.iata;
                    results.classList.remove('show');
                    clearError(input);
                });
            });
        }

        // Filtreleme (şehir, havalimanı adı, IATA, ülke)
        function filter(q) {
            q = q.trim().toLocaleLowerCase('tr');
            if (!q) return AIRPORTS.slice(0, 6);
            return AIRPORTS.filter(a =>
                a.city.toLocaleLowerCase('tr').includes(q) ||
                a.name.toLocaleLowerCase('tr').includes(q) ||
                a.country.toLocaleLowerCase('tr').includes(q) ||
                a.iata.toLowerCase().includes(q)
            ).slice(0, 7);
        }

        input.addEventListener('input', () => { input.dataset.iata = ''; render(filter(input.value)); });
        input.addEventListener('focus', () => render(filter(input.value)));
        input.addEventListener('blur',  () => setTimeout(() => results.classList.remove('show'), 150));
    }
    setupAutocomplete('fromInput', 'fromResults');
    setupAutocomplete('toInput', 'toResults');

    /* =========================================================
       4. YÖN DEĞİŞTİRME (kalkış <-> varış)
    ========================================================= */
    const fromInput = $('#fromInput');
    const toInput   = $('#toInput');
    const swapBtn   = $('#swapBtn');

    swapBtn.addEventListener('click', () => {
        // Değerleri değiştir
        const tmpVal  = fromInput.value;
        const tmpIata = fromInput.dataset.iata || '';
        fromInput.value = toInput.value;
        fromInput.dataset.iata = toInput.dataset.iata || '';
        toInput.value = tmpVal;
        toInput.dataset.iata = tmpIata;
        // Kısa dönme animasyonu
        swapBtn.classList.toggle('sr-rotate');
        clearError(fromInput); clearError(toInput);
    });

    /* =========================================================
       5. SEYAHAT TİPİ — dönüş tarihi göster/gizle
    ========================================================= */
    const returnWrap = $('#returnWrap');
    const returnDate = $('#returnDate');

    function updateTripType() {
        const type = $('input[name="tripType"]:checked').value;
        if (type === 'oneway') {
            returnWrap.style.display = 'none';   // tek yön: dönüş gizli
            returnDate.value = '';
        } else {
            returnWrap.style.display = '';        // gidiş-dönüş / çoklu: dönüş açık
        }
    }
    $$('input[name="tripType"]').forEach(r => r.addEventListener('change', updateTripType));
    updateTripType();

    /* =========================================================
       6. TARİH KISITLAMALARI
    ========================================================= */
    const departDate = $('#departDate');
    const today = new Date().toISOString().split('T')[0];
    departDate.min = today;      // geçmiş tarih seçilemez
    returnDate.min = today;

    // Gidiş değişince dönüşün alt sınırı güncellensin
    departDate.addEventListener('change', () => {
        returnDate.min = departDate.value || today;
        if (returnDate.value && returnDate.value < departDate.value) {
            returnDate.value = departDate.value;
        }
        clearError(departDate);
    });

    /* =========================================================
       7. YOLCU SAYACI
    ========================================================= */
    const counts = { adult: 1, child: 0, infant: 0 };
    const MAX_TOTAL = 9;

    const els = {
        adult:  $('#adultCount'),
        child:  $('#childCount'),
        infant: $('#infantCount')
    };
    const paxNote = $('#paxNote');

    function totalPassengers() { return counts.adult + counts.child + counts.infant; }

    function updatePassengerUI() {
        // Rakamları yaz
        els.adult.textContent  = counts.adult;
        els.child.textContent  = counts.child;
        els.infant.textContent = counts.infant;

        // Özet metni (toplam yolcu)
        $('#passengerSummary').textContent = `${totalPassengers()} Yolcu`;

        // Buton durumlarını (disabled) güncelle
        $$('.sr-step-btn').forEach(btn => {
            const type   = btn.dataset.type;
            const action = btn.dataset.action;
            let disabled = false;

            if (action === 'dec') {
                // Yetişkin en az 1; diğerleri en az 0
                if (type === 'adult')  disabled = counts.adult <= 1;
                else                   disabled = counts[type] <= 0;
            } else { // inc
                if (totalPassengers() >= MAX_TOTAL) disabled = true;
                // Bebek sayısı yetişkin sayısını geçemez
                if (type === 'infant' && counts.infant >= counts.adult) disabled = true;
            }
            btn.disabled = disabled;
        });

        // Uyarı notu
        if (counts.infant >= counts.adult && counts.infant > 0) {
            paxNote.textContent = 'Bebek sayısı yetişkin sayısını geçemez.';
        } else if (totalPassengers() >= MAX_TOTAL) {
            paxNote.textContent = 'En fazla 9 yolcu seçebilirsin.';
        } else {
            paxNote.textContent = '';
        }
    }

    $$('.sr-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type   = btn.dataset.type;
            const action = btn.dataset.action;

            if (action === 'inc') {
                if (totalPassengers() >= MAX_TOTAL) return;
                if (type === 'infant' && counts.infant >= counts.adult) return; // bebek <= yetişkin
                counts[type]++;
            } else {
                if (type === 'adult' && counts.adult <= 1) return;   // en az 1 yetişkin
                if (counts[type] <= 0) return;
                counts[type]--;
                // Yetişkin azalınca bebek fazlaysa düzelt
                if (type === 'adult' && counts.infant > counts.adult) counts.infant = counts.adult;
            }
            updatePassengerUI();
        });
    });
    updatePassengerUI();

    /* Kabin sınıfı özeti */
    const cabinClass = $('#cabinClass');
    const cabinLabels = { economy: 'Ekonomi', premium: 'Premium Ekonomi', business: 'Business', first: 'First Class' };
    cabinClass.addEventListener('change', () => {
        $('#cabinSummary').textContent = cabinLabels[cabinClass.value];
    });

    /* Yolcu dropdown "Tamam" butonu — menüyü kapat */
    $('#paxDone').addEventListener('click', () => {
        const toggle = $('#passengerToggle');
        const dd = bootstrap.Dropdown.getInstance(toggle) || new bootstrap.Dropdown(toggle);
        dd.hide();
    });

    /* =========================================================
       8. POPÜLER ROTA KARTLARINI OLUŞTUR
    ========================================================= */
    const routesRow = $('.sr-routes-row');
    // İlk boş kolon placeholder'ı temizle
    routesRow.innerHTML = '';

    ROUTES.forEach(r => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4';
        col.innerHTML = `
            <div class="sr-route-card" data-from-city="${r.fromCity}" data-from-iata="${r.fromIata}"
                 data-to-city="${r.toCity}" data-to-iata="${r.toIata}">
                <div class="sr-route-media" style="background-image:url('${r.img}')">
                    <span class="sr-route-duration"><i class="bi bi-clock"></i>${r.dur}</span>
                </div>
                <div class="sr-route-body">
                    <div class="sr-route-path">
                        <div class="sr-route-point">
                            <div class="sr-route-city">${r.fromCity}</div>
                            <div class="sr-route-iata">${r.fromIata}</div>
                        </div>
                        <i class="bi bi-airplane sr-route-arrow"></i>
                        <div class="sr-route-point">
                            <div class="sr-route-city">${r.toCity}</div>
                            <div class="sr-route-iata">${r.toIata}</div>
                        </div>
                    </div>
                    <div class="sr-route-price">₺${r.price}'dan başlayan fiyatlarla</div>
                    <button type="button" class="btn btn-sr-outline sr-route-btn">
                        <i class="bi bi-search me-1"></i>Uçuşları Gör
                    </button>
                </div>
            </div>`;
        routesRow.appendChild(col);

        // Karta tıklayınca arama formunu otomatik doldur
        col.querySelector('.sr-route-btn').addEventListener('click', () => {
            fromInput.value = `${r.fromCity}, Türkiye — ${r.fromIata}`;
            fromInput.dataset.iata = r.fromIata;
            const toEntry = AIRPORTS.find(a => a.iata === r.toIata);
            toInput.value = `${r.toCity}, ${toEntry ? toEntry.country : ''} — ${r.toIata}`;
            toInput.dataset.iata = r.toIata;
            clearError(fromInput); clearError(toInput);
            // Arama paneline yumuşak kaydır
            $('#aramaPaneli').scrollIntoView({ behavior: 'smooth', block: 'center' });
            showToast(`${r.fromCity} → ${r.toCity} rotası forma eklendi.`, 'success');
        });
    });

    /* =========================================================
       9. DOĞRULAMA YARDIMCILARI
    ========================================================= */
    function setError(input, message) {
        input.classList.add('is-invalid');
        const wrap = input.closest('.sr-field-wrap');
        if (!wrap) return;
        const errEl = wrap.querySelector('.sr-error');
        if (errEl) errEl.textContent = message;
    }
    function clearError(input) {
        input.classList.remove('is-invalid');
        const wrap = input.closest('.sr-field-wrap');
        if (!wrap) return;
        const errEl = wrap.querySelector('.sr-error');
        if (errEl) errEl.textContent = '';
    }

    // Bir IATA kodunu metinden çıkar (autocomplete seçilmemiş olsa bile)
    function resolveIata(input) {
        if (input.dataset.iata) return input.dataset.iata;
        const val = input.value.trim().toLocaleLowerCase('tr');
        if (!val) return '';
        const match = AIRPORTS.find(a =>
            val.includes(a.iata.toLowerCase()) ||
            val.includes(a.city.toLocaleLowerCase('tr'))
        );
        return match ? match.iata : '';
    }

    /* =========================================================
       10. ARAMA FORMU GÖNDERİMİ
    ========================================================= */
    const form      = $('#flightSearchForm');
    const searchBtn = $('#searchBtn');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let valid = true;
        const tripType = $('input[name="tripType"]:checked').value;

        // Kalkış
        const fromIata = resolveIata(fromInput);
        if (!fromInput.value.trim()) { setError(fromInput, 'Kalkış noktası seçin.'); valid = false; }
        else if (!fromIata)          { setError(fromInput, 'Geçerli bir havalimanı seçin.'); valid = false; }
        else clearError(fromInput);

        // Varış
        const toIata = resolveIata(toInput);
        if (!toInput.value.trim()) { setError(toInput, 'Varış noktası seçin.'); valid = false; }
        else if (!toIata)          { setError(toInput, 'Geçerli bir havalimanı seçin.'); valid = false; }
        else clearError(toInput);

        // Aynı nokta olamaz
        if (fromIata && toIata && fromIata === toIata) {
            setError(toInput, 'Kalkış ve varış aynı olamaz.'); valid = false;
        }

        // Gidiş tarihi
        if (!departDate.value) { setError(departDate, 'Gidiş tarihi seçin.'); valid = false; }
        else clearError(departDate);

        // Dönüş tarihi (yalnızca gidiş-dönüşte zorunlu)
        if (tripType === 'round') {
            if (!returnDate.value) { setError(returnDate, 'Dönüş tarihi seçin.'); valid = false; }
            else if (departDate.value && returnDate.value < departDate.value) {
                setError(returnDate, 'Dönüş, gidişten önce olamaz.'); valid = false;
            } else clearError(returnDate);
        }

        if (!valid) { showToast('Lütfen eksik alanları kontrol et.', 'error'); return; }

        // -------- Parametreleri topla (2. sayfaya aktarılabilir) --------
        const params = new URLSearchParams({
            from:      fromInput.value.trim(),
            to:        toInput.value.trim(),
            fromIata:  fromIata,
            toIata:    toIata,
            depart:    departDate.value,
            return:    returnDate.value || '',
            adults:    counts.adult,
            children:  counts.child,
            infants:   counts.infant,
            cabin:     cabinClass.value,
            currency:  $('#currencySelect').value,
            tripType:  tripType,
            directOnly: $('#directOnly').checked ? '1' : '0'
        });

        // -------- Loading durumu --------
        searchBtn.disabled = true;
        $('.sr-btn-label', searchBtn).classList.add('d-none');
        $('.sr-btn-loading', searchBtn).classList.remove('d-none');

        // Sonuç sayfasına geçiş simülasyonu (gerçek API yok)
        setTimeout(() => {
            const target = 'flight-list.html?' + params.toString();
            showToast('Uygun uçuşlar bulundu, yönlendiriliyorsun...', 'success');
            console.log('Yönlendirme (simülasyon):', target);

            // Gerçek yönlendirme burada aktifleştirilebilir:
            // window.location.href = target;

            // Butonu eski haline döndür
            setTimeout(() => {
                searchBtn.disabled = false;
                $('.sr-btn-label', searchBtn).classList.remove('d-none');
                $('.sr-btn-loading', searchBtn).classList.add('d-none');
            }, 900);
        }, 1600);
    });

    /* =========================================================
       11. BÜLTEN ABONELİĞİ
    ========================================================= */
    const newsletterForm  = $('#newsletterForm');
    const newsletterEmail = $('#newsletterEmail');
    const newsletterError = $('#newsletterError');
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const val = newsletterEmail.value.trim();
        if (!val) {
            newsletterError.textContent = 'E-posta adresi gerekli.';
            newsletterEmail.classList.add('is-invalid');
        } else if (!EMAIL_RE.test(val)) {
            newsletterError.textContent = 'Geçerli bir e-posta adresi gir.';
            newsletterEmail.classList.add('is-invalid');
        } else {
            newsletterError.textContent = '';
            newsletterEmail.classList.remove('is-invalid');
            newsletterEmail.value = '';
            showToast('Aboneliğiniz başarıyla oluşturuldu.', 'success');
        }
    });
    newsletterEmail.addEventListener('input', () => {
        newsletterEmail.classList.remove('is-invalid');
        newsletterError.textContent = '';
    });

    /* =========================================================
       12. TOAST BİLDİRİMİ
    ========================================================= */
    function showToast(message, type) {
        const toastEl = $('#srToast');
        $('#srToastBody').textContent = message;
        toastEl.classList.remove('sr-toast-success', 'sr-toast-error');
        if (type === 'success') toastEl.classList.add('sr-toast-success');
        if (type === 'error')   toastEl.classList.add('sr-toast-error');
        const toast = bootstrap.Toast.getInstance(toastEl) || new bootstrap.Toast(toastEl, { delay: 3500 });
        toast.show();
    }

})();
