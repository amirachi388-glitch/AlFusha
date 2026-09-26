// =========================================
// 🍿 الفسحة - البيانات والمنطق
// =========================================

// ⚠️ هنا تضيف المسلسل والحلقات ⚠️
const contentData = [
    {
        id: 'conan',
        title: 'المحقق كونان',
        type: 'أنمي',
        year: '2024',
        rating: '9.5',
        quality: 'HD',
        banner: 'https://picsum.photos/seed/conan2024/800/450',
        episodes: [
            { number: 1, title: 'البداية الجديدة', duration: '24 دقيقة', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
            { number: 2, title: 'اللغز الغامض', duration: '24 دقيقة', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
            { number: 3, title: 'المواجهة الأخيرة', duration: '24 دقيقة', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
        ]
    }
];

let currentEpisode = null;

// ============ القائمة الجانبية ============
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

function openSidebar() { sidebar.classList.add('active'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeSidebar() { sidebar.classList.remove('active'); overlay.classList.remove('active'); document.body.style.overflow = ''; }
menuBtn.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.dataset.section;
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        closeSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ============ عرض الحلقات ============
function renderEpisodes() {
    const content = contentData[0];
    const list = document.getElementById('episodesList');
    const count = document.getElementById('episodesCount');

    if (!content.episodes || content.episodes.length === 0) {
        count.textContent = '';
        list.innerHTML = `<div class="empty-episodes"><i class="fas fa-film"></i><p>لا توجد حلقات متاحة حالياً</p></div>`;
        return;
    }

    count.textContent = `${content.episodes.length} حلقات`;
    list.innerHTML = content.episodes.map(ep => `
        <div class="episode-item" data-ep="${ep.number}" onclick="playEpisode(${ep.number})">
            <div class="episode-number">${ep.number}</div>
            <div class="episode-info">
                <h4>${ep.title}</h4>
                <p><i class="fas fa-clock"></i> ${ep.duration}</p>
            </div>
            <div class="episode-play-icon"><i class="fas fa-play"></i></div>
        </div>
    `).join('');
}
renderEpisodes();

// ============ المشغل المدمج ============
const heroBanner = document.getElementById('heroBanner');
const heroPlayer = document.getElementById('heroPlayer');
const bannerImage = document.getElementById('bannerImage');
const bannerTitle = document.getElementById('bannerTitle');
const video = document.getElementById('mainVideo');
const playerTitle = document.getElementById('playerTitle');
const playerSubtitle = document.getElementById('playerSubtitle');
const closeVideoBtn = document.getElementById('closeVideoBtn');
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
const playerTopbar = document.querySelector('.player-topbar');
const playerBottombar = document.querySelector('.player-bottombar');

let idleTimer = null;
let isSeeking = false;

// تشغيل حلقة (الفيديو يحل مكان البانر)
function playEpisode(episodeNumber) {
    const content = contentData[0];
    const episode = content.episodes.find(e => e.number === episodeNumber);
    if (!episode) return;

    currentEpisode = episodeNumber;

    // تحديث المعلومات
    playerTitle.textContent = content.title;
    playerSubtitle.textContent = `الحلقة ${episode.number} • ${episode.title}`;

    // تحميل الفيديو
    video.src = episode.videoUrl;
    video.load();

    // إخفاء البانر وإظهار الفيديو
    heroBanner.classList.add('hidden');
    heroPlayer.classList.add('active');

    // تمييز الحلقة الحالية
    document.querySelectorAll('.episode-item').forEach(item => {
        item.classList.toggle('playing', parseInt(item.dataset.ep) === episodeNumber);
    });

    // تشغيل الفيديو
    setTimeout(() => {
        video.play().catch(() => {});
    }, 200);

    resetIdleTimer();
}

// إغلاق الفيديو والعودة للبانر
function closeVideo() {
    video.pause();
    video.currentTime = 0;
    video.removeAttribute('src');
    video.load();

    heroBanner.classList.remove('hidden');
    heroPlayer.classList.remove('active');
    currentEpisode = null;

    document.querySelectorAll('.episode-item').forEach(item => item.classList.remove('playing'));
}
closeVideoBtn.addEventListener('click', closeVideo);

// تشغيل/إيقاف
function updatePlayIcon() {
    playPauseBtn.innerHTML = video.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    if (video.paused) {
        bigPlayBtn.classList.remove('hidden');
        bigPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        bigPlayBtn.classList.add('hidden');
    }
}
function togglePlay() {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
    resetIdleTimer();
}
playPauseBtn.addEventListener('click', togglePlay);
bigPlayBtn.addEventListener('click', togglePlay);
video.addEventListener('click', () => {
    if (playerTopbar.classList.contains('idle')) {
        playerTopbar.classList.remove('idle');
        playerBottombar.classList.remove('idle');
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
    muteBtn.innerHTML = video.muted ? '<i class="fas fa-volume-xmark"></i>' : '<i class="fas fa-volume-high"></i>';
    resetIdleTimer();
});

// شاشة كاملة
fullscreenBtn.addEventListener('click', () => {
    const elem = heroPlayer;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
    resetIdleTimer();
});

// التقدم
function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}
function updateProgress() {
    if (isSeeking || !video.duration) return;
    const percent = (video.currentTime / video.duration) * 100;
    progressPlayed.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(video.currentTime);
}
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('loadedmetadata', () => { totalTimeEl.textContent = formatTime(video.duration); });
video.addEventListener('progress', () => {
    if (video.buffered.length > 0 && video.duration) {
        const end = video.buffered.end(video.buffered.length - 1);
        progressBuffer.style.width = (end / video.duration * 100) + '%';
    }
});
video.addEventListener('waiting', () => playerLoading.classList.add('visible'));
video.addEventListener('playing', () => playerLoading.classList.remove('visible'));
video.addEventListener('canplay', () => playerLoading.classList.remove('visible'));

function seekFromEvent(e) {
    const rect = progressWrap.getBoundingClientRect();
    let x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    let percent = Math.max(0, Math.min(1, x / rect.width));
    const time = percent * video.duration;
    progressPlayed.style.width = (percent * 100) + '%';
    currentTimeEl.textContent = formatTime(time);
    return time;
}
progressWrap.addEventListener('mousedown', (e) => { isSeeking = true; seekFromEvent(e); });
progressWrap.addEventListener('mousemove', (e) => { if (isSeeking) seekFromEvent(e); });
window.addEventListener('mouseup', (e) => { if (isSeeking) { video.currentTime = seekFromEvent(e); isSeeking = false; } });
progressWrap.addEventListener('touchstart', (e) => { isSeeking = true; seekFromEvent(e); resetIdleTimer(); }, { passive: true });
progressWrap.addEventListener('touchmove', (e) => { if (isSeeking) seekFromEvent(e); }, { passive: true });
progressWrap.addEventListener('touchend', (e) => {
    if (isSeeking) {
        const rect = progressWrap.getBoundingClientRect();
        const x = e.changedTouches[0].clientX - rect.left;
        let percent = Math.max(0, Math.min(1, x / rect.width));
        video.currentTime = percent * video.duration;
        isSeeking = false;
    }
}, { passive: true });

// الإخفاء التلقائي
function resetIdleTimer() {
    playerTopbar.classList.remove('idle');
    playerBottombar.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        if (!video.paused) {
            playerTopbar.classList.add('idle');
            playerBottombar.classList.add('idle');
        }
    }, 3000);
}
heroPlayer.addEventListener('mousemove', resetIdleTimer);
heroPlayer.addEventListener('touchstart', resetIdleTimer);

// الحلقة السابقة / التالية
document.getElementById('prevBtn').addEventListener('click', () => {
    const content = contentData[0];
    if (currentEpisode === null) { playEpisode(1); return; }
    const prev = currentEpisode - 1;
    if (prev >= 1) playEpisode(prev);
});
document.getElementById('nextBtn').addEventListener('click', () => {
    const content = contentData[0];
    if (currentEpisode === null) { playEpisode(1); return; }
    const next = currentEpisode + 1;
    if (next <= content.episodes.length) playEpisode(next);
});

// ============ البحث ============
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearchBtn = document.getElementById('closeSearchBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const clearSearchBtn = document.getElementById('clearSearchBtn');

function openSearch() { searchOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; setTimeout(() => searchInput.focus(), 300); }
function closeSearch() { searchOverlay.classList.remove('active'); document.body.style.overflow = ''; searchInput.value = ''; clearSearchBtn.classList.remove('visible'); showSearchHint(); }
searchBtn.addEventListener('click', openSearch);
closeSearchBtn.addEventListener('click', closeSearch);

function showSearchHint() {
    searchResults.innerHTML = `<div class="search-hint"><div class="hint-icon"><i class="fas fa-magnifying-glass"></i></div><h4>ابحث في الفسحة</h4><p>اكتب اسم أي فيلم أو مسلسل</p></div>`;
}
showSearchHint();

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query) clearSearchBtn.classList.add('visible');
    else { clearSearchBtn.classList.remove('visible'); showSearchHint(); return; }

    const results = contentData.filter(item => item.title.toLowerCase().includes(query) || item.type.toLowerCase().includes(query));
    if (results.length === 0) {
        searchResults.innerHTML = `<div class="no-results"><i class="fas fa-face-frown"></i><h4>ما فيه نتائج</h4><p>جرب اسم ثاني</p></div>`;
        return;
    }
    searchResults.innerHTML = results.map(item => `
        <div class="search-result-card" onclick="closeSearch(); showDetails('${item.id}');">
            <div class="search-result-thumb">
                <img src="${item.banner}" alt="${item.title}">
            </div>
            <div class="search-result-info">
                <h4>${item.title}</h4>
                <div class="search-result-meta">
                    <span class="rating-tag"><i class="fas fa-star"></i> ${item.rating}</span>
                    <span>${item.year}</span>
                    <span>${item.type}</span>
                </div>
            </div>
            <div class="search-result-play"><i class="fas fa-play"></i></div>
        </div>
    `).join('');
});
clearSearchBtn.addEventListener('click', () => {
    searchInput.value = ''; clearSearchBtn.classList.remove('visible'); searchInput.focus(); showSearchHint();
});

// دوال عامة
window.playEpisode = playEpisode;
window.closeSearch = closeSearch;
console.log('🍿 الفسحة جاهزة!');

// =========================================
// 🏠 الصفحة الرئيسية - عرض الشبكة
// =========================================
function renderContentGrid() {
    const grid = document.getElementById('contentGrid');
    if (!grid) return;
    
    grid.innerHTML = contentData.map(item => `
        <div class="content-card" onclick="showDetails('${item.id}')">
            <div class="content-card-poster">
                <img src="${item.banner}" alt="${item.title}">
                <span class="content-card-badge">${item.type}</span>
                <span class="content-card-rating"><i class="fas fa-star"></i> ${item.rating}</span>
            </div>
            <div class="content-card-info">
                <h4>${item.title}</h4>
                <p>${item.year} • ${item.episodes.length} حلقات</p>
            </div>
        </div>
    `).join('');
}
renderContentGrid();

// فتح صفحة التفاصيل
function showDetails(id) {
    const content = contentData.find(c => c.id === id);
    if (!content) return;

    // إخفاء الرئيسية، إظهار التفاصيل
    document.getElementById('home').classList.remove('active');
    document.getElementById('details').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // تعبئة بيانات التفاصيل
    bannerTitle.textContent = content.title;
    if (!content.episodes || content.episodes.length === 0) {
        document.getElementById('episodesList').innerHTML = `<div class="empty-episodes"><i class="fas fa-film"></i><p>لا توجد حلقات متاحة حالياً</p></div>`;
        document.getElementById('episodesCount').textContent = '';
    }
}

// رجوع من التفاصيل للرئيسية
document.getElementById('closeVideoBtn').addEventListener('click', () => {
    if (!heroPlayer.classList.contains('active')) {
        document.getElementById('details').classList.remove('active');
        document.getElementById('home').classList.add('active');
    }
});

window.showDetails = showDetails;
window.renderContentGrid = renderContentGrid;
