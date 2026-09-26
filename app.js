// =========================================
// 🍿 الفسحة - المنطق الرئيسي
// =========================================

// ============ بيانات المحتوى ============
const contentData = [
    {
        id: 'conan',
        title: 'المحقق كونان',
        type: 'أنمي',
        year: '2024',
        rating: '9.5',
        poster: 'https://picsum.photos/seed/conan2024/400/600',
        description: 'المحقق الأسطوري شينيتشي كودو في مغامرة جديدة مليئة بالألغاز والتشويق.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
];

// ============ عناصر القائمة الجانبية ============
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}
menuBtn.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.dataset.section;
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        sections.forEach(s => s.classList.remove('active'));
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active');
        closeSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// =========================================
// 🔍 البحث
// =========================================
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearchBtn = document.getElementById('closeSearchBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const clearSearchBtn = document.getElementById('clearSearchBtn');

function openSearch() {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 300);
}
function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    searchInput.value = '';
    clearSearchBtn.classList.remove('visible');
    showSearchHint();
}
searchBtn.addEventListener('click', openSearch);
closeSearchBtn.addEventListener('click', closeSearch);

// نصيحة البحث الافتراضية
function showSearchHint() {
    searchResults.innerHTML = `
        <div class="search-hint">
            <div class="hint-icon"><i class="fas fa-magnifying-glass"></i></div>
            <h4>ابحث في الفسحة</h4>
            <p>اكتب اسم أي فيلم أو مسلسل تبحث عنه</p>
        </div>
    `;
}

