-- ==============================================================================
-- KartHAS - Base de Datos SQLite / Cloudflare D1
-- ==============================================================================

DROP TABLE IF EXISTS race_results;
DROP TABLE IF EXISTS races;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS tournaments;
DROP TABLE IF EXISTS app_settings;

-- 1. Torneos
CREATE TABLE tournaments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    season TEXT NOT NULL,
    year INTEGER NOT NULL,
    current_round INTEGER DEFAULT 8,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Escuderías / Equipos (Parejas)
CREATE TABLE teams (
    id TEXT PRIMARY KEY,
    tournament_id TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    color_primary TEXT NOT NULL,
    color_secondary TEXT NOT NULL,
    color_accent TEXT,
    logo_icon TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Pilotos
CREATE TABLE drivers (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT DEFAULT '',
    nickname TEXT NOT NULL,
    number INTEGER DEFAULT 0,
    avatar_color TEXT,
    points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Fechas / Carreras
CREATE TABLE races (
    id TEXT PRIMARY KEY,
    tournament_id TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    track_name TEXT NOT NULL,
    circuit_length_km REAL DEFAULT 0.600,
    race_date TEXT NOT NULL,
    status TEXT CHECK(status IN ('completed', 'in_progress', 'scheduled')) DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Resultados de Carreras
CREATE TABLE race_results (
    id TEXT PRIMARY KEY,
    race_id TEXT NOT NULL REFERENCES races(id) ON DELETE CASCADE,
    driver_id TEXT NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    kart_number INTEGER,
    position INTEGER NOT NULL,
    laps INTEGER DEFAULT 15,
    gap TEXT DEFAULT '-',
    total_time TEXT,
    best_lap_time TEXT,
    is_fastest_lap INTEGER DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Configuraciones de la App
CREATE TABLE app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Índices de Alto Rendimiento para D1
CREATE INDEX idx_teams_tournament ON teams(tournament_id);
CREATE INDEX idx_drivers_team ON drivers(team_id);
CREATE INDEX idx_races_tournament ON races(tournament_id);
CREATE INDEX idx_results_race ON race_results(race_id);
CREATE INDEX idx_results_driver ON race_results(driver_id);
