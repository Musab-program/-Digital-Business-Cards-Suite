// Generate vCard Contact (.vcf)
function downloadVCard() {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Khalid Abdulaziz Yassen Almaktari
N:Almaktari;Khalid;Abdulaziz Yassen;;
TITLE:Chief Executive Officer
ORG:Fourth Mills Company (MC4)
TEL;TYPE=CELL,VOICE:558846006
EMAIL;TYPE=INTERNET,HOME,WORK:k.almaktary@mc4.com.sa
URL:https://link.zuccess.ai/aay
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'Khalid_AlMaktary.vcf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("Contact (.vcf) downloaded!");
}

// Copy link to clipboard
function copyLink(textToCopy) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast("Link copied to clipboard!");
        }).catch(() => {
            fallbackCopyText(textToCopy);
        });
    } else {
        fallbackCopyText(textToCopy);
    }
}

function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast("Link copied to clipboard!");
    } catch (err) {
        showToast("Failed to copy link");
    }
    document.body.removeChild(textArea);
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
            a.download = 'Khalid_AlMaktary_QR.png';
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
    renderQRCode("https://link.zuccess.ai/aay");
});
