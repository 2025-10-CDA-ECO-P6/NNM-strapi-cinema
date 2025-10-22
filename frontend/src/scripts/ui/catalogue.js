import {getMoviesCatalogFromServer} from "../api/api_catalogue.js";

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w150';
const PLACEHOLDER_IMAGE = './src/assets/placeholder.webp';
const MOVIES_PER_PAGE = 12;
let allMovies = [];
let currentPage = 1;



    function createMovieCard(movie) {
        let imagePath = '';
        if (movie.poster_image) {
             imagePath = movie?.poster_image
                ? `https://image.tmdb.org/t/p/w1280${movie.poster_image}`
                : "./src/assets/placeholder.webp";
        } else {
            imagePath = movie?.background_image
                ? `https://image.tmdb.org/t/p/w1280${movie.background_image}`
                : "./src/assets/placeholder.webp";
        }

        const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
        const director = movie.realisator ? movie.realisator : 'N/A';
        const movieId = movie.tmdb_id || movie.id;

        return `
             <div class="movie-card" data-movie-id="${movie.id}">
                 <a href="./film.html?id=${movieId}">
                    <div class="movie-poster">
                        <img src="${imagePath}" 
                            alt="${movie.title}" 
                            loading="lazy" onerror="this.src='${PLACEHOLDER_IMAGE}'
                            ">
                        <div class="movie-overlay">   
                    </div>
                </a>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">
                        <i class="far fa-calendar"></i> ${releaseYear}
                    </span>
                    <span class="movie-rating">
                        <i class="fas fa-video-camera"></i> ${director}
                    </span>
                </div>
            </div>
        </div>
        `
    }



    // ====== afficher la page courante ========

    function renderCurrentPage(pageNumber) {
        const catalogueContainer = document.getElementById('catalogue-grid');
        const paginationContainer = document.getElementById('pagination-controls');
        currentPage = pageNumber;

        // calcul indices debut / fin
        const startIndex = (pageNumber - 1) * MOVIES_PER_PAGE
        const endIndex = startIndex + MOVIES_PER_PAGE

        // extraire les film pour la page courante
        const movieToShow = allMovies.slice(startIndex, endIndex);

        if (movieToShow.length === 0) {
            catalogueContainer.innerHTML = '<div>Aucun film à afficher sur cette page.</div>';
            paginationContainer.innerHTML = '';
            return;
        }

        // afficher les films
        catalogueContainer.innerHTML = movieToShow.map(movie => createMovieCard(movie)).join('');

        document.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', () => {
            const movieId = parseInt(card.dataset.movieId);
            if (movieId) {
                window.location.href = `film.html?id=${movieId}`;
            }
            });
        });


        // mettre a jour la pagination
        renderPaginationControls();
    }

// ====== Generer les controls de pagination ========

