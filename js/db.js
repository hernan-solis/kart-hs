// ==============================================================================
// KartHAS - Capa de Datos Híbrida (LocalStorage & Cloudflare D1)
// ==============================================================================

const DB = {
    isCloudflare: false,
    keys: {
        tournament: 'karthas_tournament',
        teams: 'karthas_teams',
        drivers: 'karthas_drivers',
        races: 'karthas_races',
        results: 'karthas_results',
        settings: 'karthas_settings'
    },

    async init() {
        try {
            if (window.location.protocol.startsWith('http')) {
                const res = await fetch('/api/tournaments', { method: 'GET' });
                if (res.ok) {
                    this.isCloudflare = true;
                    console.log("☁️ KartHAS conectado a Cloudflare Pages & D1");
                    return;
                }
            }
        } catch (e) {
            // Local dev / offline fallback
        }

        console.log("💾 Kart-HS operando en modo LocalStorage (Local / Offline)");
        const currentVersion = 'v2_official_nicknames';
        if (localStorage.getItem('kart_hs_db_version') !== currentVersion) {
            this.seedIfEmpty(true);
            localStorage.setItem('kart_hs_db_version', currentVersion);
        } else {
            this.seedIfEmpty(false);
        }
    },

    seedIfEmpty(force = false) {
        if (force || !localStorage.getItem(this.keys.tournament)) {
            const seed = window.SEED_DATA;
            if (!seed) return;
            localStorage.setItem(this.keys.tournament, JSON.stringify(seed.tournament));
            localStorage.setItem(this.keys.teams, JSON.stringify(seed.teams));
            localStorage.setItem(this.keys.drivers, JSON.stringify(seed.drivers));
            localStorage.setItem(this.keys.races, JSON.stringify(seed.races));
            localStorage.setItem(this.keys.results, JSON.stringify(seed.race_results));
            localStorage.setItem(this.keys.settings, JSON.stringify({
                points_system: { 1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1, 9: 0, 10: 0, fastest_lap: 1 }
            }));
            localStorage.setItem('kart_hs_db_version', 'v2_official_nicknames');
            console.log("🏁 Base de datos local actualizada con los pilotos oficiales de Copa Pistón 2025");
        }
    },

    // --------------------------------------------------------------------------
    // TORNEO
    // --------------------------------------------------------------------------
    async getTournament() {
        if (this.isCloudflare) {
            const res = await fetch('/api/tournaments');
            const list = await res.json();
            return list.find(t => t.is_active) || list[0] || null;
        }
        const raw = localStorage.getItem(this.keys.tournament);
        return raw ? JSON.parse(raw) : null;
    },

    async saveTournament(data) {
        if (this.isCloudflare) {
            const res = await fetch('/api/tournaments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        }
        localStorage.setItem(this.keys.tournament, JSON.stringify(data));
        return data;
    },

    // --------------------------------------------------------------------------
    // ESCUDERÍAS / EQUIPOS
    // --------------------------------------------------------------------------
    async getTeams() {
        if (this.isCloudflare) {
            const res = await fetch('/api/teams');
            return await res.json();
        }
        const raw = localStorage.getItem(this.keys.teams);
        const teams = raw ? JSON.parse(raw) : [];
        return teams.sort((a, b) => (b.points || 0) - (a.points || 0));
    },

    async saveTeam(team) {
        if (this.isCloudflare) {
            const res = await fetch('/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(team)
            });
            return await res.json();
        }
        let teams = await this.getTeams();
        const index = teams.findIndex(t => t.id === team.id);
        if (index >= 0) {
            teams[index] = { ...teams[index], ...team };
        } else {
            teams.push(team);
        }
        localStorage.setItem(this.keys.teams, JSON.stringify(teams));
        return team;
    },

    // --------------------------------------------------------------------------
    // PILOTOS
    // --------------------------------------------------------------------------
    async getDrivers() {
        if (this.isCloudflare) {
            const res = await fetch('/api/drivers');
            return await res.json();
        }
        const raw = localStorage.getItem(this.keys.drivers);
        const drivers = raw ? JSON.parse(raw) : [];
        return drivers.sort((a, b) => (b.points || 0) - (a.points || 0));
    },

    async saveDriver(driver) {
        if (this.isCloudflare) {
            const res = await fetch('/api/drivers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(driver)
            });
            return await res.json();
        }
        let drivers = await this.getDrivers();
        const index = drivers.findIndex(d => d.id === driver.id);
        if (index >= 0) {
            drivers[index] = { ...drivers[index], ...driver };
        } else {
            drivers.push(driver);
        }
        localStorage.setItem(this.keys.drivers, JSON.stringify(drivers));
        return driver;
    },

    async deleteDriver(driverId) {
        if (this.isCloudflare) {
            await fetch(`/api/drivers?id=${driverId}`, { method: 'DELETE' });
            return true;
        }
        let drivers = await this.getDrivers();
        drivers = drivers.filter(d => d.id !== driverId);
        localStorage.setItem(this.keys.drivers, JSON.stringify(drivers));
        return true;
    },

    // --------------------------------------------------------------------------
    // CARRERAS / FECHAS & RESULTADOS
    // --------------------------------------------------------------------------
    async getRaces() {
        if (this.isCloudflare) {
            const res = await fetch('/api/races');
            return await res.json();
        }
        const raw = localStorage.getItem(this.keys.races);
        const races = raw ? JSON.parse(raw) : [];
        return races.sort((a, b) => (b.round_number || 0) - (a.round_number || 0));
    },

    async getRace(raceId) {
        const races = await this.getRaces();
        return races.find(r => r.id === raceId) || null;
    },

    async getRaceResults(raceId) {
        if (this.isCloudflare) {
            const res = await fetch(`/api/races?action=results&race_id=${raceId}`);
            return await res.json();
        }
        const raw = localStorage.getItem(this.keys.results);
        const allResults = raw ? JSON.parse(raw) : {};
        return allResults[raceId] || [];
    },

    async saveRace(race, results = []) {
        if (this.isCloudflare) {
            const res = await fetch('/api/races', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ race, results })
            });
            return await res.json();
        }

        // Local storage
        let races = await this.getRaces();
        const raceIndex = races.findIndex(r => r.id === race.id);
        if (raceIndex >= 0) {
            races[raceIndex] = { ...races[raceIndex], ...race };
        } else {
            races.push(race);
        }
        localStorage.setItem(this.keys.races, JSON.stringify(races));

        if (results && results.length > 0) {
            const raw = localStorage.getItem(this.keys.results);
            const allResults = raw ? JSON.parse(raw) : {};
            allResults[race.id] = results;
            localStorage.setItem(this.keys.results, JSON.stringify(allResults));
        }

        return { race, results };
    },

    async deleteRace(raceId) {
        if (this.isCloudflare) {
            await fetch(`/api/races?id=${raceId}`, { method: 'DELETE' });
            return true;
        }
        let races = await this.getRaces();
        races = races.filter(r => r.id !== raceId);
        localStorage.setItem(this.keys.races, JSON.stringify(races));

        const raw = localStorage.getItem(this.keys.results);
        if (raw) {
            const allResults = JSON.parse(raw);
            delete allResults[raceId];
            localStorage.setItem(this.keys.results, JSON.stringify(allResults));
        }
        return true;
    },

    // --------------------------------------------------------------------------
    // UTILIDADES: RESET Y BACKUP
    // --------------------------------------------------------------------------
    resetToDefaults() {
        this.seedIfEmpty(true);
        window.location.reload();
    },

    exportData() {
        const data = {
            tournament: JSON.parse(localStorage.getItem(this.keys.tournament) || 'null'),
            teams: JSON.parse(localStorage.getItem(this.keys.teams) || '[]'),
            drivers: JSON.parse(localStorage.getItem(this.keys.drivers) || '[]'),
            races: JSON.parse(localStorage.getItem(this.keys.races) || '[]'),
            results: JSON.parse(localStorage.getItem(this.keys.results) || '{}')
        };
        return JSON.stringify(data, null, 2);
    },

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.tournament) localStorage.setItem(this.keys.tournament, JSON.stringify(data.tournament));
            if (data.teams) localStorage.setItem(this.keys.teams, JSON.stringify(data.teams));
            if (data.drivers) localStorage.setItem(this.keys.drivers, JSON.stringify(data.drivers));
            if (data.races) localStorage.setItem(this.keys.races, JSON.stringify(data.races));
            if (data.results) localStorage.setItem(this.keys.results, JSON.stringify(data.results));
            return true;
        } catch (e) {
            console.error("Error importando datos:", e);
            return false;
        }
    }
};

window.DB = DB;
