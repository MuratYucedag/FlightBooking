/* =========================================================
   SkyRoute — flight-list.js
   Uçuş sonuçları: statik veri, filtreleme, sıralama,
   detay açma, seçim modalı, daha fazla gösterme
   ========================================================= */

(function () {
    'use strict';

    /* Kısa DOM seçiciler */
    const $  = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

    /* Para birimi biçimlendirme (₺) */
    const fmtPrice = n => '₺' + n.toLocaleString('tr-TR');

    /* Havayolu görsel kimlikleri (logo kısaltma + CSS sınıfı) */
    const AIRLINE_STYLE = {
        'TK': { cls: 'sr-logo-thy',  dot: 'sr-dot-thy',  short: 'THY' },
        'PC': { cls: 'sr-logo-pgs',  dot: 'sr-dot-pgs',  short: 'PGS' },
        'VF': { cls: 'sr-logo-ajet', dot: 'sr-dot-ajet', short: 'AJ'  }
    };

    /* =========================================================
       8. STATİK UÇUŞ VERİLERİ (10 uçuş)
    ========================================================= */
    const FLIGHTS = [
        {
            id: 1, airline: 'Türk Hava Yolları', airlineCode: 'TK', airlineLogo: 'TK',
            flightNumber: 'TK 1951', aircraft: 'Airbus A321',
            departureAirport: 'IST', departureAirportName: 'İstanbul Havalimanı', departureTime: '08:30',
            arrivalAirport: 'AMS', arrivalAirportName: 'Amsterdam Schiphol', arrivalTime: '11:05',
            durationMinutes: 215, durationText: '3 sa. 35 dk.', stops: 0, layoverAirport: null,
            cabinBaggage: 1, checkedBaggage: '20 kg', price: 4850, currency: 'TRY',
            features: ['Yemek dahil', 'Ücretsiz Wi-Fi'], flexibleTicket: true, carbonEmission: 'Ortalama', badge: 'recommended'
        },
        {
            id: 2, airline: 'Pegasus', airlineCode: 'PC', airlineLogo: 'PC',
            flightNumber: 'PC 1251', aircraft: 'Airbus A320neo',
            departureAirport: 'SAW', departureAirportName: 'Sabiha Gökçen', departureTime: '09:10',
            arrivalAirport: 'AMS', arrivalAirportName: 'Amsterdam Schiphol', arrivalTime: '12:15',
            durationMinutes: 245, durationText: '4 sa. 05 dk.', stops: 0, layoverAirport: null,
            cabinBaggage: 1, checkedBaggage: null, price: 3790, currency: 'TRY',
            features: ['Koltuk seçimi'], flexibleTicket: false, carbonEmission: 'Düşük', badge: 'cheapest'
        },
        {
            id: 3, airline: 'AJet', airlineCode: 'VF', airlineLogo: 'VF',
            flightNumber: 'VF 501', aircraft: 'Boeing 737-800',
            departureAirport: 'SAW', departureAirportName: 'Sabiha Gökçen', departureTime: '06:40',
            arrivalAirport: 'AMS', arrivalAirportName: 'Amsterdam Schiphol', arrivalTime: '09:55',
            durationMinutes: 255, durationText: '4 sa. 15 dk.', stops: 0, layoverAirport: null,
            cabinBaggage: 1, checkedBaggage: '15 kg', price: 4120, currency: 'TRY',
            features: ['Koltuk seçimi'], flexibleTicket: false, carbonEmission: 'Ortalama', badge: null
        },
        {
            id: 4, airline: 'Türk Hava Yolları', airlineCode: 'TK', airlineLogo: 'TK',
            flightNumber: 'TK 1953', aircraft: 'Airbus A330',
            departureAirport: 'IST', departureAirportName: 'İstanbul Havalimanı', departureTime: '11:45',
            arrivalAirport: 'AMS', arrivalAirportName: 'Amsterdam Schiphol', arrivalTime: '14:05',
            durationMinutes: 200, durationText: '3 sa. 20 dk.', stops: 0, layoverAirport: null,
            cabinBaggage: 1, checkedBaggage: '20 kg', price: 5420, currency: 'TRY',
            features: ['Yemek dahil', 'Ücretsiz Wi-Fi', 'Koltuk seçimi'], flexibleTicket: true, carbonEmission: 'Ortalama', badge: 'fastest'
        },
        {
            id: 5, airline: 'Pegasus', airlineCode: 'PC', airlineLogo: 'PC',
            flightNumber: 'PC 1253', aircraft: 'Airbus A321neo',
            departureAirport: 'SAW', departureAirportName: 'Sabiha Gökçen', departureTime: '14:20',
            arrivalAirport: 'AMS', arrivalAirportName: 'Amsterdam Schiphol', arrivalTime: '17:35',
            durationMinutes: 255, durationText: '4 sa. 15 dk.', stops: 0, layoverAirport: null,
            cabinBaggage: 1, checkedBaggage: null, price: 4290, currency: 'TRY',
            features: ['Düşük emisyon'], flexibleTicket: false, carbonEmission: 'Düşük', badge: null
        },
        {
            id: 6, airline: 'AJet', airlineCode: 'VF', airlineLogo: 'VF',
            flightNumber: 'VF 503', aircraft: 'Boeing 737 MAX 8',
            departureAirport: 'SAW', departureAirportName: 'Sabiha Gökçen', departureTime: '17:10',
            arrivalAirport: 'AMS', arrivalAirportName: 'Amsterdam Schiphol', arrivalTime: '20:30',
            durationMinutes: 260, durationText: '4 sa. 20 dk.', stops: 0, layoverAirport: null,
            cabinBaggage: 1, checkedBaggage: '15 kg', price: 4470, currency: 'TRY',
            features: ['Düşük emisyon', 'Koltuk seçimi'], flexibleTicket: false, carbonEmission: 'Düşük', badge: null
        },
        {
            id: 7, airline: 'Türk Hava Yolları', airlineCode: 'TK', airlineLogo: 'TK',
            flightNumber: 'TK 1955', aircraft: 'Airbus A321',
            departureAirport: 'IST', departureAirportName: 'İstanbul Havalimanı', departureTime: '18:35',
            arrivalAirport: 'AMS', arrivalAirportName: 'Amsterdam Schiphol', arrivalTime: '21:10',
            durationMinutes: 215, durationText: '3 sa. 35 dk.', stops: 0, layoverAirport: null,
            cabinBaggage: 1, checkedBaggage: '20 kg', price: 5690, currency: 'TRY',
            features: ['Yemek dahil', 'Ücretsiz Wi-Fi'], flexibleTicket: true, carbonEmission: 'Ortalama', badge: null
        },
        {
            id: 8, airline: 'Pegasus', airlineCode: 'PC', airlineLogo: 'PC',
            flightNumber: 'PC 903', aircraft: 'Airbus A320',
            departureAirport: 'SAW', departureAirportName: 'Sabiha Gökçen', departureTime: '07:20',
            arrivalAirport: 'AMS', arrivalAirportName: 'Amsterdam Schiphol', arrivalTime: '13:15',
            durationMinutes: 415, durationText: '6 sa. 55 dk.', stops: 1, layoverAirport: 'Belgrad BEG',
            cabinBaggage: 1, checkedBaggage: null, price: 3590, currency: 'TRY',
            features: ['Koltuk seçimi'], flexibleTicket: false, carbonEmission: 'Yüksek', badge: null
        },
        {
            id: 9, airline: 'AJet', airlineCode: 'VF', airlineLogo: 'VF',
            flightNumber: 'VF 505', aircraft: 'Boeing 737-800',
            departureAirport: 'SAW', departureAirportName: 'Sabiha Gökçen', departureTime: '20:15',
            arrivalAirport: 'AMS', arrivalAirportName: 'Amsterdam Schiphol', arrivalTime: '23:35',
            durationMinutes: 260, durationText: '4 sa. 20 dk.', stops: 0, layoverAirport: null,
            cabinBaggage: 1, checkedBaggage: '15 kg', price: 4650, currency: 'TRY',
            features: ['Koltuk seçimi'], flexibleTicket: false, carbonEmission: 'Ortalama', badge: null
        },
        {
            id: 10, airline: 'Türk Hava Yolları', airlineCode: 'TK', airlineLogo: 'TK',
            flightNumber: 'TK 1767', aircraft: 'Airbus A320',
            departureAirport: 'IST', departureAirportName: 'İstanbul Havalimanı', departureTime: '15:30',
            arrivalAirport: 'AMS', arrivalAirportName: 'Amsterdam Schiphol', arrivalTime: '21:45',
            durationMinutes: 435, durationText: '7 sa. 15 dk.', stops: 1, layoverAirport: 'Frankfurt FRA',
            cabinBaggage: 1, checkedBaggage: '20 kg', price: 4390, currency: 'TRY',
            features: ['Yemek dahil', 'Değişiklik hakkı'], flexibleTicket: true, carbonEmission: 'Yüksek', badge: null
        }
    ];

    /* Seyahat tarihi (detay/modal için sabit) */
    const TRAVEL_DATE = '18 Ağustos 2026 Salı';

    /* Sayfa durumu */
    const state = {
        sort: 'recommended',
        visibleLimit: 6,          // ilk açılışta 6 uçuş
        filtered: [...FLIGHTS],
        filtersActive: false
    };

    /* İkon etiket eşlemesi (özellik -> ikon) */
    const FEATURE_ICONS = {
        'Ücretsiz Wi-Fi':  'bi-wifi',
        'Koltuk seçimi':   'bi-grid-3x3-gap',
        'Değişiklik hakkı':'bi-arrow-repeat',
        'Düşük emisyon':   'bi-leaf',
        'Yemek dahil':     'bi-cup-hot'
    };

    /* =========================================================
       FİLTRE PANELİ HTML'İ (masaüstü + mobil için aynı üretilir)
    ========================================================= */
    function filterPanelHTML(suffix) {
        // Aktarma sayıları
        const direct = FLIGHTS.filter(f => f.stops === 0).length;
        const one    = FLIGHTS.filter(f => f.stops === 1).length;
        const two    = FLIGHTS.filter(f => f.stops >= 2).length;
        // Havayolu sayıları
        const thy = FLIGHTS.filter(f => f.airlineCode === 'TK').length;
        const pgs = FLIGHTS.filter(f => f.airlineCode === 'PC').length;
        const ajt = FLIGHTS.filter(f => f.airlineCode === 'VF').length;

        return `
        <div class="sr-filter-head">
            <h2 class="sr-filter-title">Filtreler</h2>
            <button class="sr-clear-link" data-clear="${suffix}">Tüm Filtreleri Temizle</button>
        </div>

        <!-- Aktarma sayısı -->
        <div class="sr-filter-group">
            <div class="sr-filter-group-title">Aktarma Sayısı</div>
            <div class="sr-check">
                <div class="form-check">
                    <input class="form-check-input f-stop" type="checkbox" value="0" id="stop0_${suffix}">
                    <label class="form-check-label" for="stop0_${suffix}">Direkt</label>
                </div>
                <span class="sr-check-count">(${direct})</span>
            </div>
            <div class="sr-check">
                <div class="form-check">
                    <input class="form-check-input f-stop" type="checkbox" value="1" id="stop1_${suffix}">
                    <label class="form-check-label" for="stop1_${suffix}">1 Aktarma</label>
                </div>
                <span class="sr-check-count">(${one})</span>
            </div>
            <div class="sr-check">
                <div class="form-check">
                    <input class="form-check-input f-stop" type="checkbox" value="2" id="stop2_${suffix}">
                    <label class="form-check-label" for="stop2_${suffix}">2 veya Daha Fazla</label>
                </div>
                <span class="sr-check-count">(${two})</span>
            </div>
        </div>

        <!-- Havayolları -->
        <div class="sr-filter-group">
            <div class="sr-filter-group-title">Havayolları</div>
            <div class="sr-check">
                <div class="form-check">
                    <input class="form-check-input f-airline" type="checkbox" value="TK" id="al_tk_${suffix}">
                    <label class="form-check-label" for="al_tk_${suffix}"><span class="sr-airline-dot sr-dot-thy">TK</span>Türk Hava Yolları</label>
                </div>
                <span class="sr-check-count">(${thy})</span>
            </div>
            <div class="sr-check">
                <div class="form-check">
                    <input class="form-check-input f-airline" type="checkbox" value="PC" id="al_pc_${suffix}">
                    <label class="form-check-label" for="al_pc_${suffix}"><span class="sr-airline-dot sr-dot-pgs">PC</span>Pegasus</label>
                </div>
                <span class="sr-check-count">(${pgs})</span>
            </div>
            <div class="sr-check">
                <div class="form-check">
                    <input class="form-check-input f-airline" type="checkbox" value="VF" id="al_vf_${suffix}">
                    <label class="form-check-label" for="al_vf_${suffix}"><span class="sr-airline-dot sr-dot-ajet">VF</span>AJet</label>
                </div>
                <span class="sr-check-count">(${ajt})</span>
            </div>
        </div>

        <!-- Fiyat aralığı -->
        <div class="sr-filter-group">
            <div class="sr-filter-group-title">Fiyat Aralığı</div>
            <input type="range" class="sr-range f-price" min="2500" max="12000" step="10" value="12000" id="price_${suffix}">
            <div class="sr-range-value">En fazla <span class="price-val">₺12.000</span></div>
            <div class="sr-range-scale"><span>₺2.500</span><span>₺12.000</span></div>
        </div>

        <!-- Kalkış saati -->
        <div class="sr-filter-group">
            <div class="sr-filter-group-title">Kalkış Saati</div>
            <div class="sr-time-grid">
                <div class="sr-time-card">
                    <input type="checkbox" class="f-time" value="morning" id="tm_m_${suffix}">
                    <label for="tm_m_${suffix}"><i class="bi bi-sunrise"></i>Sabah<small>06–12</small></label>
                </div>
                <div class="sr-time-card">
                    <input type="checkbox" class="f-time" value="noon" id="tm_n_${suffix}">
                    <label for="tm_n_${suffix}"><i class="bi bi-sun"></i>Öğle<small>12–18</small></label>
                </div>
                <div class="sr-time-card">
                    <input type="checkbox" class="f-time" value="evening" id="tm_e_${suffix}">
                    <label for="tm_e_${suffix}"><i class="bi bi-sunset"></i>Akşam<small>18–24</small></label>
                </div>
                <div class="sr-time-card">
                    <input type="checkbox" class="f-time" value="night" id="tm_g_${suffix}">
                    <label for="tm_g_${suffix}"><i class="bi bi-moon-stars"></i>Gece<small>00–06</small></label>
                </div>
            </div>
        </div>

        <!-- Uçuş süresi -->
        <div class="sr-filter-group">
            <div class="sr-filter-group-title">Uçuş Süresi</div>
            <input type="range" class="sr-range f-duration" min="180" max="480" step="30" value="480" id="dur_${suffix}">
            <div class="sr-range-value"><span class="dur-val">Tümü</span></div>
            <div class="sr-range-scale"><span>3 sa</span><span>Tümü</span></div>
        </div>

        <!-- Bagaj -->
        <div class="sr-filter-group">
            <div class="sr-filter-group-title">Bagaj</div>
            <div class="sr-check">
                <div class="form-check">
                    <input class="form-check-input f-cabin" type="checkbox" id="bagCabin_${suffix}">
                    <label class="form-check-label" for="bagCabin_${suffix}">Kabin bagajı dahil</label>
                </div>
            </div>
            <div class="sr-check">
                <div class="form-check">
                    <input class="form-check-input f-checked" type="checkbox" id="bagChecked_${suffix}">
                    <label class="form-check-label" for="bagChecked_${suffix}">Kayıtlı bagaj dahil</label>
                </div>
            </div>
        </div>

        <!-- Esnek bilet -->
        <div class="sr-filter-group">
            <div class="sr-filter-group-title">Esnek Bilet</div>
            <div class="sr-check">
                <div class="form-check">
                    <input class="form-check-input f-flex" type="checkbox" id="flex_${suffix}">
                    <label class="form-check-label" for="flex_${suffix}">Değişiklik hakkı bulunan uçuşlar</label>
                </div>
            </div>
        </div>`;
    }

    /* =========================================================
       6. ÖNERİLEN SEÇENEK KARTLARI
    ========================================================= */
    function renderSuggestions() {
        const best    = FLIGHTS.find(f => f.badge === 'recommended');
        const cheapest= FLIGHTS.find(f => f.badge === 'cheapest');
        const fastest = FLIGHTS.find(f => f.badge === 'fastest');

        const card = (tag, icon, sortKey, f) => `
            <button class="sr-suggest-card" data-sort="${sortKey}">
                <span class="sr-suggest-tag"><i class="bi ${icon}"></i>${tag}</span>
                <div class="sr-suggest-price">${fmtPrice(f.price)}</div>
                <div class="sr-suggest-meta">${f.durationText} · ${f.stops === 0 ? 'Direkt' : f.stops + ' Aktarma'}</div>
            </button>`;

        $('#suggestRow').innerHTML =
            card('En İyi Seçenek', 'bi-award', 'recommended', best) +
            card('En Ucuz', 'bi-piggy-bank', 'price', cheapest) +
            card('En Hızlı', 'bi-lightning-charge', 'duration', fastest);

        // Karta tıklayınca ilgili kritere göre sırala
        $$('.sr-suggest-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.sort;
                $('#sortSelect').value = key;
                state.sort = key;
                $$('.sr-suggest-card').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                applyAndRender();
            });
        });
    }

    /* =========================================================
       7. UÇUŞ KARTI HTML'İ
    ========================================================= */
    function flightCardHTML(f) {
        const st = AIRLINE_STYLE[f.airlineCode];

        // Rozet
        let badgeHTML = '';
        if (f.badge === 'recommended') badgeHTML = '<span class="sr-badge sr-badge-best">Önerilen</span>';
        else if (f.badge === 'cheapest') badgeHTML = '<span class="sr-badge sr-badge-cheap">En Ucuz</span>';
        else if (f.badge === 'fastest')  badgeHTML = '<span class="sr-badge sr-badge-fast">En Hızlı</span>';

        // Varış ertesi güne kalıyor mu? (varış < kalkış ise +1 gün)
        const depMin = toMinutes(f.departureTime);
        const arrMin = toMinutes(f.arrivalTime);
        const nextDay = (arrMin < depMin) ? '<span class="sr-nextday">+1 gün</span>' : '';

        // Aktarma / direkt orta bölüm
        const stopMid = f.stops === 0
            ? '<span class="sr-route-plane"><i class="bi bi-airplane-fill"></i></span>'
            : '<span class="sr-route-stop-dot"></span>';
        const stopText = f.stops === 0
            ? '<div class="sr-route-stops sr-stops-direct">Direkt</div>'
            : `<div class="sr-route-stops sr-stops-layover">${f.stops} Aktarma · ${f.layoverAirport}</div>`;

        // Bagaj
        const cabinBag = `<span class="sr-bag-item"><i class="bi bi-handbag"></i>${f.cabinBaggage} adet kabin bagajı</span>`;
        const checkedBag = f.checkedBaggage
            ? `<span class="sr-bag-item"><i class="bi bi-suitcase2"></i>${f.checkedBaggage} kayıtlı bagaj</span>`
            : `<span class="sr-bag-item sr-bag-paid"><i class="bi bi-suitcase"></i>Kayıtlı bagaj ücretli</span>`;

        // Özellik etiketleri
        const tags = f.features.map(ft => {
            const icon = FEATURE_ICONS[ft] || 'bi-check-circle';
            const green = (ft === 'Düşük emisyon') ? ' sr-tag-green' : '';
            return `<span class="sr-tag${green}"><i class="bi ${icon}"></i>${ft}</span>`;
        }).join('');

        return `
        <article class="sr-flight-card" data-id="${f.id}">
            <div class="sr-flight-main">
                <!-- Sol: uçuş bilgisi -->
                <div class="sr-flight-info">
                    <!-- Havayolu -->
                    <div class="sr-airline-row">
                        <span class="sr-airline-logo ${st.cls}">${st.short}</span>
                        <div class="sr-airline-meta">
                            <div class="sr-airline-name">${f.airline}</div>
                            <div class="sr-airline-sub">${f.flightNumber} · ${f.aircraft}</div>
                        </div>
                        ${badgeHTML}
                    </div>

                    <!-- Rota -->
                    <div class="sr-route-row">
                        <div class="sr-endpoint">
                            <div class="sr-endpoint-time">${f.departureTime}</div>
                            <div class="sr-endpoint-iata">${f.departureAirport}</div>
                            <div class="sr-endpoint-name">${f.departureAirportName}</div>
                        </div>
                        <div class="sr-route-mid">
                            <div class="sr-route-duration">${f.durationText}</div>
                            <div class="sr-route-line">${stopMid}</div>
                            ${stopText}
                        </div>
                        <div class="sr-endpoint">
                            <div class="sr-endpoint-time">${f.arrivalTime}${nextDay}</div>
                            <div class="sr-endpoint-iata">${f.arrivalAirport}</div>
                            <div class="sr-endpoint-name">${f.arrivalAirportName}</div>
                        </div>
                    </div>

                    <!-- Bagaj + etiketler -->
                    <div class="sr-flight-extras">
                        <div class="sr-baggage">${cabinBag}${checkedBag}</div>
                        <div class="sr-tags">${tags}</div>
                    </div>
                </div>

                <!-- Sağ: fiyat -->
                <div class="sr-flight-price">
                    <div class="sr-price-block">
                        <span class="sr-price-label">Kişi başı</span>
                        <span class="sr-price-amount">${fmtPrice(f.price)}</span>
                        <span class="sr-price-tax">Vergiler dahil</span>
                    </div>
                    <button class="btn btn-sr-select" data-select="${f.id}">Uçuşu Seç</button>
                </div>
            </div>

            <!-- Uçuş detayları bağlantısı -->
            <div class="sr-detail-toggle">
                <button class="sr-detail-btn" type="button" data-bs-toggle="collapse" data-bs-target="#detail_${f.id}" aria-expanded="false">
                    Uçuş Detayları <i class="bi bi-chevron-down"></i>
                </button>
            </div>

            <!-- Detay içeriği (collapse) -->
            <div class="collapse" id="detail_${f.id}">
                <div class="sr-detail-body">
                    <div class="sr-detail-grid">
                        <div class="sr-detail-block">
                            <i class="bi bi-airplane"></i>
                            <div>
                                <div class="sr-detail-label">Kalkış</div>
                                <div class="sr-detail-value">${TRAVEL_DATE}, ${f.departureTime}<br><small>${f.departureAirportName}, Dış Hatlar Terminali</small></div>
                            </div>
                        </div>
                        <div class="sr-detail-block">
                            <i class="bi bi-geo-alt"></i>
                            <div>
                                <div class="sr-detail-label">Varış</div>
                                <div class="sr-detail-value">${TRAVEL_DATE}, ${f.arrivalTime}${nextDay ? ' (+1 gün)' : ''}<br><small>${f.arrivalAirportName}, Terminal 1</small></div>
                            </div>
                        </div>
                        <div class="sr-detail-block">
                            <i class="bi bi-ticket-detailed"></i>
                            <div>
                                <div class="sr-detail-label">Uçuş & Uçak</div>
                                <div class="sr-detail-value">${f.flightNumber} · ${f.aircraft}<br><small>Kabin: Ekonomi</small></div>
                            </div>
                        </div>
                        <div class="sr-detail-block">
                            <i class="bi bi-suitcase2"></i>
                            <div>
                                <div class="sr-detail-label">Bagaj</div>
                                <div class="sr-detail-value">${f.cabinBaggage} kabin bagajı<br><small>${f.checkedBaggage ? f.checkedBaggage + ' kayıtlı bagaj' : 'Kayıtlı bagaj ücretli'}</small></div>
                            </div>
                        </div>
                        <div class="sr-detail-block">
                            <i class="bi bi-rulers"></i>
                            <div>
                                <div class="sr-detail-label">Koltuk Mesafesi</div>
                                <div class="sr-detail-value">${f.aircraft.includes('A330') ? '81 cm' : '76 cm'}<br><small>Standart ekonomi</small></div>
                            </div>
                        </div>
                        <div class="sr-detail-block">
                            <i class="bi bi-leaf"></i>
                            <div>
                                <div class="sr-detail-label">Karbon Emisyonu</div>
                                <div class="sr-detail-value">${f.carbonEmission}<br><small>${f.flexibleTicket ? 'Bilet değişikliğine açık' : 'Bilet değişikliği ücretlidir'}</small></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>`;
    }

    /* =========================================================
       YARDIMCI: "08:30" -> dakika
    ========================================================= */
    function toMinutes(hhmm) {
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
    }
    /* Kalkış saatinin hangi dilime düştüğü */
    function timeSlot(hhmm) {
        const m = toMinutes(hhmm);
        if (m >= 360 && m < 720)  return 'morning';   // 06–12
        if (m >= 720 && m < 1080) return 'noon';      // 12–18
        if (m >= 1080 && m < 1440)return 'evening';   // 18–24
        return 'night';                               // 00–06
    }

    /* =========================================================
       12. FİLTRELEME + SIRALAMA
    ========================================================= */
    function collectFilters() {
        // Aktif filtre panelini seç (offcanvas açıksa mobil, değilse masaüstü)
        // Her iki panel de aynı değerleri okumalı; birleşik okuruz.
        const panels = ['#filterPanelDesktop', '#filterPanelMobile'].map(s => $(s)).filter(Boolean);

        const getChecked = (cls) => {
            const vals = new Set();
            panels.forEach(p => $$('.' + cls, p).forEach(el => { if (el.checked) vals.add(el.value); }));
            return vals;
        };
        const anyChecked = (cls) => panels.some(p => $$('.' + cls, p).some(el => el.checked));
        const minRange = (cls, fallback) => {
            let v = fallback;
            panels.forEach(p => { const el = $('.' + cls, p); if (el) v = Math.min(v, Number(el.value)); });
            return v;
        };
        const maxRangeMeaningful = (cls, maxAllowed) => {
            // Kullanıcının seçtiği en kısıtlayıcı (en düşük) değeri al
            let v = maxAllowed;
            panels.forEach(p => { const el = $('.' + cls, p); if (el) v = Math.min(v, Number(el.value)); });
            return v;
        };

        return {
            stops:    getChecked('f-stop'),      // '0','1','2'
            airlines: getChecked('f-airline'),   // 'TK','PC','VF'
            time:     getChecked('f-time'),      // 'morning'...
            maxPrice: maxRangeMeaningful('f-price', 12000),
            maxDur:   maxRangeMeaningful('f-duration', 480),
            cabin:    anyChecked('f-cabin'),
            checked:  anyChecked('f-checked'),
            flex:     anyChecked('f-flex')
        };
    }

    function filterFlights() {
        const f = collectFilters();

        state.filtersActive =
            f.stops.size || f.airlines.size || f.time.size ||
            f.maxPrice < 12000 || f.maxDur < 480 ||
            f.cabin || f.checked || f.flex;

        return FLIGHTS.filter(fl => {
            // Aktarma
            if (f.stops.size) {
                const key = fl.stops >= 2 ? '2' : String(fl.stops);
                if (!f.stops.has(key)) return false;
            }
            // Havayolu
            if (f.airlines.size && !f.airlines.has(fl.airlineCode)) return false;
            // Kalkış saati dilimi
            if (f.time.size && !f.time.has(timeSlot(fl.departureTime))) return false;
            // Maksimum fiyat
            if (fl.price > f.maxPrice) return false;
            // Maksimum süre (480 = tümü)
            if (f.maxDur < 480 && fl.durationMinutes > f.maxDur) return false;
            // Kabin bagajı (tüm uçuşlarda var ama filtre mantığı korunur)
            if (f.cabin && !(fl.cabinBaggage > 0)) return false;
            // Kayıtlı bagaj dahil
            if (f.checked && !fl.checkedBaggage) return false;
            // Esnek bilet
            if (f.flex && !fl.flexibleTicket) return false;
            return true;
        });
    }

    function sortFlights(list) {
        const arr = [...list];
        switch (state.sort) {
            case 'price':    arr.sort((a, b) => a.price - b.price); break;
            case 'duration': arr.sort((a, b) => a.durationMinutes - b.durationMinutes); break;
            case 'earliest': arr.sort((a, b) => toMinutes(a.departureTime) - toMinutes(b.departureTime)); break;
            case 'latest':   arr.sort((a, b) => toMinutes(b.departureTime) - toMinutes(a.departureTime)); break;
            default: // önerilen: rozetli önce, sonra fiyat
                arr.sort((a, b) => {
                    const rank = x => x.badge === 'recommended' ? 0 : x.badge === 'cheapest' ? 1 : x.badge === 'fastest' ? 2 : 3;
                    return rank(a) - rank(b) || a.price - b.price;
                });
        }
        return arr;
    }

    /* =========================================================
       ANA RENDER
    ========================================================= */
    function applyAndRender() {
        const filtered = sortFlights(filterFlights());
        state.filtered = filtered;

        const listEl  = $('#flightList');
        const emptyEl = $('#emptyState');
        const moreBtn = $('#showMoreBtn');

        // Sonuç sayısı güncelle
        $('#resultCount').textContent = `${filtered.length} uçuş seçeneği bulundu`;

        // Boş durum
        if (filtered.length === 0) {
            listEl.innerHTML = '';
            emptyEl.classList.remove('d-none');
            moreBtn.style.display = 'none';
            return;
        }
        emptyEl.classList.add('d-none');

        // Filtre aktifse tüm uygun uçuşları göster, değilse limit uygula
        const limit = state.filtersActive ? filtered.length : state.visibleLimit;
        const shown = filtered.slice(0, limit);

        listEl.innerHTML = shown.map(flightCardHTML).join('');

        // "Daha Fazla" butonu
        if (!state.filtersActive && filtered.length > state.visibleLimit) {
            const remaining = filtered.length - state.visibleLimit;
            moreBtn.style.display = '';
            $('#remainingCount').textContent = ` (${remaining})`;
        } else {
            moreBtn.style.display = 'none';
        }

        // Seç butonlarını bağla
        bindSelectButtons();
    }

    /* =========================================================
       10. UÇUŞ SEÇİM MODALI
    ========================================================= */
    let selectedFlight = null;
    const selectModal = () => bootstrap.Modal.getOrCreateInstance($('#selectModal'));

    function bindSelectButtons() {
        $$('[data-select]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.select);
                const f = FLIGHTS.find(x => x.id === id);
                if (!f) return;
                selectedFlight = f;
                fillModal(f);
                selectModal().show();
            });
        });
    }

    function fillModal(f) {
        const st = AIRLINE_STYLE[f.airlineCode];
        const pax = 1; // arama özetinden gelen yolcu sayısı (varsayılan 1)
        const total = f.price * pax;

        $('#selectModalBody').innerHTML = `
            <div class="sr-modal-airline">
                <span class="sr-airline-logo ${st.cls}">${st.short}</span>
                <div>
                    <div class="sr-airline-name">${f.airline}</div>
                    <div class="sr-airline-sub">${f.flightNumber} · ${f.aircraft}</div>
                </div>
            </div>
            <div class="sr-modal-route">
                <i class="bi bi-airplane text-primary"></i>
                İstanbul ${f.departureAirport} → Amsterdam ${f.arrivalAirport}
            </div>
            <ul class="sr-modal-list">
                <li><span class="sr-ml-label">Tarih</span><span class="sr-ml-value">18 Ağustos 2026</span></li>
                <li><span class="sr-ml-label">Kalkış</span><span class="sr-ml-value">${f.departureTime}</span></li>
                <li><span class="sr-ml-label">Varış</span><span class="sr-ml-value">${f.arrivalTime}</span></li>
                <li><span class="sr-ml-label">Süre</span><span class="sr-ml-value">${f.durationText} · ${f.stops === 0 ? 'Direkt' : f.stops + ' Aktarma'}</span></li>
                <li><span class="sr-ml-label">Yolcu</span><span class="sr-ml-value">${pax} Yetişkin</span></li>
                <li><span class="sr-ml-label">Kabin</span><span class="sr-ml-value">Ekonomi</span></li>
            </ul>
            <div class="sr-modal-total">
                <span class="sr-mt-label">Toplam (Vergiler dahil)</span>
                <span class="sr-mt-value">${fmtPrice(total)}</span>
            </div>`;
    }

    /* "Devam Et" -> toast */
    $('#modalContinueBtn').addEventListener('click', () => {
        selectModal().hide();
        showToast('Uçuşunuz seçildi. Yolcu bilgileri sayfasına yönlendiriliyorsunuz.', 'success');
    });

    /* =========================================================
       11. DAHA FAZLA UÇUŞ GÖSTER
    ========================================================= */
    $('#showMoreBtn').addEventListener('click', () => {
        state.visibleLimit = FLIGHTS.length; // kalan uçuşları da göster
        applyAndRender();
    });

    /* =========================================================
       SIRALAMA DROPDOWN
    ========================================================= */
    $('#sortSelect').addEventListener('change', function () {
        state.sort = this.value;
        // Önerilen kartlardaki aktif vurguyu güncelle
        $$('.sr-suggest-card').forEach(c => c.classList.toggle('active', c.dataset.sort === this.value));
        applyAndRender();
    });

    /* =========================================================
       FİLTRE OLAYLARINI BAĞLA (her iki panel senkron)
    ========================================================= */
    function bindFilterEvents() {
        const panels = ['#filterPanelDesktop', '#filterPanelMobile'].map(s => $(s)).filter(Boolean);

        panels.forEach(panel => {
            // Checkbox / range değişince yeniden filtrele
            panel.addEventListener('change', () => {
                syncPanels();
                applyAndRender();
            });
            // Range anlık gösterge
            panel.addEventListener('input', (e) => {
                if (e.target.classList.contains('f-price')) {
                    const v = Number(e.target.value);
                    $$('.price-val', panel).forEach(x => x.textContent = fmtPrice(v));
                }
                if (e.target.classList.contains('f-duration')) {
                    const v = Number(e.target.value);
                    const txt = v >= 480 ? 'Tümü' : `En fazla ${Math.floor(v / 60)} sa` + (v % 60 ? ` ${v % 60} dk` : '');
                    $$('.dur-val', panel).forEach(x => x.textContent = txt);
                }
                syncPanels();
                applyAndRender();
            });
            // Tüm filtreleri temizle
            const clearBtn = $('.sr-clear-link', panel);
            if (clearBtn) clearBtn.addEventListener('click', clearAllFilters);
        });
    }

    /* İki panelin değerlerini eşitle (masaüstü <-> mobil) */
    function syncPanels() {
        const d = $('#filterPanelDesktop'), m = $('#filterPanelMobile');
        if (!d || !m) return;
        // checkbox'lar
        ['f-stop', 'f-airline', 'f-time', 'f-cabin', 'f-checked', 'f-flex'].forEach(cls => {
            const ds = $$('.' + cls, d), ms = $$('.' + cls, m);
            ds.forEach((el, i) => { if (ms[i]) { /* değeri hangisi değiştiyse diğerine yansıt */ } });
        });
        // Basit yaklaşım: değer okuma birleşik yapıldığı için ayrıca zorlamaya gerek yok.
    }

    /* =========================================================
       TÜM FİLTRELERİ TEMİZLE
    ========================================================= */
    function clearAllFilters() {
        ['#filterPanelDesktop', '#filterPanelMobile'].forEach(sel => {
            const p = $(sel); if (!p) return;
            $$('input[type="checkbox"]', p).forEach(c => c.checked = false);
            const price = $('.f-price', p); if (price) { price.value = 12000; $$('.price-val', p).forEach(x => x.textContent = '₺12.000'); }
            const dur = $('.f-duration', p); if (dur) { dur.value = 480; $$('.dur-val', p).forEach(x => x.textContent = 'Tümü'); }
        });
        state.filtersActive = false;
        state.visibleLimit = 6;
        applyAndRender();
    }
    $('#emptyClearBtn').addEventListener('click', clearAllFilters);

    /* =========================================================
       2. ARAMAYI GÜNCELLE (özet metnini değiştir)
    ========================================================= */
    $('#updateSearchBtn').addEventListener('click', () => {
        const from = $('#edFrom').value.trim();
        const to = $('#edTo').value.trim();
        const depart = $('#edDepart').value;
        const ret = $('#edReturn').value;
        const pax = $('#edPax').value;
        const cabin = $('#edCabin').value;

        // Basit tarih biçimlendirme
        const fmtDate = (d) => {
            if (!d) return '';
            const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
            const dt = new Date(d);
            return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
        };

        // Özet güncelle
        $('#sumDates').textContent = `${fmtDate(depart)} – ${fmtDate(ret)}`;
        $('#sumPax').textContent = `${pax} Yetişkin`;
        $('#sumCabin').textContent = cabin;

        // Rota metni (IATA'yı ayıkla)
        const iata = (txt) => { const m = txt.match(/([A-Z]{3})/); return m ? m[1] : ''; };
        const fromCity = from.split(',')[0] || 'İstanbul';
        const toCity = to.split(',')[0] || 'Amsterdam';
        $('#sumRoute').innerHTML = `${fromCity} <b>${iata(from) || 'IST'}</b> → ${toCity} <b>${iata(to) || 'AMS'}</b>`;
        $('#resultTitle').textContent = `${fromCity} - ${toCity} Uçuşları`;

        // Paneli kapat + toast
        bootstrap.Collapse.getOrCreateInstance($('#editSearch')).hide();
        showToast('Arama güncellendi.', 'success');
    });

    /* =========================================================
       TOAST
    ========================================================= */
    function showToast(message, type) {
        const toastEl = $('#srToast');
        $('#srToastBody').textContent = message;
        toastEl.classList.remove('sr-toast-success');
        if (type === 'success') toastEl.classList.add('sr-toast-success');
        const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3500 });
        toast.show();
    }

    /* =========================================================
       BAŞLATMA
    ========================================================= */
    function init() {
        // Filtre panellerini oluştur (masaüstü + mobil)
        $('#filterPanelDesktop').innerHTML = filterPanelHTML('d');
        $('#filterPanelMobile').innerHTML = filterPanelHTML('m');

        bindFilterEvents();
        renderSuggestions();
        applyAndRender();

        // URL parametreleri varsa arama özetini güncelle (ana sayfadan gelindiyse)
        applyUrlParams();
    }

    /* Ana sayfadan gelen parametreleri özet alanına yansıt */
    function applyUrlParams() {
        const params = new URLSearchParams(window.location.search);
        if (![...params].length) return;

        const fromIata = params.get('fromIata');
        const toIata = params.get('toIata');
        const from = params.get('from');
        const to = params.get('to');

        if (from && to) {
            const fromCity = from.split(',')[0];
            const toCity = to.split(',')[0];
            $('#sumRoute').innerHTML = `${fromCity} <b>${fromIata || 'IST'}</b> → ${toCity} <b>${toIata || 'AMS'}</b>`;
            $('#resultTitle').textContent = `${fromCity} - ${toCity} Uçuşları`;
        }
        const adults = params.get('adults');
        if (adults) $('#sumPax').textContent = `${adults} Yetişkin`;
        const cabinMap = { economy: 'Ekonomi', premium: 'Premium Ekonomi', business: 'Business', first: 'First Class' };
        const cabin = params.get('cabin');
        if (cabin && cabinMap[cabin]) $('#sumCabin').textContent = cabinMap[cabin];
        const tripType = params.get('tripType');
        if (tripType) $('#sumTrip').textContent = tripType === 'oneway' ? 'Tek Yön' : tripType === 'multi' ? 'Çoklu Uçuş' : 'Gidiş-Dönüş';
    }

    // DOM hazır olunca başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
