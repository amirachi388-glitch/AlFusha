// جلب العناصر
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const sections = document.querySelectorAll('.section');

// فتح القائمة الجانبية
menuBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
});

// إغلاق القائمة الجانبية
closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// دالة التنقل بين الأقسام
function showSection(sectionId) {
    // 1. إخفاء جميع الأقسام
    sections.forEach(sec => sec.classList.remove('active'));
    
    // 2. إظهار القسم المطلوب
    document.getElementById(sectionId).classList.add('active');
    
    // 3. إغلاق القائمة الجانبية بعد الاختيار
    sidebar.classList.remove('active');
}

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});
