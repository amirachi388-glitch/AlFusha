// جلب العناصر
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

// فتح القائمة الجانبية
function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// إغلاق القائمة الجانبية
function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ربط الأحداث
menuBtn.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// التنقل بين الأقسام
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.dataset.section;

        // تحديث التفعيل في القائمة
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        // إخفاء كل الأقسام وإظهار المطلوب
        sections.forEach(s => s.classList.remove('active'));
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active');

        // إغلاق القائمة
        closeSidebar();

        // التمرير للأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

console.log('🍿 الفسحة جاهزة!');
