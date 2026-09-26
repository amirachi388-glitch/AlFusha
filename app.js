// تفعيل القائمة الجانبية
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');

// فتح القائمة
menuBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
});

// إغلاق القائمة
closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

console.log("تطبيق الفسحة 🍿 جاهز!");