function renderPaginationControls() {
    const paginationContainer = document.getElementById('pagination-controls');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(allMovies.length / MOVIES_PER_PAGE);
    const maxButtons = 3;

    let html = `
        <button id="prev-page" class="btn-pagination" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Précédent
        </button>
    `;

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);



    if (startPage > 1) {
        html += `
            <button class="btn-page-number" data-page="1">1</button>
        `;

    }
    if (currentPage > 3) {
        html += `
                <span class="pagination-dots-before">...</span>
            `
    }

        html += `
            <button class="btn-page-number ">
                <strong>${currentPage}</strong>
            </button>
        `;




    if (endPage < totalPages) {

        html += `
            <button class="btn-page-number" data-page="${totalPages}">${totalPages}</button>
        `;
    }


    html += `
        <button id="next-page" class="btn-pagination" ${currentPage === totalPages ? 'disabled' : ''}>
            Suivant <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginationContainer.innerHTML = html;



    addPaginationListeners(totalPages);
}

function addPaginationListeners(totalPages) {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageButtons = document.querySelectorAll('.btn-page-number');


// PRECEDENT
    prevButton?.addEventListener('click', () => {
        if (currentPage > 1) {
            renderCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
// SUIVANT
    nextButton?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            renderCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

// INDEX
    pageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const page = parseInt(e.target.dataset.page);
            if (page !== currentPage) {
                renderCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

}







    async function displayGrid() {
        const catalogueContainer = document.getElementById('catalogue-grid');
        const loadingElement = document.getElementById('loading');
        const errorElement = document.getElementById('error-message');

        if (!catalogueContainer) {
            console.error('Container #catalogue-grid introuvable');
            return;
        }

        // afficher le loader
        if (loadingElement) loadingElement.style.display = 'block';
        if (errorElement) errorElement.style.display = 'none'

        try {
            const moviesData = await getMoviesCatalogFromServer();
            if (loadingElement) loadingElement.style.display ='none';

            const movies = moviesData

            if (!movies || movies.length === 0) {
                catalogueContainer.innerHTML = `<div>Aucun film trouvé.</div>`;
                return;
            }

            // 1. Stocker tous les films
            allMovies =movies // S'assurer que c'est un tableau de films
            renderCurrentPage(1);
        } catch (error) {
            console.error('Erreur lors de l\'affichage des films:', error);

            if (loadingElement) loadingElement.style.display = 'none';
            if (errorElement) {
                errorElement.style.display = 'block';
                errorElement.textContent = 'Erreur lors du chargement des films. Veuillez réessayer.';
            }

            catalogueContainer.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Impossible de charger les films</p>
                <button class="btn-retry" onclick="location.reload()">
                    <i class="fas fa-redo"></i> Réessayer
                </button>
            </div>
        `;
        }

    }

    function openMovieModal(movie) {
        const modal = document.getElementById('movie-modal');
        const modalContent = modal.querySelector('.modal-content');
        // Image de fond
        const backgroundImage = movie.background_image
            ? `https://image.tmdb.org/t/p/original${movie.background_image}`
            : movie.poster_image
                ? `https://image.tmdb.org/t/p/original${movie.poster_image}`
                : null;

        // Appliquer l'image de fond avec effet de fondu
        if (backgroundImage) {
            modalContent.style.backgroundImage = `
            linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.90) 100%),
            url('${backgroundImage}')
        `;
            modalContent.style.backgroundSize = 'cover';
            modalContent.style.backgroundPosition = 'center';
            modalContent.style.backgroundBlendMode = 'darken';
        } else {
            // Fallback si pas d'image
            modalContent.style.backgroundImage = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
        }

        const imagePath = movie.poster_image
            ? `https://image.tmdb.org/t/p/w500${movie.poster_image}`
            : movie.background_image
                ? `https://image.tmdb.org/t/p/w500${movie.background_image}`
                : PLACEHOLDER_IMAGE;

        document.getElementById('modal-image').src = imagePath;
        document.getElementById('modal-title').textContent = movie.title;
        document.getElementById('modal-year').innerHTML = `<i class="far fa-calendar"></i> ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}`;
        document.getElementById('modal-director').innerHTML = `<i class="fas fa-video-camera"></i> ${movie.realisator || 'N/A'}`;
        document.getElementById('modal-actors').innerHTML = displayActorsList(movie);


        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMovieModal() {
        const modale = document.getElementById('movie-modal');
        modale.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    function displayActorsList(movie) {
        let htmlContent = '';

        const movieListElement = document.getElementById('modal-actors');
        for (const actor  of movie.actors) {
            htmlContent += `<p>${actor}</p>`;
        }
        movieListElement.innerHTML = htmlContent;
        return movieListElement;
    }



async function init() {
    try {
        await displayGrid();

        // Event listeners pour fermer la modal
        document.getElementById('modal-close')?.addEventListener('click', closeMovieModal);
        document.getElementById('movie-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'movie-modal') {
                closeMovieModal();
            }
        });

        // Fermer avec Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMovieModal();
            }
        });
    } catch (error) {
        console.error("Erreur fatale lors de l'initialisation:", error);
    }
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', init);

