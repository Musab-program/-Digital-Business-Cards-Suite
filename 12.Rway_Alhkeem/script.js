// Dynamic Live Domain Detection (100% Automatic for Netlify / Live Server)
function getActiveURL() {
    if (window.location.protocol.startsWith("http")) {
        return window.location.origin + window.location.pathname;
    }
    return "https://serene-tulumba-897c38.netlify.app";
}

// Generate vCard Contact (.vcf)
function downloadVCard() {
    const currentURL = getActiveURL();
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Rway Ali Ahmed Alhkeem
N:Alhkeem;Rway;;;
TITLE:Governance, Risk & Compliance Manager
ORG:Fourth Mills Company (MC4)
TEL;TYPE=CELL,VOICE:050115258
EMAIL;TYPE=INTERNET,HOME,WORK:rwayali@mc4.com.sa
URL:${currentURL}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'Rway_Alhkeem.vcf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blob);

    showToast("Contact (.vcf) downloaded!");
}

// Toast notification helper
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Global variable for current QR Image URL
let globalQRUrl = "";

// Render QR Code Image dynamically
function renderQRCode(text) {
    const container = document.getElementById("qrCodeContainer");
    const modalContainer = document.getElementById("modalQRContainer");

    globalQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(text)}&color=000000&bgcolor=ffffff`;

    if (container) {
        const qrImg = document.createElement("img");
        qrImg.src = globalQRUrl;
        qrImg.alt = "QR Code";
        qrImg.loading = "lazy";
        qrImg.onerror = function() {
            const fallback = getFallbackQRSVG(125);
            container.insertAdjacentHTML('afterbegin', fallback);
        };
        container.insertBefore(qrImg, container.firstChild);
    }

    if (modalContainer) {
        const modalQrImg = document.createElement("img");
        modalQrImg.src = globalQRUrl;
        modalQrImg.alt = "Fullscreen QR Code";
        modalQrImg.onerror = function() {
            modalContainer.innerHTML = getFallbackQRSVG(210);
        };
        modalContainer.appendChild(modalQrImg);
    }
}

function downloadQRImage() {
    if (!globalQRUrl) return;
    fetch(globalQRUrl)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'Rway_Alhkeem_QR.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            showToast("QR Code image downloaded!");
        })
        .catch(() => {
            showToast("Opening QR Code...");
            window.open(globalQRUrl, '_blank');
        });
}

function getFallbackQRSVG(size) {
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}">
        <rect width="100" height="100" fill="#ffffff"/>
        <path d="M10 10h30v30h-30zM20 20v10h10v-10zM60 10h30v30h-30zM70 20v10h10v-10zM10 60h30v30h-30zM20 70v10h10v-10zM50 50h10v10h-10zM70 50h20v10h-20zM50 70h20v20h-20zM80 80h10v10h-10z" fill="#000000"/>
    </svg>`;
}

// Fullscreen QR Code Modal handlers
function openQRModal() {
    const modal = document.getElementById("qrModal");
    if (modal) {
        modal.classList.add("active");
    }
}

function closeQRModal() {
    const modal = document.getElementById("qrModal");
    if (modal) {
        modal.classList.remove("active");
    }
}

// Close modal on ESC key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeQRModal();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const activeURL = getActiveURL();
    const displayURL = activeURL.replace(/^https?:\/\//, '').replace(/\/$/, '');

    const modalURL = document.getElementById("modalURL");
    if (modalURL) modalURL.textContent = displayURL;

    // Render QR Code dynamically with active live site URL
    renderQRCode(activeURL);
});