// Cloudflare Pages Function: /api/teams
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
            "SELECT * FROM teams ORDER BY points DESC"
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
        const id = body.id || `team_${Date.now()}`;
        const { tournament_id, name, short_name, color_primary, color_secondary, color_accent, logo_icon, points } = body;

        await env.DB.prepare(`
            INSERT INTO teams (id, tournament_id, name, short_name, color_primary, color_secondary, color_accent, logo_icon, points)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                short_name = excluded.short_name,
                color_primary = excluded.color_primary,
                color_secondary = excluded.color_secondary,
                color_accent = excluded.color_accent,
                logo_icon = excluded.logo_icon,
                points = excluded.points
        `).bind(id, tournament_id || 'tour_copa_piston_2025', name, short_name || name.slice(0, 3).toUpperCase(), color_primary, color_secondary || '#FFFFFF', color_accent || '#000000', logo_icon || 'haas', points || 0).run();

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
