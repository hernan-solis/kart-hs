// Cloudflare Pages Function: /api/drivers
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
            "SELECT * FROM drivers ORDER BY points DESC"
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
        const id = body.id || `drv_${Date.now()}`;
        const { team_id, first_name, last_name, nickname, number, avatar_color, points } = body;

        await env.DB.prepare(`
            INSERT INTO drivers (id, team_id, first_name, last_name, nickname, number, avatar_color, points)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                team_id = excluded.team_id,
                first_name = excluded.first_name,
                last_name = excluded.last_name,
                nickname = excluded.nickname,
                number = excluded.number,
                avatar_color = excluded.avatar_color,
                points = excluded.points
        `).bind(id, team_id, first_name, last_name || '', nickname.toUpperCase(), number || 0, avatar_color || '#e10600', points || 0).run();

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

export async function onRequestDelete(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!env.DB || !id) {
        return new Response(JSON.stringify({ error: "D1 Database or driver ID missing" }), { status: 400 });
    }

    try {
        await env.DB.prepare("DELETE FROM drivers WHERE id = ?").bind(id).run();
        return new Response(JSON.stringify({ success: true }));
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
