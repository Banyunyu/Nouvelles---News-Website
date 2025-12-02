// Enhanced User Authentication Functions
function initAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userProfile = document.getElementById('userProfile');
    const authButtons = document.getElementById('authButtons');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const logoutBtn = document.getElementById('logoutBtn');

    if (currentUser) {
        // User is logged in
        authButtons.style.display = 'none';
        userProfile.style.display = 'block';
        userName.textContent = currentUser.name;
        
        // Load user profile data for avatar
        const users = JSON.parse(localStorage.getItem('newsUsers')) || [];
        const userData = users.find(user => user.id === currentUser.id);
        
        // Set avatar
        if (userData && userData.avatar) {
            userAvatar.style.backgroundImage = `url(${userData.avatar})`;
            userAvatar.textContent = '';
        } else {
            // Fallback to initial
            userAvatar.style.backgroundImage = 'none';
            userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
            userAvatar.style.backgroundColor = getRandomColor();
        }
        
        // Logout functionality
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    } else {
        // User is not logged in
        authButtons.style.display = 'flex';
        userProfile.style.display = 'none';
    }
}

// Helper function to generate random color for avatar
function getRandomColor() {
    const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
        '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Initialize authentication when page loads
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadNews();
    
    // ... existing event listeners ...
});

// Initialize authentication when page loads
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadNews();
    
    // ... existing event listeners ...
});






// Konfigurasi API
const API_KEY = 'bf0baf035d454654959005cd70809320';
const BASE_URL = 'https://newsapi.org/v2';

// Elemen DOM
const newsContainer = document.getElementById('news-container');
const featuredNewsContainer = document.getElementById('featured-news-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const categoryLinks = document.querySelectorAll('.category-link');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

// State aplikasi
let currentCategory = 'general';
let currentSearchQuery = '';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadNews();
    
    // Event listener untuk kategori
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = e.target.dataset.category;
            currentSearchQuery = '';
            searchInput.value = '';
            loadNews();
        });
    });
    
    // Event listener untuk pencarian
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Event listener untuk menu mobile
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});

// Fungsi untuk memuat berita
async function loadNews() {
    showLoading();
    
    try {
        let articles = [];
        
        // Gunakan API sebenarnya
        const response = await fetch(
            `${BASE_URL}/top-headlines?country=us&category=${currentCategory}&pageSize=20&apiKey=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Gagal mengambil data berita');
        }
        
        const data = await response.json();
        articles = data.articles;
        
        displayNews(articles);
        displayFeaturedNews(articles.slice(0, 1));
    } catch (error) {
        console.error('Error:', error);
        // Fallback ke data dummy jika API gagal
        articles = getDummyNews();
        displayNews(articles);
        displayFeaturedNews(articles.slice(0, 1));
    }
}

// Fungsi untuk melakukan pencarian
async function performSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        loadNews();
        return;
    }
    
    currentSearchQuery = query;
    showLoading();
    
    try {
        // Gunakan API sebenarnya untuk pencarian
        const response = await fetch(
            `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Gagal mencari berita');
        }
        
        const data = await response.json();
        const articles = data.articles;
        
        if (articles.length === 0) {
            showError('Tidak ada berita yang ditemukan untuk pencarian: ' + query);
        } else {
            displayNews(articles);
            featuredNewsContainer.innerHTML = `<h2 class="section-title">Hasil Pencarian: "${query}"</h2>`;
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Gagal mencari berita: ' + error.message);
    }
}

// Fungsi untuk menampilkan berita
function displayNews(articles) {
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<div class="error">Tidak ada berita yang tersedia.</div>';
        return;
    }
    
    const newsHTML = articles.map(article => `
        <div class="news-card">
            <img src="${article.urlToImage || 'https://via.placeholder.com/300x180?text=Gambar+Tidak+Tersedia'}" 
                 alt="${article.title}" class="news-image" onerror="this.src='https://via.placeholder.com/300x180?text=Gambar+Tidak+Tersedia'">
            <div class="news-content">
                <h3 class="news-title">
                    <a href="${article.url}" target="_blank">${article.title}</a>
                </h3>
                <p class="news-description">${article.description || 'Tidak ada deskripsi tersedia.'}</p>
                <div class="news-meta">
                    <span class="news-source">${article.source?.name || 'Sumber tidak diketahui'}</span>
                    <span class="news-date">${formatDate(article.publishedAt)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    newsContainer.innerHTML = `
        <div class="news-grid">
            ${newsHTML}
        </div>
    `;
}

// Fungsi untuk menampilkan berita utama
function displayFeaturedNews(articles) {
    if (!articles || articles.length === 0) {
        return;
    }
    
    const article = articles[0];
    featuredNewsContainer.innerHTML = `
        <div class="featured-card">
            <img src="${article.urlToImage || 'https://via.placeholder.com/600x300?text=Gambar+Tidak+Tersedia'}" 
                 alt="${article.title}" class="featured-image" onerror="this.src='https://via.placeholder.com/600x300?text=Gambar+Tidak+Tersedia'">
            <div class="featured-content">
                <h2 class="featured-title">
                    <a href="${article.url}" target="_blank">${article.title}</a>
                </h2>
                <p class="news-description">${article.description || 'Tidak ada deskripsi tersedia.'}</p>
                <div class="news-meta">
                    <span class="news-source">${article.source?.name || 'Sumber tidak diketahui'}</span>
                    <span class="news-date">${formatDate(article.publishedAt)}</span>
                </div>
            </div>
        </div>
    `;
}

// Fungsi untuk menampilkan loading
function showLoading() {
    newsContainer.innerHTML = '<div class="loading">Memuat berita...</div>';
    featuredNewsContainer.innerHTML = '<div class="loading">Memuat berita utama...</div>';
}

// Fungsi untuk menampilkan error
function showError(message) {
    newsContainer.innerHTML = `<div class="error">${message}</div>`;
}

// Fungsi untuk memformat tanggal
function formatDate(dateString) {
    if (!dateString) return 'Tanggal tidak tersedia';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
// 