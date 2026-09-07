// Cloudflare Pages Function: /api/tournaments
// Conexión directa a Cloudflare D1 (SQLite)

export async function onRequestGet(context) {
    const { env } = context;
    if (!env.DB) {
        return new Response(JSON.stringify({ error: "D1 Database not bound" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { results } = await env.DB.prepare(
            "SELECT * FROM tournaments ORDER BY is_active DESC, created_at DESC"
        ).all();

        return new Response(JSON.stringify(results), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function onRequestPost(context) {
    const { request, env } = context;
    if (!env.DB) {
        return new Response(JSON.stringify({ error: "D1 Database not bound" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const body = await request.json();
        const id = body.id || `tour_${Date.now()}`;
        const { name, season, year, current_round, is_active } = body;

        await env.DB.prepare(`
            INSERT INTO tournaments (id, name, season, year, current_round, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                season = excluded.season,
                year = excluded.year,
                current_round = excluded.current_round,
                is_active = excluded.is_active
        `).bind(id, name, season, year || 2025, current_round || 8, is_active ? 1 : 0).run();

        return new Response(JSON.stringify({ success: true, id }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
