/**
 * Chang Restaurant — Facebook Feed Proxy Worker
 * Cloudflare Worker (free tier: 100 000 req/den)
 *
 * CO DĚLÁ:
 *   Stahuje posty z Facebook Graph API a vrací je jako JSON.
 *   Výsledek cachuje 1 hodinu, takže FB API se volá jen jednou za hodinu.
 *
 * SETUP (jednorázově):
 *
 *   1. Vytvořit Facebook App na developers.facebook.com
 *      → Nová app → Business → přidat produkt "Facebook Login for Business"
 *
 *   2. Získat User Access Token (Graph Explorer: developers.facebook.com/tools/explorer)
 *      → Vybrat svou app → přidat scope: pages_read_engagement, pages_show_list
 *      → Kliknout "Generate Access Token" a přihlásit se
 *
 *   3. Vyměnit za long-lived user token (60 dní → pak opakovat):
 *      GET https://graph.facebook.com/oauth/access_token
 *        ?grant_type=fb_exchange_token
 *        &client_id=APP_ID
 *        &client_secret=APP_SECRET
 *        &fb_exchange_token=SHORT_LIVED_TOKEN
 *
 *   4. Získat TRVALÝ Page Access Token (nevyprší):
 *      GET https://graph.facebook.com/me/accounts?access_token=LONG_LIVED_USER_TOKEN
 *      → Najít Chang v poli "data", zkopírovat "access_token" (to je page token = nevyprší)
 *
 *   5. Vytvořit Cloudflare Worker:
 *      npx wrangler init fb-feed
 *      → vložit tento kód do src/index.js (nebo worker.js)
 *
 *   6. Přidat secret (NIKDY nevkládat token přímo do kódu!):
 *      npx wrangler secret put FB_TOKEN
 *      → vložit page access token
 *
 *   7. Nasadit:
 *      npx wrangler deploy
 *      → URL bude: https://fb-feed.YOUR-SUBDOMAIN.workers.dev
 *
 *   8. V index.html nahradit WORKER_URL za tuto URL (viz fb-feed-frontend.js)
 */

const PAGE_ID = '61584589026860';
const FB_API = 'https://graph.facebook.com/v19.0';

export default {
    async fetch(request, env, ctx) {
        const CORS = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        };

        // OPTIONS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: CORS });
        }

        try {
            // Cache: výsledek drž 1 hodinu
            const cache = caches.default;
            const cacheKey = `https://fb-feed-cache/${PAGE_ID}/posts`;
            const cached = await cache.match(cacheKey);

            if (cached) {
                const data = await cached.json();
                return new Response(JSON.stringify({ ...data, _cached: true }), { headers: CORS });
            }

            const url = `${FB_API}/${PAGE_ID}/posts?` +
                `fields=message,full_picture,permalink_url,created_time,attachments{media,type,title}&` +
                `limit=6&` +
                `access_token=${env.FB_TOKEN}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.error) {
                console.error('FB API error:', data.error);
                return new Response(
                    JSON.stringify({ data: [], error: data.error.message }),
                    { headers: CORS }
                );
            }

            const response = new Response(JSON.stringify(data), {
                headers: { ...CORS, 'Cache-Control': 'public, max-age=3600' },
            });

            ctx.waitUntil(cache.put(cacheKey, response.clone()));
            return response;

        } catch (err) {
            console.error('Worker error:', err);
            return new Response(
                JSON.stringify({ data: [], error: 'Worker error' }),
                { status: 200, headers: CORS }
            );
        }
    },
};
