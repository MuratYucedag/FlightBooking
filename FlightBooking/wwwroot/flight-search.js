/* =============================================================
   FLYORA – Uçuş Arama Sayfası JavaScript
   Yalnızca temel kullanıcı etkileşimleri için kullanılır.
   ============================================================= */
(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        /* ---------------------------------------------------------
           1) NAVBAR: sayfa kaydırıldığında gölge ekle
           --------------------------------------------------------- */
        const navbar = document.getElementById("mainNavbar");
        window.addEventListener("scroll", function () {
            if (window.scrollY > 10) navbar.classList.add("fly-scrolled");
            else navbar.classList.remove("fly-scrolled");
        });

        /* ---------------------------------------------------------
           2) TARİH ALANLARI: bugünden önce seçilemesin,
              dönüş tarihi gidişten önce olamasın
           --------------------------------------------------------- */
        const departDate = document.getElementById("departDate");
        const returnDate = document.getElementById("returnDate");
        const today = new Date().toISOString().split("T")[0];
        departDate.min = today;
        returnDate.min = today;

        departDate.addEventListener("change", function () {
            // Dönüş tarihinin alt sınırını gidiş tarihine çek
            returnDate.min = departDate.value;
            if (returnDate.value && returnDate.value < departDate.value) {
                returnDate.value = departDate.value;
            }
        });

        /* ---------------------------------------------------------
           3) SEYAHAT TİPİ: Tek yön seçilince dönüş tarihini gizle
           --------------------------------------------------------- */
        const returnCol = document.getElementById("returnDateCol");
        document.querySelectorAll('input[name="tripType"]').forEach(function (radio) {
            radio.addEventListener("change", function () {
                const oneWay = this.value === "oneway";
                returnCol.style.display = oneWay ? "none" : "";
                if (oneWay) {
                    returnDate.value = "";
                    returnDate.required = false;
                }
            });
        });

        /* ---------------------------------------------------------
           4) SWAP BUTONU: kalkış ve varış değerlerini değiştir
           --------------------------------------------------------- */
        const fromAirport = document.getElementById("fromAirport");
        const toAirport = document.getElementById("toAirport");
        document.getElementById("swapBtn").addEventListener("click", function () {
            const tmp = fromAirport.value;
            fromAirport.value = toAirport.value;
            toAirport.value = tmp;
        });

        /* ---------------------------------------------------------
           5) YOLCU SAYAÇLARI + KABİN + ÖZET METNİ
           --------------------------------------------------------- */
        const counts = { adult: 1, child: 0, infant: 0 };
        const limits = { adult: { min: 1 }, child: { min: 0 }, infant: { min: 0 } };

        const summaryEl = document.getElementById("passengerSummary");
        const hiddenIds = { adult: "adultCount", child: "childCount", infant: "infantCount" };

        function refreshCounters() {
            Object.keys(counts).forEach(function (key) {
                document.getElementById(key + "Value").textContent = counts[key];
                document.getElementById(hiddenIds[key]).value = counts[key];
                // Eksi butonunu min değerde pasifleştir
                const decBtn = document.querySelector('[data-counter="' + key + '"][data-action="dec"]');
                decBtn.disabled = counts[key] <= limits[key].min;
            });
            updateSummary();
        }

        function updateSummary() {
            const total = counts.adult + counts.child + counts.infant;
            const cabin = document.querySelector('input[name="cabinClass"]:checked').value;
            summaryEl.textContent = total + " Yolcu, " + cabin;
        }

        document.querySelectorAll(".fly-counter-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                const key = this.dataset.counter;
                const action = this.dataset.action;
                if (action === "inc") counts[key]++;
                else if (counts[key] > limits[key].min) counts[key]--;
                refreshCounters();
            });
        });

        document.querySelectorAll('input[name="cabinClass"]').forEach(function (r) {
            r.addEventListener("change", updateSummary);
        });

        refreshCounters(); // ilk yükleme

        /* ---------------------------------------------------------
           6) YOLCU PANELİ: aç / kapat + dışarı tıklayınca kapan
           --------------------------------------------------------- */
        const passengerToggle = document.getElementById("passengerToggle");
        const passengerPanel = document.getElementById("passengerPanel");

        function openPanel() {
            passengerPanel.hidden = false;
            passengerToggle.setAttribute("aria-expanded", "true");
        }
        function closePanel() {
            passengerPanel.hidden = true;
            passengerToggle.setAttribute("aria-expanded", "false");
        }

        passengerToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            passengerPanel.hidden ? openPanel() : closePanel();
        });
        document.getElementById("passengerDone").addEventListener("click", closePanel);
        passengerPanel.addEventListener("click", function (e) { e.stopPropagation(); });
        document.addEventListener("click", function () {
            if (!passengerPanel.hidden) closePanel();
        });

        /* ---------------------------------------------------------
           7) FORM DOĞRULAMA: Türkçe hata mesajları
              (Bootstrap .is-invalid sınıfı ile)
           --------------------------------------------------------- */
        const form = document.getElementById("flightSearchForm");
        const formAlert = document.getElementById("formAlert");

        function setInvalid(el, on) {
            el.classList.toggle("is-invalid", on);
        }

        form.addEventListener("submit", function (e) {
            let valid = true;
            const errors = [];

            // Kalkış
            if (!fromAirport.value) { setInvalid(fromAirport, true); valid = false; errors.push("Lütfen kalkış noktasını seçin."); }
            else setInvalid(fromAirport, false);

            // Varış
            if (!toAirport.value) { setInvalid(toAirport, true); valid = false; errors.push("Lütfen varış noktasını seçin."); }
            else setInvalid(toAirport, false);

            // Kalkış = Varış kontrolü
            if (fromAirport.value && toAirport.value && fromAirport.value === toAirport.value) {
                setInvalid(toAirport, true); valid = false;
                errors.push("Kalkış ve varış noktası aynı olamaz.");
            }

            // Gidiş tarihi
            if (!departDate.value) { setInvalid(departDate, true); valid = false; errors.push("Lütfen gidiş tarihini seçin."); }
            else setInvalid(departDate, false);

            // Dönüş tarihi (yalnızca gidiş-dönüşte zorunlu)
            const tripType = document.querySelector('input[name="tripType"]:checked').value;
            if (tripType !== "oneway") {
                if (returnDate.value && departDate.value && returnDate.value < departDate.value) {
                    setInvalid(returnDate, true); valid = false;
                    errors.push("Dönüş tarihi gidiş tarihinden önce olamaz.");
                } else setInvalid(returnDate, false);
            }

            if (!valid) {
                e.preventDefault(); // form gönderimini durdur
                formAlert.hidden = false;
                formAlert.innerHTML = '<i class="bi bi-exclamation-triangle"></i> ' + errors[0];
                formAlert.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            // valid ise form doğal olarak /Flight/Search adresine gönderilir
        });

        // Kullanıcı düzeltme yaptıkça hata görselini temizle
        [fromAirport, toAirport, departDate, returnDate].forEach(function (el) {
            el.addEventListener("change", function () {
                setInvalid(el, false);
                formAlert.hidden = true;
            });
        });
    });
})();
