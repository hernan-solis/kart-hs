-- ==============================================================================
-- KartHAS - Datos Iniciales de Prueba: Copa Pistón 2025 (Fecha 8 Completada)
-- ==============================================================================

-- 1. Torneo Oficial
INSERT INTO tournaments (id, name, season, year, current_round, is_active) VALUES
('tour_copa_piston_2025', 'Copa Pistón', 'Temporada 2025', 2025, 8, 1);

-- 2. Escuderías (5 Equipos con parejas de pilotos - Puntos a Fecha 8)
INSERT INTO teams (id, tournament_id, name, short_name, color_primary, color_secondary, color_accent, logo_icon, points) VALUES
('team_haas', 'tour_copa_piston_2025', 'HAAS', 'HAA', '#E6002B', '#FFFFFF', '#141414', 'haas', 79),
('team_redbull', 'tour_copa_piston_2025', 'Red Bull Racing', 'RBR', '#1E41FF', '#F50538', '#FFC900', 'redbull', 66),
('team_mclaren', 'tour_copa_piston_2025', 'McLaren', 'MCL', '#FF8000', '#000000', '#47C7FC', 'mclaren', 57),
('team_alpine', 'tour_copa_piston_2025', 'Alpine', 'ALP', '#0090FF', '#FD4BC7', '#111827', 'alpine', 53),
('team_audi', 'tour_copa_piston_2025', 'Audi Sport', 'AUD', '#E21A22', '#C0C0C0', '#111111', 'audi', 39);

-- 3. Pilotos (Nombre, Apellido, Apodo y Puntos a Fecha 8)
INSERT INTO drivers (id, team_id, first_name, last_name, nickname, number, avatar_color, points) VALUES
-- Haas (79 pts)
('drv_demon', 'team_haas', 'Braian', 'Demon', 'DEMON', 17, '#E6002B', 44),
('drv_pucho', 'team_haas', 'Lucas', 'Pucho', 'PUCHO', 6, '#FFFFFF', 35),

-- Red Bull (66 pts)
('drv_meca', 'team_redbull', 'Darío', 'Meca', 'MECA', 19, '#1E41FF', 36),
('drv_joel', 'team_redbull', 'Mauro', 'Joel', 'JOEL', 9, '#FFC900', 30),

-- McLaren (57 pts)
('drv_nahue', 'team_mclaren', 'Nahuel', 'Gómez', 'NAHUE', 7, '#FF8000', 31),
('drv_luquitas', 'team_mclaren', 'Luciano', 'Luquitas', 'LUQUITAS', 46, '#47C7FC', 26),

-- Alpine (53 pts)
('drv_salta', 'team_alpine', 'Adrián', 'Salta', 'SALTA', 5, '#0090FF', 28),
('drv_rama', 'team_alpine', 'Ramiro', 'Rama', 'RAMA', 50, '#FD4BC7', 25),

-- Audi (39 pts)
('drv_fede', 'team_audi', 'Federico', 'Fede', 'FEDE', 15, '#E21A22', 21),
('drv_eze', 'team_audi', 'Emanuel', 'Eze', 'EZE', 49, '#C0C0C0', 18);

-- 4. Fechas (Historial de Fechas 1 a 8)
INSERT INTO races (id, tournament_id, round_number, name, track_name, circuit_length_km, race_date, status) VALUES
('race_1', 'tour_copa_piston_2025', 1, 'Fecha 1', 'Kartódromo Internacional de Zárate', 0.600, '2025-03-15', 'completed'),
('race_2', 'tour_copa_piston_2025', 2, 'Fecha 2', 'Kartódromo Internacional de Zárate', 0.600, '2025-04-12', 'completed'),
('race_3', 'tour_copa_piston_2025', 3, 'Fecha 3', 'Kartódromo Internacional de Zárate', 0.600, '2025-05-10', 'completed'),
('race_4', 'tour_copa_piston_2025', 4, 'Fecha 4', 'Kartódromo Internacional de Zárate', 0.600, '2025-06-07', 'completed'),
('race_5', 'tour_copa_piston_2025', 5, 'Fecha 5', 'Kartódromo Internacional de Zárate', 0.600, '2025-07-05', 'completed'),
('race_6', 'tour_copa_piston_2025', 6, 'Fecha 6', 'Kartódromo Internacional de Zárate', 0.600, '2025-08-02', 'completed'),
('race_7', 'tour_copa_piston_2025', 7, 'Fecha 7', 'Kartódromo Internacional de Zárate', 0.600, '2025-08-23', 'completed'),
('race_8', 'tour_copa_piston_2025', 8, 'Fecha 8', 'Kartódromo Internacional de Zárate', 0.600, '2025-09-06', 'completed'),
('race_9', 'tour_copa_piston_2025', 9, 'Fecha 9 - Zárate (Planilla)', 'Kartódromo de Zárate (Alquiler)', 0.600, '2026-08-29', 'completed');

-- 5. Resultados de la Carrera 9 (Hoja escaneada oficial de Zárate)
INSERT INTO race_results (id, race_id, driver_id, kart_number, position, laps, gap, total_time, best_lap_time, is_fastest_lap, points) VALUES
('res_9_1', 'race_9', 'drv_demon', 17, 1, 15, '-', '8:34.594', '35.712', 1, 9),
('res_9_2', 'race_9', 'drv_nahue', 7, 2, 15, '+8.883', '8:43.477', '36.416', 0, 7),
('res_9_3', 'race_9', 'drv_rama', 50, 3, 15, '+24.243', '8:58.837', '37.375', 0, 6),
('res_9_4', 'race_9', 'drv_joel', 9, 4, 15, '+24.751', '8:59.345', '37.300', 0, 5),
('res_9_5', 'race_9', 'drv_luquitas', 46, 5, 14, '1 Vuelta', '8:47.271', '38.559', 0, 4),
('res_9_6', 'race_9', 'drv_salta', 5, 6, 14, '1 Vuelta', '8:47.592', '39.064', 0, 3),
('res_9_7', 'race_9', 'drv_eze', 49, 7, 14, '1 Vuelta', '8:49.110', '39.071', 0, 2),
('res_9_8', 'race_9', 'drv_meca', 19, 8, 14, '1 Vuelta', '8:58.361', '39.214', 0, 1),
('res_9_9', 'race_9', 'drv_fede', 15, 9, 14, '1 Vuelta', '8:59.032', '38.820', 0, 0),
('res_9_10', 'race_9', 'drv_pucho', 6, 10, 14, '1 Vuelta', '9:05.944', '38.752', 0, 0);

-- 6. Configuración General
INSERT INTO app_settings (key, value) VALUES
('active_tournament_id', 'tour_copa_piston_2025'),
('admin_user', 'admin'),
('admin_pass', 'admin'),
('points_system', '{"1":8,"2":7,"3":6,"4":5,"5":4,"6":3,"7":2,"8":1,"9":0,"10":0,"fastest_lap":1}');
