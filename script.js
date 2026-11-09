
// =================================
// 1. PAGE NAVIGATION
// =================================

const pages = document.querySelectorAll(".page");
const dots = document.querySelectorAll(".dot");

function goToPage(pageId) {
    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    const pageNames = [
        "home",
        "surprise",
        "cake",
        "memories",
        "letter",
        "forever"
    ];

    const index = pageNames.indexOf(pageId);

    dots.forEach((dot, i) => {
        dot.classList.toggle("active-dot", i === index);
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =================================
// 2. FLOATING HEARTS
// =================================

function createHeart() {
    const heart = document.createElement("div");

    heart.classList.add("heart");
    heart.innerHTML = Math.random() > 0.5 ? "❤️" : "💕";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (15 + Math.random() * 25) + "px";
    heart.style.animationDuration = (5 + Math.random() * 6) + "s";

    document.getElementById("hearts").appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 11000);
}

setInterval(createHeart, 500);


// =================================
// 3. GIFT OPENING
// =================================

function openGift() {
    const gift = document.getElementById("gift");
    const message = document.getElementById("giftMessage");

    gift.innerHTML = "🎉";

    message.classList.remove("hidden");

    message.innerHTML =
        "Happy Birthday Saba! ❤️ You are truly special!";

    gift.style.animation = "heartbeat .5s infinite";

    celebrate();
}


// =================================
// 4. BLOW THE CANDLE
// =================================

let candleBlown = false;

function blowCandle() {
    const flame = document.getElementById("flame");
    const blowButton = document.getElementById("blowButton");
    const cutButton = document.getElementById("cutCakeBtn");
    const message = document.getElementById("cakeMessage");
    const description = document.getElementById("cakeDescription");

    if (flame.style.display === "none") return;

    flame.style.display = "none";

    blowButton.style.display = "none";
    cutButton.style.display = "inline-block";

    description.innerHTML = "Your wish is made! Now it's time to cut the cake! ❤️";

    message.innerHTML = "Candle Blown! Make a beautiful wish! 💖";
}

function cutCake() {
    const cake = document.getElementById("birthdayCake");
    const knife = document.getElementById("cakeKnife");
    const cutButton = document.getElementById("cutCakeBtn");
    const message = document.getElementById("cakeMessage");
    const description = document.getElementById("cakeDescription");
    const birthdayMessage = document.getElementById("birthdaySpecialMessage");

    if (cake.classList.contains("cut")) return;

    cutButton.disabled = true;
    cutButton.innerHTML = "Cutting Cake... 🎂";

    knife.classList.remove("cutting");
    void knife.offsetWidth;
    knife.classList.add("cutting");

    setTimeout(() => {
        cake.classList.add("cut");

        description.innerHTML = "The Cake Is Cut! 🎂❤️";
        message.innerHTML = "Happy Birthday Meri Jan Sa Payari Shahzadi! 🎉💖";

        birthdayMessage.classList.add("show");
        cutButton.style.display = "none";

        if (typeof celebrate === "function") {
            celebrate();
        }

    }, 1500);
}


// Save photos and videos permanently in browser storage
const requestDB = indexedDB.open("SabaBirthdayWebsite", 1);

requestDB.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("media");
};

requestDB.onsuccess = function(event) {
    const db = event.target.result;
    restoreMedia(db);
};

function saveMedia(db, key, file) {
    const transaction = db.transaction("media", "readwrite");
    transaction.objectStore("media").put(file, key);
}

function getMedia(db, key) {
    return new Promise(resolve => {
        const transaction = db.transaction("media", "readonly");
        const request = transaction.objectStore("media").get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
    });
}

// Upload and preview photos
function previewPhoto(event, imageId) {
    const file = event.target.files[0];
    if (!file) return;

    const db = requestDB.result;
    saveMedia(db, imageId, file);

    const img = document.getElementById(imageId);
    img.src = URL.createObjectURL(file);
    img.style.display = "block";

    event.target.closest(".photo-card").classList.add("has-photo");
}



// Restore saved photos and video after refresh
async function restoreMedia(db) {

    for (let i = 1; i <= 6; i++) {
        const key = "photo" + i;
        const file = await getMedia(db, key);

        if (file) {
            const img = document.getElementById(key);

            if (img) {
                img.src = URL.createObjectURL(file);
                img.style.display = "block";
                img.closest(".photo-card").classList.add("has-photo");
            }
        }
    }

  
}

// =================================
// 6. CONFETTI CELEBRATION
// =================================

function celebrate() {
    const colors = [
        "#ff174d",
        "#ff6688",
        "#ffffff",
        "#ffd700",
        "#ff9eb5"
    ];

    for (let i = 0; i < 100; i++) {
        const piece = document.createElement("div");

        piece.classList.add("confetti");

        piece.style.left = Math.random() * 100 + "vw";

        piece.style.background =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.animationDelay =
            Math.random() * 1.5 + "s";

        piece.style.animationDuration =
            (2 + Math.random() * 2) + "s";

        document.body.appendChild(piece);

        setTimeout(() => {
            piece.remove();
        }, 5000);
    }
}


// =================================
// 7. CUTE BIRTHDAY TUNE
// =================================

let audioContext;
let musicPlaying = false;
let musicTimer;

const musicButton = document.getElementById("musicBtn");

const melody = [
    261.63, 261.63, 293.66, 261.63,
    349.23, 329.63,
    261.63, 261.63, 293.66, 261.63,
    392.00, 349.23,
    261.63, 261.63, 523.25, 440.00,
    349.23, 329.63, 293.66,
    466.16, 466.16, 440.00, 349.23,
    392.00, 349.23
];

let notePosition = 0;

function playNote() {
    if (!audioContext || !musicPlaying) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.value = melody[notePosition];

    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.08,
        audioContext.currentTime + 0.05
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.35
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.4);

    notePosition = (notePosition + 1) % melody.length;
}

