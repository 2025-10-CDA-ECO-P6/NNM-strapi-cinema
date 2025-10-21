export function initSwiper() {
  window.mySwiper = new Swiper(".mySwiper", {
    loop: false,
    centeredSlides: false,
    spaceBetween: 30,
    grabCursor: true,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    // Responsive : adapte automatiquement le nombre de slides visibles
    breakpoints: {
      0: {
        slidesPerView: 1,     // 1 seule slide visible sur mobile
        spaceBetween: 15,
        centeredSlides: false, // centrée visuellement
      },
      768: {
        slidesPerView: 2,     // tablette
        spaceBetween: 25,
        centeredSlides: false,
      },
      1024: {
        slidesPerView: 3,     // desktop
        spaceBetween: 30,
        centeredSlides: false,
      },
    },
  });
}
