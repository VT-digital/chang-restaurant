/**
 * Chang Restaurant — Facebook Feed Frontend
 *
 * Tento kód nahradí sekci fb-plugin-wrap v index.html,
 * pokud se rozhodneš jít cestou Cloudflare Worker + Graph API.
 *
 * JAK POUŽÍT:
 *   1. Nasaď fb-feed-worker.js na Cloudflare Workers
 *   2. Nahraď WORKER_URL svou worker URL
 *   3. Vlož fbFeedInit() volání do main.js nebo na konec stránky
 *   4. V index.html vyměň celý fb-plugin-wrap div za fb-posts-grid div (viz níže)
 *
 * HTML SEKCE (nahradí fb-plugin-wrap):
 *   <div id="fb-posts-grid" class="fb-posts-grid"></div>
 */

const WORKER_URL = 'https://fb-feed.YOUR-SUBDOMAIN.workers.dev';

function fbFeedInit() {
    const grid = document.getElementById('fb-posts-grid');
    if (!grid) return;

    fetch(WORKER_URL)
        .then(r => r.json())
        .then(json => {
            const posts = json.data || [];
            if (posts.length === 0) {
                showFbFallback(grid);
                return;
            }
            grid.innerHTML = posts.map(renderPost).join('');
        })
        .catch(() => showFbFallback(grid));
}

function renderPost(post) {
    const date = new Date(post.created_time).toLocaleDateString('cs-CZ', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    const img = post.full_picture
        ? `<div class="fb-post-img" style="background-image: url('${post.full_picture}')"></div>`
        : '';
    const text = post.message
        ? `<p class="fb-post-text">${post.message.slice(0, 180)}${post.message.length > 180 ? '…' : ''}</p>`
        : '';

    return `
        <a href="${post.permalink_url}" target="_blank" rel="noopener" class="fb-post-card">
            ${img}
            <div class="fb-post-body">
                <span class="fb-post-date">${date}</span>
                ${text}
                <span class="fb-post-link">Zobrazit příspěvek →</span>
            </div>
        </a>
    `;
}

function showFbFallback(container) {
    container.innerHTML = `
        <div style="text-align:center; padding: 40px 20px; width: 100%;">
            <p style="color: var(--gray); margin-bottom: 20px;">Příspěvky se nepodařilo načíst.</p>
            <a href="https://www.facebook.com/people/Changrestaurance/61584589026860/"
               target="_blank" rel="noopener" class="btn btn-primary">Otevřít Facebook</a>
        </div>
    `;
}

// CSS třídy přidej do style.css:
/*
.fb-posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 30px;
}
.fb-post-card {
    background: var(--dark-card);
    border: 1px solid var(--dark-border);
    border-radius: var(--radius);
    overflow: hidden;
    text-decoration: none;
    transition: var(--transition);
    display: flex;
    flex-direction: column;
}
.fb-post-card:hover { border-color: var(--gold); transform: translateY(-3px); }
.fb-post-img {
    width: 100%; height: 180px;
    background-size: cover; background-position: center;
}
.fb-post-body { padding: 16px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
.fb-post-date { font-size: 0.75rem; color: var(--gray); }
.fb-post-text { font-size: 0.9rem; color: var(--white); line-height: 1.5; flex: 1; }
.fb-post-link { font-size: 0.8rem; color: var(--gold); }
*/

window.fbFeedInit = fbFeedInit;