musicButton.addEventListener("click", async function() {

    if (!musicPlaying) {

        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) {
            alert("Audio is not supported by this browser.");
            return;
        }

        audioContext = audioContext || new AudioContext();

        await audioContext.resume();

        musicPlaying = true;

        musicButton.innerHTML = "♫ Music Playing";

        playNote();

        musicTimer = setInterval(playNote, 450);

    } else {

        musicPlaying = false;

        clearInterval(musicTimer);

        musicButton.innerHTML = "♫ Play Music";
    }
});


// =================================
// 8. WELCOME MESSAGE
// =================================

console.log("Happy Birthday Saba! ❤️");
console.log("A special website made with love.");
function openGift() {
    const gift = document.getElementById("gift");
    const message = document.getElementById("giftMessage");
    const button = document.getElementById("giftButton");

    if (!message || !gift || !button) return;

    if (!message.classList.contains("hidden")) return;

    gift.style.animation = "giftShake 0.6s ease";
    button.disabled = true;
    button.innerHTML = "Opening Your Surprise... ❤️";

    setTimeout(() => {
        gift.innerHTML = "💝🍫🍫🌹🌹 ";
        message.classList.remove("hidden");
        button.innerHTML = "Surprise Opened! ❤️";

        if (typeof celebrate === "function") {
            celebrate();
        }
    }, 650);
    
}


function createLoveBackground() {
    const container = document.getElementById("hearts");

    const love = document.createElement("div");

    love.innerHTML = "I LOVE YOU ❤️";

    love.className = "floating-love";

    love.style.left = Math.random() * 90 + "%";
    love.style.animationDuration = (Math.random() * 3 + 5) + "s";

    container.appendChild(love);

    setTimeout(() => {
        love.remove();
    }, 8000);
}

const backgroundMusic = document.getElementById("backgroundMusic");

backgroundMusic.volume = 0.4;

window.addEventListener("load", function () {
    backgroundMusic.play().catch(() => {
        console.log("Music will start after first user interaction.");
    });
});

document.addEventListener("click", function startMusic() {
    backgroundMusic.play();
}, { once: true });