// البحث الفوري
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (query) {
        clearSearchBtn.classList.add('visible');
    } else {
        clearSearchBtn.classList.remove('visible');
        showSearchHint();
        return;
    }

    const results = contentData.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-face-frown"></i>
                <h4>ما فيه نتائج</h4>
                <p>جرب تكتب اسم ثاني</p>
            </div>
        `;
        return;
    }

    searchResults.innerHTML = results.map(item => `
        <div class="search-result-item" onclick="playContent('${item.id}')">
            <div class="result-poster">
                <img src="${item.poster}" alt="${item.title}">
            </div>
            <div class="result-info">
                <h4>${item.title}</h4>
                <div class="result-meta">
                    <span class="rating"><i class="fas fa-star"></i> ${item.rating}</span>
                    <span>${item.year}</span>
                    <span>${item.type}</span>
                </div>
            </div>
        </div>
    `).join('');
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.remove('visible');
    searchInput.focus();
    showSearchHint();
});

// =========================================
// 🎬 مشغل الفيديو
// =========================================
const playerOverlay = document.getElementById('playerOverlay');
const playerContainer = document.getElementById('playerContainer');
const video = document.getElementById('mainVideo');
const closePlayerBtn = document.getElementById('closePlayerBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const bigPlayBtn = document.getElementById('bigPlayBtn');
const muteBtn = document.getElementById('muteBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const progressWrap = document.getElementById('progressWrap');
const progressPlayed = document.getElementById('progressPlayed');
const progressBuffer = document.getElementById('progressBuffer');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const playerLoading = document.getElementById('playerLoading');
const playerControls = document.getElementById('playerControls');
const playerTop = document.querySelector('.player-top');

let idleTimer = null;
let isSeeking = false;

// تشغيل محتوى
function playContent(id) {
    const content = contentData.find(c => c.id === id);
    if (!content) return;

    // إغلاق شاشة البحث
    closeSearch();

    // تعيين الفيديو
    const source = video.querySelector('source');
    source.src = content.videoUrl;
    video.load();

    // فتح المشغل
    playerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // محاولة التشغيل تلقائياً
    setTimeout(() => {
        video.play().catch(() => {});
    }, 300);

    resetIdleTimer();
}

// إغلاق المشغل
function closePlayer() {
    video.pause();
    video.currentTime = 0;
    playerOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
    if (document.webkitFullscreenElement) {
        document.webkitExitFullscreen();
    }
}
closePlayerBtn.addEventListener('click', closePlayer);

// تحديث أيقونة التشغيل
function updatePlayIcon() {
    const icon = video.paused ? 'fa-play' : 'fa-pause';
    playPauseBtn.innerHTML = `<i class="fas ${icon}"></i>`;
    if (video.paused) {
        bigPlayBtn.classList.remove('hidden');
        bigPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        bigPlayBtn.classList.add('hidden');
    }
}

// تشغيل/إيقاف
function togglePlay() {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
    resetIdleTimer();
}
playPauseBtn.addEventListener('click', togglePlay);
bigPlayBtn.addEventListener('click', togglePlay);
video.addEventListener('click', () => {
    // اضغط على الفيديو = أظهر/أخف التحكم
    if (playerControls.classList.contains('idle')) {
        playerControls.classList.remove('idle');
        playerTop.classList.remove('idle');
        resetIdleTimer();
    } else {
        togglePlay();
    }
});

video.addEventListener('play', updatePlayIcon);
video.addEventListener('pause', updatePlayIcon);

// كتم الصوت
muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted
        ? '<i class="fas fa-volume-xmark"></i>'
        : '<i class="fas fa-volume-high"></i>';
    resetIdleTimer();
});

// شاشة كاملة
fullscreenBtn.addEventListener('click', () => {
    const elem = playerContainer;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.webkitEnterFullscreen) elem.webkitEnterFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
    resetIdleTimer();
});

// تنسيق الوقت
function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// تحديث شريط التقدم
function updateProgress() {
    if (isSeeking) return;
    if (!video.duration) return;
    const percent = (video.currentTime / video.duration) * 100;
    progressPlayed.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(video.currentTime);
}

video.addEventListener('timeupdate', updateProgress);
video.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(video.duration);
});
video.addEventListener('progress', () => {
    if (video.buffered.length > 0 && video.duration) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percent = (bufferedEnd / video.duration) * 100;
        progressBuffer.style.width = percent + '%';
    }
});

// مؤشر التحميل
video.addEventListener('waiting', () => playerLoading.classList.add('visible'));
video.addEventListener('playing', () => playerLoading.classList.remove('visible'));
video.addEventListener('canplay', () => playerLoading.classList.remove('visible'));

// السحب على شريط التقدم
function seekFromEvent(e) {
    const rect = progressWrap.getBoundingClientRect();
    let x;
    if (e.touches) x = e.touches[0].clientX - rect.left;
    else x = e.clientX - rect.left;

    let percent = x / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    const time = percent * video.duration;
    progressPlayed.style.width = (percent * 100) + '%';
    currentTimeEl.textContent = formatTime(time);
    return time;
}

let seekStart = false;
progressWrap.addEventListener('mousedown', (e) => {
    isSeeking = true;
    seekFromEvent(e);
});
progressWrap.addEventListener('mousemove', (e) => {
    if (isSeeking) seekFromEvent(e);
});
window.addEventListener('mouseup', (e) => {
    if (isSeeking) {
        video.currentTime = seekFromEvent(e);
        isSeeking = false;
    }
});

progressWrap.addEventListener('touchstart', (e) => {
    isSeeking = true;
    seekFromEvent(e);
    resetIdleTimer();
}, { passive: true });
progressWrap.addEventListener('touchmove', (e) => {
    if (isSeeking) seekFromEvent(e);
}, { passive: true });
progressWrap.addEventListener('touchend', (e) => {
    if (isSeeking) {
        const rect = progressWrap.getBoundingClientRect();
        const touch = e.changedTouches[0];
        const x = touch.clientX - rect.left;
        let percent = x / rect.width;
        percent = Math.max(0, Math.min(1, percent));
        video.currentTime = percent * video.duration;
        isSeeking = false;
    }
}, { passive: true });

// إخفاء تلقائي للتحكم
function resetIdleTimer() {
    playerControls.classList.remove('idle');
    playerTop.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        if (!video.paused) {
            playerControls.classList.add('idle');
            playerTop.classList.add('idle');
        }
    }, 3000);
}

playerContainer.addEventListener('mousemove', resetIdleTimer);
playerContainer.addEventListener('touchstart', resetIdleTimer);
playerContainer.addEventListener('click', (e) => {
    if (e.target === video || e.target === playerContainer) resetIdleTimer();
});

// اختصارات لوحة المفاتيح
document.addEventListener('keydown', (e) => {
    if (!playerOverlay.classList.contains('active')) return;
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePlay(); }
    if (e.key === 'ArrowRight') { video.currentTime += 5; resetIdleTimer(); }
    if (e.key === 'ArrowLeft') { video.currentTime -= 5; resetIdleTimer(); }
    if (e.key === 'm') { muteBtn.click(); }
    if (e.key === 'f') { fullscreenBtn.click(); }
    if (e.key === 'Escape') { closePlayer(); }
});

// ربط الكرت بالمشغل
document.getElementById('conanCard').addEventListener('click', () => playContent('conan'));

// دالة عامة عشان نقدر نستخدمها من أي مكان
window.playContent = playContent;

console.log('🍿 الفسحة جاهزة!');
