// ==============================================================================
// Kart-HS - Datos Semilla Oficiales (Copa Pistón 2025 - Fecha 8 & 9)
// ==============================================================================

const SEED_DATA = {
    tournament: {
        id: 'tour_copa_piston_2025',
        name: 'Copa Pistón',
        season: 'Temporada 2025',
        year: 2025,
        current_round: 8,
        is_active: 1,
        created_at: '2025-03-01T10:00:00Z'
    },
    teams: [
        {
            id: 'team_haas',
            tournament_id: 'tour_copa_piston_2025',
            name: 'HAAS',
            short_name: 'HAA',
            color_primary: '#E6002B',
            color_secondary: '#FFFFFF',
            color_accent: '#141414',
            logo_icon: 'haas',
            points: 79
        },
        {
            id: 'team_redbull',
            tournament_id: 'tour_copa_piston_2025',
            name: 'Red Bull Racing',
            short_name: 'RBR',
            color_primary: '#1E41FF',
            color_secondary: '#F50538',
            color_accent: '#FFC900',
            logo_icon: 'redbull',
            points: 66
        },
        {
            id: 'team_mclaren',
            tournament_id: 'tour_copa_piston_2025',
            name: 'McLaren',
            short_name: 'MCL',
            color_primary: '#FF8000',
            color_secondary: '#000000',
            color_accent: '#47C7FC',
            logo_icon: 'mclaren',
            points: 57
        },
        {
            id: 'team_alpine',
            tournament_id: 'tour_copa_piston_2025',
            name: 'Alpine',
            short_name: 'ALP',
            color_primary: '#0090FF',
            color_secondary: '#FD4BC7',
            color_accent: '#111827',
            logo_icon: 'alpine',
            points: 53
        },
        {
            id: 'team_audi',
            tournament_id: 'tour_copa_piston_2025',
            name: 'Audi Sport',
            short_name: 'AUD',
            color_primary: '#E21A22',
            color_secondary: '#C0C0C0',
            color_accent: '#111111',
            logo_icon: 'audi',
            points: 39
        }
    ],
    drivers: [
        // HAAS (79 pts) -> DEMON (Adrián) + PUCHO (Luciano)
        {
            id: 'drv_demon',
            team_id: 'team_haas',
            first_name: 'Adrián',
            last_name: '',
            nickname: 'DEMON',
            avatar_color: '#E6002B',
            points: 44,
            wins: 4,
            podiums: 7,
            fastest_laps: 3
        },
        {
            id: 'drv_pucho',
            team_id: 'team_haas',
            first_name: 'Luciano',
            last_name: '',
            nickname: 'PUCHO',
            avatar_color: '#FFFFFF',
            points: 35,
            wins: 2,
            podiums: 5,
            fastest_laps: 1
        },

        // Red Bull Racing (66 pts) -> MECA (Braian) + JOEL (Darío)
        {
            id: 'drv_meca',
            team_id: 'team_redbull',
            first_name: 'Braian',
            last_name: '',
            nickname: 'MECA',
            avatar_color: '#1E41FF',
            points: 36,
            wins: 2,
            podiums: 5,
            fastest_laps: 2
        },
        {
            id: 'drv_joel',
            team_id: 'team_redbull',
            first_name: 'Darío',
            last_name: '',
            nickname: 'JOEL',
            avatar_color: '#FFC900',
            points: 30,
            wins: 1,
            podiums: 4,
            fastest_laps: 1
        },

        // McLaren (57 pts) -> NAHUE (Nahuel) + LUQUITAS (Lucas)
        {
            id: 'drv_nahue',
            team_id: 'team_mclaren',
            first_name: 'Nahuel',
            last_name: '',
            nickname: 'NAHUE',
            avatar_color: '#FF8000',
            points: 31,
            wins: 1,
            podiums: 4,
            fastest_laps: 1
        },
        {
            id: 'drv_luquitas',
            team_id: 'team_mclaren',
            first_name: 'Lucas',
            last_name: '',
            nickname: 'LUQUITAS',
            avatar_color: '#47C7FC',
            points: 26,
            wins: 0,
            podiums: 3,
            fastest_laps: 0
        },

        // Alpine (53 pts) -> SALTA (Mauro) + RAMA (Ramiro)
        {
            id: 'drv_salta',
            team_id: 'team_alpine',
            first_name: 'Mauro',
            last_name: '',
            nickname: 'SALTA',
            avatar_color: '#0090FF',
            points: 28,
            wins: 1,
            podiums: 3,
            fastest_laps: 1
        },
        {
            id: 'drv_rama',
            team_id: 'team_alpine',
            first_name: 'Ramiro',
            last_name: '',
            nickname: 'RAMA',
            avatar_color: '#FD4BC7',
            points: 25,
            wins: 0,
            podiums: 2,
            fastest_laps: 0
        },

        // Audi Sport (39 pts) -> FEDE (Federico) + EZE (Emanuel)
        {
            id: 'drv_fede',
            team_id: 'team_audi',
            first_name: 'Federico',
            last_name: '',
            nickname: 'FEDE',
            avatar_color: '#E21A22',
            points: 21,
            wins: 0,
            podiums: 2,
            fastest_laps: 0
        },
        {
            id: 'drv_eze',
            team_id: 'team_audi',
            first_name: 'Emanuel',
            last_name: '',
            nickname: 'EZE',
            avatar_color: '#C0C0C0',
            points: 18,
            wins: 0,
            podiums: 1,
            fastest_laps: 0
        }
    ],
    races: [
        {
            id: 'race_1',
            tournament_id: 'tour_copa_piston_2025',
            round_number: 1,
            name: 'Fecha 1',
            track_name: 'Kartódromo Internacional de Zárate',
            circuit_length_km: 0.600,
            race_date: '2025-03-15',
            status: 'completed'
        },
        {
            id: 'race_2',
            tournament_id: 'tour_copa_piston_2025',
            round_number: 2,
            name: 'Fecha 2',
            track_name: 'Kartódromo Internacional de Zárate',
            circuit_length_km: 0.600,
            race_date: '2025-04-12',
            status: 'completed'
        },
        {
            id: 'race_3',
            tournament_id: 'tour_copa_piston_2025',
            round_number: 3,
            name: 'Fecha 3',
            track_name: 'Kartódromo Internacional de Zárate',
            circuit_length_km: 0.600,
            race_date: '2025-05-10',
            status: 'completed'
        },
        {
            id: 'race_4',
            tournament_id: 'tour_copa_piston_2025',
            round_number: 4,
            name: 'Fecha 4',
            track_name: 'Kartódromo Internacional de Zárate',
            circuit_length_km: 0.600,
            race_date: '2025-06-07',
            status: 'completed'
        },
        {
            id: 'race_5',
            tournament_id: 'tour_copa_piston_2025',
            round_number: 5,
            name: 'Fecha 5',
            track_name: 'Kartódromo Internacional de Zárate',
            circuit_length_km: 0.600,
            race_date: '2025-07-05',
            status: 'completed'
        },
        {
            id: 'race_6',
            tournament_id: 'tour_copa_piston_2025',
            round_number: 6,
            name: 'Fecha 6',
            track_name: 'Kartódromo Internacional de Zárate',
            circuit_length_km: 0.600,
            race_date: '2025-08-02',
            status: 'completed'
        },
        {
            id: 'race_7',
            tournament_id: 'tour_copa_piston_2025',
            round_number: 7,
            name: 'Fecha 7',
            track_name: 'Kartódromo Internacional de Zárate',
            circuit_length_km: 0.600,
            race_date: '2025-08-23',
            status: 'completed'
        },
        {
            id: 'race_8',
            tournament_id: 'tour_copa_piston_2025',
            round_number: 8,
            name: 'Fecha 8 (Cierre Inicial)',
            track_name: 'Kartódromo Internacional de Zárate',
            circuit_length_km: 0.600,
            race_date: '2025-09-06',
            status: 'completed'
        },
        {
            id: 'race_9',
            tournament_id: 'tour_copa_piston_2025',
            round_number: 9,
            name: 'Fecha 9 - Zárate (Hoja MyLaps)',
            track_name: 'Kartódromo Internacional de Zárate',
            circuit_length_km: 0.600,
            race_date: '2026-08-29',
            status: 'completed'
        }
    ],
    race_results: {
        'race_9': [
            { id: 'res_9_1', driver_id: 'drv_meca', kart_number: 17, position: 1, laps: 15, gap: '-', total_time: '8:34.594', best_lap_time: '35.712', is_fastest_lap: 1, points: 9 },
            { id: 'res_9_2', driver_id: 'drv_nahue', kart_number: 7, position: 2, laps: 15, gap: '+8.883', total_time: '8:43.477', best_lap_time: '36.416', is_fastest_lap: 0, points: 7 },
            { id: 'res_9_3', driver_id: 'drv_rama', kart_number: 50, position: 3, laps: 15, gap: '+24.243', total_time: '8:58.837', best_lap_time: '37.375', is_fastest_lap: 0, points: 6 },
            { id: 'res_9_4', driver_id: 'drv_salta', kart_number: 9, position: 4, laps: 15, gap: '+24.751', total_time: '8:59.345', best_lap_time: '37.300', is_fastest_lap: 0, points: 5 },
            { id: 'res_9_5', driver_id: 'drv_pucho', kart_number: 46, position: 5, laps: 14, gap: '1 Vuelta', total_time: '8:47.271', best_lap_time: '38.559', is_fastest_lap: 0, points: 4 },
            { id: 'res_9_6', driver_id: 'drv_demon', kart_number: 5, position: 6, laps: 14, gap: '1 Vuelta', total_time: '8:47.592', best_lap_time: '39.064', is_fastest_lap: 0, points: 3 },
            { id: 'res_9_7', driver_id: 'drv_eze', kart_number: 49, position: 7, laps: 14, gap: '1 Vuelta', total_time: '8:49.110', best_lap_time: '39.071', is_fastest_lap: 0, points: 2 },
            { id: 'res_9_8', driver_id: 'drv_joel', kart_number: 19, position: 8, laps: 14, gap: '1 Vuelta', total_time: '8:58.361', best_lap_time: '39.214', is_fastest_lap: 0, points: 1 },
            { id: 'res_9_9', driver_id: 'drv_fede', kart_number: 15, position: 9, laps: 14, gap: '1 Vuelta', total_time: '8:59.032', best_lap_time: '38.820', is_fastest_lap: 0, points: 0 },
            { id: 'res_9_10', driver_id: 'drv_luquitas', kart_number: 6, position: 10, laps: 14, gap: '1 Vuelta', total_time: '9:05.944', best_lap_time: '38.752', is_fastest_lap: 0, points: 0 }
        ]
    }
};

window.SEED_DATA = SEED_DATA;
