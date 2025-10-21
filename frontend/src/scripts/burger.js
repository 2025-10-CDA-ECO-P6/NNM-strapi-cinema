// ===== SCRIPT HEADER BURGER =====
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');

if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });
}
