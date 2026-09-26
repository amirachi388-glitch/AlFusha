// =========================================
// 🍿 الفسحة - المنطق الرئيسي
// =========================================

const contentData = [
    {
        id: 'conan',
        title: 'المحقق كونان',
        type: 'أنمي',
        year: '2024',
        rating: '9.5',
        quality: 'HD',
        poster: 'https://picsum.photos/seed/conan2024/800/400',
        description: 'المحقق الأسطوري شينيتشي كودو يعود في مغامرة جديدة مليئة بالألغاز والتشويق. شاهد الحلقات الحصرية بجودة عالية مع ترجمة احترافية.',
        episodes: [
            { number: 1, title: 'البداية الجديدة', duration: '24 دقيقة', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
            { number: 2, title: 'اللغز الغامض', duration: '24 دقيقة', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
            { number: 3, title: 'المواجهة الأخيرة', duration: '24 دقيقة', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
        ]
    }
];

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
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active');
        closeSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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
    searchResults.innerHTML = `<div class="search-hint"><div class="hint-icon"><i class="fas fa-magnifying-glass"></i></div><h4>ابحث في الفسحة</h4><p>اكتب اسم أي فيلم أو مسلسل تبحث عنه</p></div>`;
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query) clearSearchBtn.classList.add('visible');
    else { clearSearchBtn.classList.remove('visible'); showSearchHint(); return; }

    const results = contentData.filter(item => item.title.toLowerCase().includes(query) || item.type.toLowerCase().includes(query));

    if (results.length === 0) {
        searchResults.innerHTML = `<div class="no-results"><i class="fas fa-face-frown"></i><h4>ما فيه نتائج</h4><p>جرب تكتب اسم ثاني</p></div>`;
        return;
    }

    searchResults.innerHTML = results.map(item => `
        <div class="search-result-item" onclick="openDetails('${item.id}')">
            <div class="result-poster"><img src="${item.poster}" alt="${item.title}"></div>
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

// ============ صفحة التفاصيل ============
const detailsOverlay = document.getElementById('detailsOverlay');
const closeDetailsBtn = document.getElementById('closeDetailsBtn');
const detailsPoster = document.getElementById('detailsPoster');
const detailsTitle = document.getElementById('detailsTitle');
const detailsMeta = document.getElementById('detailsMeta');
const detailsRatingRow = document.getElementById('detailsRatingRow');
const detailsDescription = document.getElementById('detailsDescription');
const episodesList = document.getElementById('episodesList');
const episodesCount = document.getElementById('episodesCount');

function openDetails(id) {
    const content = contentData.find(c => c.id === id);
    if (!content) return;

    detailsPoster.src = content.poster;
    detailsTitle.textContent = content.title;
    detailsMeta.innerHTML = `<span><i class="fas fa-calendar"></i> ${content.year}</span><span><i class="fas fa-tag"></i> ${content.type}</span><span><i class="fas fa-closed-captioning"></i> ${content.quality}</span>`;
    detailsRatingRow.innerHTML = `<div class="rating-pill"><i class="fas fa-star"></i> ${content.rating} تقييم</div><div class="rating-pill"><i class="fas fa-layer-group"></i> ${content.episodes.length} حلقات</div>`;
    detailsDescription.textContent = content.description;

    episodesCount.textContent = `${content.episodes.length} حلقات`;
    episodesList.innerHTML = content.episodes.map(ep => `
        <div class="episode-item" onclick="playEpisode('${content.id}', ${ep.number})">
            <div class="episode-number">${ep.number}</div>
            <div class="episode-info"><h4>${ep.title}</h4><p><i class="fas fa-clock"></i> ${ep.duration}</p></div>
            <div class="episode-play-icon"><i class="fas fa-play"></i></div>
        </div>
    `).join('');

    closeSearch();
    detailsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('detailsSheet').scrollTop = 0;
}

function closeDetails() { detailsOverlay.classList.remove('active'); document.body.style.overflow = ''; }
closeDetailsBtn.addEventListener('click', closeDetails);
detailsOverlay.addEventListener('click', (e) => { if (e.target === detailsOverlay) closeDetails(); });

// ============ مشغل الفيديو ============
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
const playerTitle = document.getElementById('playerTitle');
const playerSubtitle = document.getElementById('playerSubtitle');

let idleTimer = null;
let isSeeking = false;

function playEpisode(contentId, episodeNumber) {
    const content = contentData.find(c => c.id === contentId);
    const episode = content.episodes.find(e => e.number === episodeNumber);
    if (!episode) return;

    playerTitle.textContent = content.title;
    playerSubtitle.textContent = `الحلقة ${episode.number} • ${episode.title}`;

    const source = video.querySelector('source');
    source.src = episode.videoUrl;
    video.load();

    playerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { video.play().catch(() => {}); }, 300);
    resetIdleTimer();
}

function closePlayer() { video.pause(); video.currentTime = 0; playerOverlay.classList.remove('active'); document.body.style.overflow = ''; if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); }
closePlayerBtn.addEventListener('click', closePlayer);

function updatePlayIcon() {
    playPauseBtn.innerHTML = video.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    if (video.paused) { bigPlayBtn.classList.remove('hidden'); bigPlayBtn.innerHTML = '<i class="fas fa-play"></i>'; }
    else { bigPlayBtn.classList.add('hidden'); }
}

function togglePlay() { if (video.paused) video.play().catch(() => {}); else video.pause(); resetIdleTimer(); }
playPauseBtn.addEventListener('click', togglePlay);
bigPlayBtn.addEventListener('click', togglePlay);
video.addEventListener('click', () => {
    if (playerControls.classList.contains('idle')) { playerControls.classList.remove('idle'); playerTop.classList.remove('idle'); resetIdleTimer(); }
    else { togglePlay(); }
});
video.addEventListener('play', updatePlayIcon);
video.addEventListener('pause', updatePlayIcon);

muteBtn.addEventListener('click', () => { video.muted = !video.muted; muteBtn.innerHTML = video.muted ? '<i class="fas fa-volume-xmark"></i>' : '<i class="fas fa-volume-high"></i>'; resetIdleTimer(); });

fullscreenBtn.addEventListener('click', () => {
    const elem = playerContainer;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (elem.requestFullscreen) elem.requestFullscreen(); else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        if (document.exitFullscreen) document.exitFullscreen(); else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
    resetIdleTimer();
});

function formatTime(sec) { if (!sec || isNaN(sec)) return '0:00'; const m = Math.floor(sec / 60); const s = Math.floor(sec % 60); return `${m}:${s < 10 ? '0' : ''}${s}`; }

function updateProgress() {
    if (isSeeking || !video.duration) return;
    const percent = (video.currentTime / video.duration) * 100;
    progressPlayed.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(video.currentTime);
}

video.addEventListener('timeupdate', updateProgress);
video.addEventListener('loadedmetadata', () => { totalTimeEl.textContent = formatTime(video.duration); });
video.addEventListener('progress', () => { if (video.buffered.length > 0 && video.duration) { const bufferedEnd = video.buffered.end(video.buffered.length - 1); progressBuffer.style.width = (bufferedEnd / video.duration * 100) + '%'; } });
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

let seekStart = false;
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

function resetIdleTimer() {
    playerControls.classList.remove('idle'); playerTop.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!video.paused) { playerControls.classList.add('idle'); playerTop.classList.add('idle'); } }, 3000);
}
playerContainer.addEventListener('mousemove', resetIdleTimer);
playerContainer.addEventListener('touchstart', resetIdleTimer);
document.addEventListener('keydown', (e) => {
    if (!playerOverlay.classList.contains('active')) return;
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePlay(); }
    if (e.key === 'ArrowRight') { video.currentTime += 5; resetIdleTimer(); }
    if (e.key === 'ArrowLeft') { video.currentTime -= 5; resetIdleTimer(); }
    if (e.key === 'm') muteBtn.click();
    if (e.key === 'f') fullscreenBtn.click();
    if (e.key === 'Escape') closePlayer();
});

// ربط الأحداث
document.getElementById('conanCard').addEventListener('click', () => openDetails('conan'));
window.openDetails = openDetails;
window.playEpisode = playEpisode;
console.log('🍿 الفسحة جاهزة!');
