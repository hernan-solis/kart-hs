// ==============================================================================
// KartHAS - Controlador Principal de la Aplicación
// ==============================================================================

const App = {
    currentTab: 'teams',
    activeTournament: null,
    teams: [],
    drivers: [],
    races: [],

    async init() {
        await DB.init();
        Auth.init();
        await this.loadData();
        this.setupEventListeners();
        this.renderAll();
    },

    async loadData() {
        this.activeTournament = await DB.getTournament();
        this.teams = await DB.getTeams();
        this.drivers = await DB.getDrivers();
        this.races = await DB.getRaces();
    },

    setupEventListeners() {
        // Pestañas Desktop y Móvil
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Botón Login / Logout Admin
        const authBtn = document.getElementById('authNavBtn');
        if (authBtn) {
            authBtn.addEventListener('click', () => {
                if (Auth.isAdmin()) {
                    Auth.logout();
                    this.showToast('Sesión de administrador cerrada', 'info');
                    this.renderAll();
                } else {
                    this.openModal('loginModal');
                }
            });
        }

        // Formulario de Login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = document.getElementById('loginUser').value;
                const pass = document.getElementById('loginPass').value;
                const res = Auth.login(user, pass);
                if (res.success) {
                    this.closeModal('loginModal');
                    this.showToast('¡Bienvenido, Administrador!', 'success');
                    this.renderAll();
                    loginForm.reset();
                } else {
                    this.showToast(res.message, 'error');
                }
            });
        }

        // Eventos del Escáner OCR
        const fileInput = document.getElementById('sheetFileInput');
        const cameraInput = document.getElementById('sheetCameraInput');
        const dropzone = document.getElementById('scannerDropzone');

        if (dropzone && fileInput) {
            dropzone.addEventListener('click', () => fileInput.click());
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.style.borderColor = '#e10600';
            });
            dropzone.addEventListener('dragleave', () => {
                dropzone.style.borderColor = 'var(--border-color)';
            });
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.style.borderColor = 'var(--border-color)';
                if (e.dataTransfer.files.length > 0) {
                    this.handleFileSelected(e.dataTransfer.files[0]);
                }
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelected(e.target.files[0]);
                }
            });
        }

        if (cameraInput) {
            cameraInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelected(e.target.files[0]);
                }
            });
        }

        // Botón de Cargar Ejemplo Zárate Carrera 9
        const testZarateBtn = document.getElementById('testZarateSheetBtn');
        if (testZarateBtn) {
            testZarateBtn.addEventListener('click', () => {
                this.loadSampleZarateSheet();
            });
        }

        // Guardar Carrera desde Revisión de Escaneo
        const saveScannedRaceBtn = document.getElementById('saveScannedRaceBtn');
        if (saveScannedRaceBtn) {
            saveScannedRaceBtn.addEventListener('click', () => {
                this.saveScannedRaceToDatabase();
            });
        }

        // Cerrar modales al hacer clic en overlay o botón cerrar
        document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === el || el.classList.contains('modal-close')) {
                    const modal = el.closest('.modal-overlay');
                    if (modal) modal.classList.remove('active');
                }
            });
        });

        // Formulario de Piloto (Admin)
        const driverForm = document.getElementById('driverForm');
        if (driverForm) {
            driverForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveDriverFromForm();
            });
        }

        // Formulario de Escudería (Admin)
        const teamForm = document.getElementById('teamForm');
        if (teamForm) {
            teamForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveTeamFromForm();
            });
        }
    },

    switchTab(tabId) {
        this.currentTab = tabId;
        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
        const activeSection = document.getElementById(`tab-${tabId}`);
        if (activeSection) activeSection.style.display = 'block';

        // Actualizar botones activos
        document.querySelectorAll('[data-tab]').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (tabId === 'teams') this.renderTeamsTab();
        if (tabId === 'drivers') this.renderDriversTab();
        if (tabId === 'races') this.renderRacesTab();
        if (tabId === 'admin') this.renderAdminTab();
    },

    async renderAll() {
        await this.loadData();
        this.renderHeader();
        this.switchTab(this.currentTab);
        Auth.updateUI();
    },

    renderHeader() {
        if (this.activeTournament) {
            document.getElementById('headerTournamentName').textContent = this.activeTournament.name;
            document.getElementById('headerSeasonName').textContent = this.activeTournament.season;
            document.getElementById('headerRoundBadge').innerHTML = `
                <span class="live-dot"></span>
                FECHA ${this.activeTournament.current_round} COMPLETADA
            `;
        }
    },

    // --------------------------------------------------------------------------
    // VISTA: TABLA DE EQUIPOS / CONSTRUCTORES
    // --------------------------------------------------------------------------
    renderTeamsTab() {
        const teams = [...this.teams].sort((a, b) => (b.points || 0) - (a.points || 0));
        const maxPoints = Math.max(...teams.map(t => t.points || 1), 100);

        // Podio Top 3
        const podiumContainer = document.getElementById('teamsPodiumGrid');
        if (podiumContainer && teams.length >= 3) {
            podiumContainer.innerHTML = `
                <!-- 2º Puesto Plata -->
                <div class="podium-card podium-2">
                    <div class="podium-badge">🥈</div>
                    <img src="assets/icons/${teams[1].logo_icon}.svg" class="podium-team-logo" alt="${teams[1].name}" onerror="this.src='assets/icons/redbull.svg'">
                    <div class="podium-team-name">${teams[1].name}</div>
                    <div class="podium-drivers">${this.getTeamDriverPairText(teams[1].id)}</div>
                    <div class="podium-points">${teams[1].points}</div>
                    <div class="podium-points-label">PUNTOS</div>
                </div>

                <!-- 1º Puesto Oro -->
                <div class="podium-card podium-1">
                    <div class="podium-badge">🏆</div>
                    <img src="assets/icons/${teams[0].logo_icon}.svg" class="podium-team-logo" alt="${teams[0].name}" onerror="this.src='assets/icons/haas.svg'">
                    <div class="podium-team-name">${teams[0].name}</div>
                    <div class="podium-drivers">${this.getTeamDriverPairText(teams[0].id)}</div>
                    <div class="podium-points">${teams[0].points}</div>
                    <div class="podium-points-label">PUNTOS</div>
                </div>

                <!-- 3º Puesto Bronce -->
                <div class="podium-card podium-3">
                    <div class="podium-badge">🥉</div>
                    <img src="assets/icons/${teams[2].logo_icon}.svg" class="podium-team-logo" alt="${teams[2].name}" onerror="this.src='assets/icons/mclaren.svg'">
                    <div class="podium-team-name">${teams[2].name}</div>
                    <div class="podium-drivers">${this.getTeamDriverPairText(teams[2].id)}</div>
                    <div class="podium-points">${teams[2].points}</div>
                    <div class="podium-points-label">PUNTOS</div>
                </div>
            `;
        }

        // Tabla Completa de Equipos
        const tbody = document.getElementById('teamsTableBody');
        if (tbody) {
            tbody.innerHTML = teams.map((team, index) => {
                const pos = index + 1;
                const posClass = pos === 1 ? 'pos-1' : (pos === 2 ? 'pos-2' : (pos === 3 ? 'pos-3' : ''));
                const iconTrophy = pos === 1 ? '🏆' : (pos === 2 ? '🥈' : (pos === 3 ? '🥉' : pos));
                const pct = Math.round((team.points / maxPoints) * 100);

                return `
                    <tr class="team-row">
                        <td style="width: 60px;">
                            <span class="pos-number ${posClass}">${iconTrophy}</span>
                        </td>
                        <td>
                            <div class="team-badge-cell">
                                <span class="team-color-indicator" style="background-color: ${team.color_primary};"></span>
                                <img src="assets/icons/${team.logo_icon}.svg" class="team-logo-small" alt="${team.name}" onerror="this.style.display='none'">
                                <div>
                                    <div class="team-name-bold" style="color: ${team.color_primary}">${team.name}</div>
                                    <div style="width: 120px; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; margin-top: 4px; overflow: hidden;">
                                        <div style="width: ${pct}%; height: 100%; background: ${team.color_primary};"></div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="drivers-pair-text">
                                ${this.getTeamDriverPairHTML(team.id)}
                            </div>
                        </td>
                        <td style="text-align: right;">
                            <span class="points-pill" style="color: ${pos === 1 ? '#ffd700' : '#ffffff'};">
                                ${team.points} <span class="pts-unit">PTS</span>
                            </span>
                        </td>
                        <td class="admin-only ${Auth.isAdmin() ? '' : 'hidden-admin'}" style="text-align: right; width: 80px;">
                            <button class="btn-secondary" onclick="App.openEditTeamModal('${team.id}')" title="Editar Escudería">✏️</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    },

    getTeamDriverPairText(teamId) {
        const teamDrivers = this.drivers.filter(d => d.team_id === teamId);
        if (teamDrivers.length === 0) return 'Sin pilotos asignados';
        return teamDrivers.map(d => d.nickname).join(' + ');
    },

    getTeamDriverPairHTML(teamId) {
        const teamDrivers = this.drivers.filter(d => d.team_id === teamId);
        if (teamDrivers.length === 0) return '<span style="color: var(--text-muted)">Sin pilotos</span>';
        return teamDrivers.map((d, i) => `
            <span class="driver-${i+1}">
                <strong>${d.nickname}</strong> <span style="font-size: 11px; opacity: 0.7;">(${d.first_name})</span>
            </span>
        `).join(' <span style="color: var(--f1-red); font-weight: bold;">+</span> ');
    },

    // --------------------------------------------------------------------------
    // VISTA: TABLA DE PILOTOS / INDIVIDUAL
    // --------------------------------------------------------------------------
    renderDriversTab() {
        const drivers = [...this.drivers].sort((a, b) => (b.points || 0) - (a.points || 0));
        const tbody = document.getElementById('driversTableBody');
        if (!tbody) return;

        tbody.innerHTML = drivers.map((driver, index) => {
            const pos = index + 1;
            const posClass = pos === 1 ? 'pos-1' : (pos === 2 ? 'pos-2' : (pos === 3 ? 'pos-3' : ''));
            const iconBadge = pos === 1 ? '🥇' : (pos === 2 ? '🥈' : (pos === 3 ? '🥉' : pos));
            const team = this.teams.find(t => t.id === driver.team_id);

            return `
                <tr>
                    <td style="width: 50px;">
                        <span class="pos-number ${posClass}">${iconBadge}</span>
                    </td>
                    <td style="width: 60px;">
                        <span style="font-family: var(--font-mono); font-weight: 900; font-size: 18px; color: ${team ? team.color_primary : '#ffffff'};">
                            #${driver.number || '-'}
                        </span>
                    </td>
                    <td>
                        <div>
                            <div class="driver-nickname">${driver.nickname}</div>
                            <div class="driver-fullname">${driver.first_name} ${driver.last_name || ''}</div>
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            ${team ? `
                                <span class="team-color-indicator" style="height: 20px; width: 4px; background: ${team.color_primary}"></span>
                                <span style="font-family: var(--font-display); font-weight: 700; color: ${team.color_primary}; text-transform: uppercase;">
                                    ${team.name}
                                </span>
                            ` : '-'}
                        </div>
                    </td>
                    <td style="text-align: center; font-family: var(--font-mono); font-weight: 700; color: #ffd700;">
                        ${driver.wins || 0}
                    </td>
                    <td style="text-align: center; font-family: var(--font-mono); color: var(--text-secondary);">
                        ${driver.podiums || 0}
                    </td>
                    <td style="text-align: center;">
                        ${driver.fastest_laps ? `<span class="fastest-lap-badge">⏱️ ${driver.fastest_laps}</span>` : '<span style="color: var(--text-muted);">-</span>'}
                    </td>
                    <td style="text-align: right;">
                        <span class="points-pill" style="color: ${pos === 1 ? '#ffd700' : '#ffffff'};">
                            ${driver.points || 0} <span class="pts-unit">PTS</span>
                        </span>
                    </td>
                    <td class="admin-only ${Auth.isAdmin() ? '' : 'hidden-admin'}" style="text-align: right; width: 80px;">
                        <button class="btn-secondary" onclick="App.openEditDriverModal('${driver.id}')" title="Editar Piloto">✏️</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // --------------------------------------------------------------------------
    // VISTA: HISTORIAL DE FECHAS & RESULTADOS
    // --------------------------------------------------------------------------
    async renderRacesTab() {
        const racesSelect = document.getElementById('raceSelectFilter');
        if (!racesSelect) return;

        // Cargar opciones en el select
        racesSelect.innerHTML = this.races.map(r => `
            <option value="${r.id}" ${r.id === 'race_9' ? 'selected' : ''}>
                ${r.name} - ${r.race_date} (${r.track_name})
            </option>
        `).join('');

        racesSelect.onchange = () => {
            this.renderRaceDetail(racesSelect.value);
        };

        const initialRaceId = racesSelect.value || (this.races[0] ? this.races[0].id : null);
        if (initialRaceId) {
            await this.renderRaceDetail(initialRaceId);
        }
    },

    async renderRaceDetail(raceId) {
        const race = this.races.find(r => r.id === raceId);
        const results = await DB.getRaceResults(raceId);
        const infoEl = document.getElementById('raceDetailHeaderInfo');
        const tbody = document.getElementById('raceResultsTableBody');

        if (infoEl && race) {
            infoEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h3 style="font-family: var(--font-display); font-size: 22px; font-weight: 900; color: #ffffff;">${race.name}</h3>
                        <p style="color: var(--text-secondary); font-size: 13px;">📍 ${race.track_name} • Circuito: ${race.circuit_length_km} km • Fecha: ${race.race_date}</p>
                    </div>
                    <div>
                        <span class="tournament-badge" style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.4); color: #34d399;">
                            ✓ Finalizada
                        </span>
                    </div>
                </div>
            `;
        }

        if (tbody) {
            if (!results || results.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted);">
                            No hay resultados registrados para esta fecha aún.
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = results.map(row => {
                const driver = this.drivers.find(d => d.id === row.driver_id);
                const team = driver ? this.teams.find(t => t.id === driver.team_id) : null;
                const pos = row.position;
                const posClass = pos === 1 ? 'pos-1' : (pos === 2 ? 'pos-2' : (pos === 3 ? 'pos-3' : ''));

                return `
                    <tr>
                        <td style="width: 50px;">
                            <span class="pos-number ${posClass}">${pos}</span>
                        </td>
                        <td style="width: 60px; font-family: var(--font-mono); font-weight: 800;">
                            #${row.kart_number || '-'}
                        </td>
                        <td>
                            <div style="font-weight: 800; font-family: var(--font-display); font-size: 15px;">
                                ${driver ? driver.nickname : (row.driver_name || 'Piloto Desconocido')}
                            </div>
                            <div style="font-size: 11px; color: var(--text-muted);">
                                ${driver ? `${driver.first_name} ${driver.last_name || ''}` : ''}
                            </div>
                        </td>
                        <td>
                            ${team ? `
                                <span style="color: ${team.color_primary}; font-weight: 700; font-family: var(--font-display); font-size: 13px;">
                                    ${team.name}
                                </span>
                            ` : '-'}
                        </td>
                        <td style="text-align: center; font-family: var(--font-mono);">${row.laps || 15}</td>
                        <td style="font-family: var(--font-mono); color: var(--text-secondary); font-size: 13px;">${row.gap || '-'}</td>
                        <td style="font-family: var(--font-mono); font-size: 13px;">${row.total_time || '-'}</td>
                        <td style="font-family: var(--font-mono); font-size: 13px;">
                            ${row.is_fastest_lap ? `
                                <span class="fastest-lap-badge" title="Vuelta Rápida Oficial (+1 punto)">
                                    ⏱️ ${row.best_lap_time}
                                </span>
                            ` : (row.best_lap_time || '-')}
                        </td>
                        <td style="text-align: right;">
                            <span class="points-pill" style="color: ${row.points > 0 ? '#ffffff' : 'var(--text-muted)'};">
                                +${row.points} <span class="pts-unit">PTS</span>
                            </span>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    },

    // --------------------------------------------------------------------------
    // ESCÁNER OCR & PROCESAMIENTO DE PLANILLA DE TIEMPOS
    // --------------------------------------------------------------------------
    async handleFileSelected(file) {
        if (!file) return;

        const progressWrapper = document.getElementById('telemetryProgressWrapper');
        const progressBar = document.getElementById('telemetryProgressBar');
        const statusText = document.getElementById('telemetryStatusText');

        if (progressWrapper) progressWrapper.style.display = 'block';

        try {
            const result = await OCRScanner.processFile(file, (info) => {
                if (progressBar) progressBar.style.width = `${Math.round(info.progress * 100)}%`;
                if (statusText) statusText.textContent = info.status;
            });

            if (progressWrapper) progressWrapper.style.display = 'none';
            this.showScannedReviewModal(result.rows);
        } catch (err) {
            console.error(err);
            if (progressWrapper) progressWrapper.style.display = 'none';
            this.showToast('Error al procesar la imagen: ' + err.message, 'error');
        }
    },

    // Cargar directamente la hoja de Zárate incluida en el proyecto como prueba instantánea
    async loadSampleZarateSheet() {
        const progressWrapper = document.getElementById('telemetryProgressWrapper');
        const progressBar = document.getElementById('telemetryProgressBar');
        const statusText = document.getElementById('telemetryStatusText');

        if (progressWrapper) progressWrapper.style.display = 'block';
        if (progressBar) progressBar.style.width = '30%';
        if (statusText) statusText.textContent = 'Cargando planilla de Zárate (Carrera 9)...';

        setTimeout(async () => {
            if (progressBar) progressBar.style.width = '75%';
            if (statusText) statusText.textContent = 'Analizando tiempos de Zárate y reconociendo escuderías...';

            setTimeout(async () => {
                if (progressBar) progressBar.style.width = '100%';
                if (progressWrapper) progressWrapper.style.display = 'none';

                const rows = OCRScanner.getStandardZarateRace9Data(this.drivers);
                this.showScannedReviewModal(rows);
                this.showToast('¡Planilla oficial de Zárate leída con éxito!', 'success');
            }, 500);
        }, 400);
    },

    showScannedReviewModal(rows) {
        const modal = document.getElementById('scannedReviewModal');
        const tbody = document.getElementById('scannedReviewTableBody');
        if (!modal || !tbody) return;

        OCRScanner.scannedRows = rows;

        tbody.innerHTML = rows.map((r, index) => {
            const driverOptions = this.drivers.map(d => `
                <option value="${d.id}" ${d.id === r.driver_id ? 'selected' : ''}>
                    ${d.nickname} (${d.first_name}) - #${d.number}
                </option>
            `).join('');

            return `
                <tr data-index="${index}">
                    <td style="width: 45px; font-weight: 800;">${r.position}</td>
                    <td style="width: 70px;">
                        <input type="number" class="form-input form-input-sm" style="padding: 4px 8px; width: 60px;" value="${r.kart_number}" data-field="kart_number">
                    </td>
                    <td>
                        <select class="form-select form-select-sm" data-field="driver_id" style="padding: 4px 8px;">
                            <option value="">-- Seleccionar Piloto --</option>
                            ${driverOptions}
                        </select>
                        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                            Detectado: <em>"${r.scanned_name}"</em>
                        </div>
                    </td>
                    <td style="font-family: var(--font-mono); font-size: 13px;">${r.total_time}</td>
                    <td style="font-family: var(--font-mono); font-size: 13px;">${r.best_lap_time}</td>
                    <td style="text-align: center;">
                        <input type="radio" name="fastest_lap_radio" ${r.is_fastest_lap ? 'checked' : ''} onchange="App.handleFastestLapChange(${index})">
                    </td>
                    <td style="text-align: right; font-weight: 800; font-family: var(--font-mono);" id="points-preview-${index}">
                        ${r.points} pts
                    </td>
                </tr>
            `;
        }).join('');

        this.openModal('scannedReviewModal');
    },

    handleFastestLapChange(selectedIndex) {
        OCRScanner.scannedRows.forEach((r, idx) => {
            r.is_fastest_lap = (idx === selectedIndex) ? 1 : 0;
            r.points = OCRScanner.calculatePoints(r.position, r.is_fastest_lap === 1);
            const ptEl = document.getElementById(`points-preview-${idx}`);
            if (ptEl) ptEl.textContent = `${r.points} pts`;
        });
    },

    async saveScannedRaceToDatabase() {
        if (!Auth.isAdmin()) {
            this.showToast('Debes iniciar sesión como Administrador para guardar carreras', 'error');
            this.openModal('loginModal');
            return;
        }

        const raceNameInput = document.getElementById('scannedRaceName').value.trim() || 'Fecha ' + (this.races.length + 1);
        const trackNameInput = document.getElementById('scannedRaceTrack').value.trim() || 'Kartódromo Internacional de Zárate';
        const raceDateInput = document.getElementById('scannedRaceDate').value || new Date().toISOString().split('T')[0];

        // Recoger datos editados de la tabla
        const rows = [];
        const trs = document.querySelectorAll('#scannedReviewTableBody tr');

        trs.forEach(tr => {
            const idx = parseInt(tr.getAttribute('data-index'));
            const baseRow = OCRScanner.scannedRows[idx];
            const kartInput = tr.querySelector('[data-field="kart_number"]');
            const driverSelect = tr.querySelector('[data-field="driver_id"]');

            const driverId = driverSelect ? driverSelect.value : baseRow.driver_id;
            const kartNum = kartInput ? parseInt(kartInput.value) : baseRow.kart_number;

            rows.push({
                id: `res_${Date.now()}_${baseRow.position}`,
                driver_id: driverId,
                kart_number: kartNum,
                position: baseRow.position,
                laps: baseRow.laps,
                gap: baseRow.gap,
                total_time: baseRow.total_time,
                best_lap_time: baseRow.best_lap_time,
                is_fastest_lap: baseRow.is_fastest_lap,
                points: baseRow.points
            });
        });

        const newRaceId = `race_${Date.now()}`;
        const newRace = {
            id: newRaceId,
            tournament_id: this.activeTournament ? this.activeTournament.id : 'tour_copa_piston_2025',
            round_number: this.races.length + 1,
            name: raceNameInput,
            track_name: trackNameInput,
            circuit_length_km: 0.600,
            race_date: raceDateInput,
            status: 'completed'
        };

        // Guardar carrera y resultados
        await DB.saveRace(newRace, rows);

        // Sumar puntos a los pilotos y a sus equipos
        for (const row of rows) {
            if (row.driver_id) {
                const driver = this.drivers.find(d => d.id === row.driver_id);
                if (driver) {
                    driver.points = (driver.points || 0) + row.points;
                    if (row.position === 1) driver.wins = (driver.wins || 0) + 1;
                    if (row.position <= 3) driver.podiums = (driver.podiums || 0) + 1;
                    if (row.is_fastest_lap) driver.fastest_laps = (driver.fastest_laps || 0) + 1;
                    await DB.saveDriver(driver);

                    // Sumar a la escudería
                    const team = this.teams.find(t => t.id === driver.team_id);
                    if (team) {
                        team.points = (team.points || 0) + row.points;
                        await DB.saveTeam(team);
                    }
                }
            }
        }

        // Actualizar torneo a la nueva fecha
        if (this.activeTournament) {
            this.activeTournament.current_round = newRace.round_number;
            await DB.saveTournament(this.activeTournament);
        }

        this.closeModal('scannedReviewModal');
        this.showToast(`¡${newRace.name} guardada exitosamente y puntos actualizados!`, 'success');
        await this.renderAll();
        this.switchTab('races');
    },

    // --------------------------------------------------------------------------
    // PANEL DE ADMINISTRACIÓN
    // --------------------------------------------------------------------------
    renderAdminTab() {
        const container = document.getElementById('adminPanelContainer');
        if (!container) return;

        if (!Auth.isAdmin()) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 54px; margin-bottom: 16px;">🔐</div>
                    <h2 style="font-family: var(--font-display); font-size: 24px; font-weight: 800; text-transform: uppercase;">
                        Acceso Restringido para Administrador
                    </h2>
                    <p style="color: var(--text-secondary); max-width: 450px; margin: 10px auto 24px;">
                        Inicia sesión con tu usuario y contraseña de administrador para crear torneos, modificar escuderías, pilotos y gestionar las fechas del campeonato.
                    </p>
                    <button class="btn-f1" onclick="App.openModal('loginModal')">
                        <span class="icon">🔓</span> Iniciar Sesión (admin / admin)
                    </button>
                </div>
            `;
            return;
        }

        // Si es Admin, renderizar panel de control completo
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
                <div>
                    <h2 style="font-family: var(--font-display); font-size: 24px; font-weight: 900; text-transform: uppercase;">
                        ⚙️ Centro de Control de Carreras
                    </h2>
                    <p style="color: var(--text-secondary); font-size: 13px;">
                        Gestión completa del torneo, escuderías de F1, parejas de pilotos y base de datos.
                    </p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn-f1" onclick="App.openNewDriverModal()">
                        + Nuevo Piloto
                    </button>
                    <button class="btn-secondary" onclick="App.openModal('tournamentModal')">
                        🏆 Ajustes Torneo
                    </button>
                </div>
            </div>

            <!-- Resumen Rápido -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <div style="color: var(--text-muted); font-size: 12px; text-transform: uppercase; font-weight: 700;">Torneo Actual</div>
                    <div style="font-size: 20px; font-weight: 800; font-family: var(--font-display); color: #ffffff;">${this.activeTournament ? this.activeTournament.name : '-'}</div>
                    <div style="font-size: 12px; color: var(--f1-red); font-weight: 600;">Fecha ${this.activeTournament ? this.activeTournament.current_round : 8} activa</div>
                </div>
                <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <div style="color: var(--text-muted); font-size: 12px; text-transform: uppercase; font-weight: 700;">Escuderías</div>
                    <div style="font-size: 20px; font-weight: 800; font-family: var(--font-display); color: #ffffff;">${this.teams.length} Equipos</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Parejas de 2 pilotos</div>
                </div>
                <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <div style="color: var(--text-muted); font-size: 12px; text-transform: uppercase; font-weight: 700;">Pilotos Oficiales</div>
                    <div style="font-size: 20px; font-weight: 800; font-family: var(--font-display); color: #ffffff;">${this.drivers.length} Pilotos</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Con apodos registrados</div>
                </div>
                <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <div style="color: var(--text-muted); font-size: 12px; text-transform: uppercase; font-weight: 700;">Fechas Disputadas</div>
                    <div style="font-size: 20px; font-weight: 800; font-family: var(--font-display); color: #ffffff;">${this.races.length} Carreras</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Kartódromo de Zárate</div>
                </div>
            </div>

            <!-- Lista de Pilotos Editables -->
            <div class="racing-card">
                <div class="card-header">
                    <div class="card-title">🏎️ Gestión de Pilotos y Apodos</div>
                    <button class="btn-secondary" onclick="App.openNewDriverModal()">+ Agregar Piloto</button>
                </div>
                <div class="table-responsive">
                    <table class="f1-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Apodo</th>
                                <th>Nombre Completo</th>
                                <th>Escudería</th>
                                <th>Puntos</th>
                                <th style="text-align: right;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.drivers.map(d => {
                                const team = this.teams.find(t => t.id === d.team_id);
                                return `
                                    <tr>
                                        <td style="font-family: var(--font-mono); font-weight: 800;">#${d.number || '-'}</td>
                                        <td style="font-family: var(--font-display); font-weight: 900; font-size: 16px; color: #ffffff;">${d.nickname}</td>
                                        <td>${d.first_name} ${d.last_name || ''}</td>
                                        <td>
                                            ${team ? `<span style="color: ${team.color_primary}; font-weight: 700;">${team.name}</span>` : '<span style="color: var(--text-muted);">Sin equipo</span>'}
                                        </td>
                                        <td style="font-family: var(--font-mono); font-weight: 800;">${d.points || 0}</td>
                                        <td style="text-align: right;">
                                            <button class="btn-secondary" onclick="App.openEditDriverModal('${d.id}')" style="padding: 4px 8px;">✏️ Editar</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Opciones Avanzadas / Base de Datos -->
            <div class="racing-card" style="margin-top: 24px; border-color: rgba(225, 6, 0, 0.3);">
                <div class="card-header">
                    <div class="card-title">💾 Copia de Seguridad & Mantenimiento</div>
                </div>
                <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                    Puedes descargar una copia de seguridad en JSON de todos tus torneos, escuderías y resultados, o restaurar la base de datos al estado inicial de la Fecha 8 de la Copa Pistón.
                </p>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <button class="btn-secondary" onclick="App.downloadBackup()">
                        📥 Descargar Copia de Seguridad JSON
                    </button>
                    <button class="btn-secondary" onclick="document.getElementById('importBackupInput').click()">
                        📤 Restaurar Copia
                    </button>
                    <input type="file" id="importBackupInput" style="display: none;" accept=".json" onchange="App.handleImportBackup(this)">
                    <button class="btn-secondary" style="border-color: #ef4444; color: #f87171;" onclick="App.confirmResetDefaults()">
                        🔄 Reiniciar a Datos Iniciales Oficiales
                    </button>
                </div>
            </div>
        `;
    },

    // --------------------------------------------------------------------------
    // MODALES & EDICIÓN
    // --------------------------------------------------------------------------
    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('active');
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('active');
    },

    openNewDriverModal() {
        document.getElementById('driverModalTitle').textContent = 'Nuevo Piloto';
        document.getElementById('driverIdInput').value = '';
        document.getElementById('driverNickInput').value = '';
        document.getElementById('driverFirstInput').value = '';
        document.getElementById('driverLastInput').value = '';
        document.getElementById('driverNumberInput').value = '';
        document.getElementById('driverPointsInput').value = '0';

        this.populateTeamSelect('driverTeamSelect', '');
        this.openModal('driverModal');
    },

    openEditDriverModal(driverId) {
        const driver = this.drivers.find(d => d.id === driverId);
        if (!driver) return;

        document.getElementById('driverModalTitle').textContent = `Editar Piloto: ${driver.nickname}`;
        document.getElementById('driverIdInput').value = driver.id;
        document.getElementById('driverNickInput').value = driver.nickname || '';
        document.getElementById('driverFirstInput').value = driver.first_name || '';
        document.getElementById('driverLastInput').value = driver.last_name || '';
        document.getElementById('driverNumberInput').value = driver.number || '';
        document.getElementById('driverPointsInput').value = driver.points || 0;

        this.populateTeamSelect('driverTeamSelect', driver.team_id);
        this.openModal('driverModal');
    },

    populateTeamSelect(selectId, selectedTeamId) {
        const sel = document.getElementById(selectId);
        if (!sel) return;
        sel.innerHTML = '<option value="">-- Sin Escudería --</option>' + this.teams.map(t => `
            <option value="${t.id}" ${t.id === selectedTeamId ? 'selected' : ''}>
                ${t.name}
            </option>
        `).join('');
    },

    async saveDriverFromForm() {
        const id = document.getElementById('driverIdInput').value || `drv_${Date.now()}`;
        const nickname = document.getElementById('driverNickInput').value.trim();
        const firstName = document.getElementById('driverFirstInput').value.trim();
        const lastName = document.getElementById('driverLastInput').value.trim();
        const teamId = document.getElementById('driverTeamSelect').value;
        const number = parseInt(document.getElementById('driverNumberInput').value) || 0;
        const points = parseInt(document.getElementById('driverPointsInput').value) || 0;

        if (!nickname || !firstName) {
            this.showToast('El apodo y el nombre son obligatorios', 'error');
            return;
        }

        const driver = {
            id,
            team_id: teamId,
            first_name: firstName,
            last_name: lastName,
            nickname: nickname.toUpperCase(),
            number,
            points
        };

        await DB.saveDriver(driver);
        this.closeModal('driverModal');
        this.showToast(`Piloto ${driver.nickname} guardado con éxito`, 'success');
        await this.renderAll();
    },

    openEditTeamModal(teamId) {
        const team = this.teams.find(t => t.id === teamId);
        if (!team) return;

        document.getElementById('teamIdInput').value = team.id;
        document.getElementById('teamNameInput').value = team.name || '';
        document.getElementById('teamColorPrimary').value = team.color_primary || '#e10600';
        document.getElementById('teamPointsInput').value = team.points || 0;

        this.openModal('teamModal');
    },

    async saveTeamFromForm() {
        const id = document.getElementById('teamIdInput').value;
        const name = document.getElementById('teamNameInput').value.trim();
        const colorPrimary = document.getElementById('teamColorPrimary').value;
        const points = parseInt(document.getElementById('teamPointsInput').value) || 0;

        const team = this.teams.find(t => t.id === id);
        if (team) {
            team.name = name;
            team.color_primary = colorPrimary;
            team.points = points;
            await DB.saveTeam(team);
            this.closeModal('teamModal');
            this.showToast(`Escudería ${team.name} actualizada`, 'success');
            await this.renderAll();
        }
    },

    // --------------------------------------------------------------------------
    // UTILIDADES: TOAST, BACKUP Y RESET
    // --------------------------------------------------------------------------
    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? '🏁' : (type === 'error' ? '⚠️' : 'ℹ️');
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    },

    downloadBackup() {
        const json = DB.exportData();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `karthas_copa_piston_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Copia de seguridad descargada', 'success');
    },

    handleImportBackup(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const ok = DB.importData(e.target.result);
                if (ok) {
                    this.showToast('Copia de seguridad restaurada con éxito', 'success');
                    await this.renderAll();
                } else {
                    this.showToast('El archivo no tiene un formato válido', 'error');
                }
            };
            reader.readAsText(input.files[0]);
        }
    },

    confirmResetDefaults() {
        if (confirm('¿Estás seguro de restablecer todos los datos a la Fecha 8 de la Copa Pistón oficial? Se restaurarán los 79, 66, 57, 53 y 39 puntos.')) {
            DB.resetToDefaults();
        }
    }
};

window.App = App;

// Iniciar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
