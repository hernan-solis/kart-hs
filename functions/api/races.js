// Cloudflare Pages Function: /api/races
// Conexión directa a Cloudflare D1 (SQLite)

export async function onRequestGet(context) {
    const { request, env } = context;
    if (!env.DB) {
        return new Response(JSON.stringify({ error: "D1 Database not bound" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    const url = new URL(request.url);
    const action = url.searchParams.get("action");
    const raceId = url.searchParams.get("race_id");

    try {
        if (action === "results" && raceId) {
            const { results } = await env.DB.prepare(
                "SELECT * FROM race_results WHERE race_id = ? ORDER BY position ASC"
            ).bind(raceId).all();

            return new Response(JSON.stringify(results), {
                headers: { "Content-Type": "application/json" }
            });
        }

        const { results } = await env.DB.prepare(
            "SELECT * FROM races ORDER BY round_number DESC"
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
        const { race, results } = body;
        const raceId = race.id || `race_${Date.now()}`;

        // Inserción o actualización de la carrera
        await env.DB.prepare(`
            INSERT INTO races (id, tournament_id, round_number, name, track_name, circuit_length_km, race_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                track_name = excluded.track_name,
                circuit_length_km = excluded.circuit_length_km,
                race_date = excluded.race_date,
                status = excluded.status
        `).bind(
            raceId,
            race.tournament_id || 'tour_copa_piston_2025',
            race.round_number,
            race.name,
            race.track_name,
            race.circuit_length_km || 0.600,
            race.race_date,
            race.status || 'completed'
        ).run();

        // Inserción de resultados si vienen incluidos
        if (results && Array.isArray(results)) {
            // Eliminar anteriores si ya existían
            await env.DB.prepare("DELETE FROM race_results WHERE race_id = ?").bind(raceId).run();

            const stmts = results.map(r => {
                const resId = r.id || `res_${Date.now()}_${r.position}`;
                return env.DB.prepare(`
                    INSERT INTO race_results (id, race_id, driver_id, kart_number, position, laps, gap, total_time, best_lap_time, is_fastest_lap, points)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    resId,
                    raceId,
                    r.driver_id,
                    r.kart_number || 0,
                    r.position,
                    r.laps || 15,
                    r.gap || '-',
                    r.total_time || '-',
                    r.best_lap_time || '-',
                    r.is_fastest_lap ? 1 : 0,
                    r.points || 0
                );
            });

            await env.DB.batch(stmts);
        }

        return new Response(JSON.stringify({ success: true, id: raceId }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
