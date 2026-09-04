
let valorDias = 15;
let valorAsientos = 45;
let currentLang = 'es';

const multiplicadores = [
    0.6, 0.7, 0.8,
    0.9, 1.0, 1.1,
    1.2, 1.3, 1.4
];

const translations = {
    es: {
        nav_dashboard: 'Dashboard',
        subtitle: 'Deep Reinforcement Learning',
        title: 'Motor de Precios Dinámicos',
        export_btn: 'Exportar Reporte',
        env_params: 'Parámetros del Entorno',
        days_label: 'Días para la salida',
        seats_label: 'Asientos disponibles',
        inf_title: 'Inferencia del Agente PPO',
        multiplier: 'Multiplicador',
        discrete_action: 'Acción Discreta',
        heatmap_title: 'Espacio de Política',
        leg_1_title: 'Acciones 0–2 · 0.6x–0.8x',
        leg_1_desc: 'Descuentos agresivos para estimular la demanda.',
        leg_2_title: 'Acciones 3–5 · 0.9x–1.1x',
        leg_2_desc: 'Tarifa base neutra de equilibrio.',
        leg_3_title: 'Acciones 6–8 · 1.2x–1.4x',
        leg_3_desc: 'Yield management alcista por escasez.'
    },

    en: {
        nav_dashboard: 'Dashboard',
        subtitle: 'Deep Reinforcement Learning',
        title: 'Dynamic Pricing Engine',
        export_btn: 'Export Report',
        env_params: 'Environment Parameters',
        days_label: 'Days to departure',
        seats_label: 'Available seats',
        inf_title: 'PPO Agent Inference',
        multiplier: 'Multiplier',
        discrete_action: 'Discrete Action',
        heatmap_title: 'Policy Space',
        leg_1_title: 'Actions 0–2 · 0.6x–0.8x',
        leg_1_desc: 'Aggressive discounts to stimulate demand.',
        leg_2_title: 'Actions 3–5 · 0.9x–1.1x',
        leg_2_desc: 'Neutral equilibrium base fare.',
        leg_3_title: 'Actions 6–8 · 1.2x–1.4x',
        leg_3_desc: 'Bullish yield management due to scarcity.'
    }
};


/* =========================================================
   LANGUAGE
========================================================= */

function setLang(lang) {
    currentLang = lang;

    const btnES = document.getElementById('btnES');
    const btnEN = document.getElementById('btnEN');

    const activeClass =
        'bg-white text-slate-900 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-all';

    const inactiveClass =
        'text-slate-400 hover:text-slate-900 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all';

    if (btnES) {
        btnES.className = lang === 'es'
            ? activeClass
            : inactiveClass;
    }

    if (btnEN) {
        btnEN.className = lang === 'en'
            ? activeClass
            : inactiveClass;
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');

        if (
            translations[lang] &&
            translations[lang][key]
        ) {
            element.innerText = translations[lang][key];
        }
    });

    ejecutarModeloIA();
    renderizarGrafica();
}


/* =========================================================
   ENVIRONMENT VALUES
========================================================= */

function actualizarValores(dias, asientos) {

    valorDias = parseInt(dias, 10);
    valorAsientos = parseInt(asientos, 10);

    const sliderD = document.getElementById('sliderDias');
    const txtD = document.getElementById('txtDias');

    const sliderA = document.getElementById('sliderAsientos');
    const txtA = document.getElementById('txtAsientos');

    if (sliderD) {
        sliderD.value = valorDias;
    }

    if (txtD) {
        txtD.innerText =
            `${valorDias}${currentLang === 'es' ? ' d' : ' d'}`;
    }

    if (sliderA) {
        sliderA.value = valorAsientos;
    }

    if (txtA) {
        txtA.innerText =
            `${valorAsientos}${currentLang === 'es' ? ' pl' : ' seats'}`;
    }

    ejecutarModeloIA();
    renderizarGrafica();
}


/* =========================================================
   PPO MODEL
========================================================= */

function obtenerAccionPPO(dias, asientos) {

    const clave = `${dias}_${asientos}`;

    if (
        typeof CEREBRO_IA !== 'undefined' &&
        CEREBRO_IA[clave] !== undefined
    ) {
        return CEREBRO_IA[clave];
    }

    // Fallback: neutral action
    return 4;
}


function obtenerMultiplicador(accion) {

    if (
        accion >= 0 &&
        accion < multiplicadores.length
    ) {
        return multiplicadores[accion];
    }

    return 1.0;
}


/* =========================================================
   AGENT INFERENCE
========================================================= */

function ejecutarModeloIA() {

    const accion =
        obtenerAccionPPO(
            valorDias,
            valorAsientos
        );

    const multi =
        obtenerMultiplicador(accion);

    const pct =
        Math.round((multi - 1) * 100);

    const elMulti =
        document.getElementById('precioMultiplicador');

    const elAccion =
        document.getElementById('accionAgente');

    const elPct =
        document.getElementById('ajustePorcentaje');

    const elDesc =
        document.getElementById('textoExplicativoAccion');


    if (elMulti) {
        elMulti.innerText =
            `${multi.toFixed(1)}x`;
    }

    if (elAccion) {
        elAccion.innerText =
            accion;
    }

    if (elPct) {

        elPct.innerText =
            `${pct > 0 ? '+' : ''}${pct}%`;

        // Color semantic
        if (pct > 0) {
            elPct.className =
                'px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-400/20 text-amber-300 text-[10px] font-bold font-mono';
        } else if (pct < 0) {
            elPct.className =
                'px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[10px] font-bold font-mono';
        } else {
            elPct.className =
                'px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold font-mono';
        }
    }


    let desc = '';

    if (currentLang === 'es') {

        if (accion <= 2) {

            desc =
                'Descuento estratégico activado por alta antelación y baja ocupación.';

        } else if (accion <= 5) {

            desc =
                'Tarifa base estable en zona de equilibrio del mercado.';

        } else {

            desc =
                'Yield management alcista por escasez crítica de plazas.';
        }

    } else {

        if (accion <= 2) {

            desc =
                'Strategic discount activated due to early horizon and low occupancy.';

        } else if (accion <= 5) {

            desc =
                'Stable base fare in market equilibrium zone.';

        } else {

            desc =
                'Bullish yield management due to critical seat scarcity.';
        }
    }

    if (elDesc) {
        elDesc.innerText = desc;
    }
}


/* =========================================================
   REPORT
========================================================= */

function descargarReporte() {

    const accion =
        obtenerAccionPPO(
            valorDias,
            valorAsientos
        );

    const multi =
        obtenerMultiplicador(accion);

    const pct =
        Math.round((multi - 1) * 100);

    const fecha =
        new Date().toLocaleString();

    const descElem =
        document.getElementById(
            'textoExplicativoAccion'
        );

    const descText =
        descElem
            ? descElem.innerText
            : '';


    let contenido = '';


    if (currentLang === 'es') {

        contenido +=
            '============================================================\n';

        contenido +=
            '          INFORME DE INFERENCIA — RENFE TFM\n';

        contenido +=
            '============================================================\n\n';

        contenido +=
            `Fecha de generación: ${fecha}\n`;

        contenido +=
            'Modelo: Deep Reinforcement Learning (PPO)\n\n';

        contenido +=
            'PARÁMETROS DEL ENTORNO\n';

        contenido +=
            '------------------------------------------------------------\n';

        contenido +=
            `Días para la salida: ${valorDias} días\n`;

        contenido +=
            `Asientos disponibles: ${valorAsientos} plazas\n\n`;

        contenido +=
            'RESULTADO DEL AGENTE\n';

        contenido +=
            '------------------------------------------------------------\n';

        contenido +=
            `Acción Discreta PPO: ${accion}\n`;

        contenido +=
            `Multiplicador de Tarifa: ${multi.toFixed(1)}x (${pct > 0 ? '+' : ''}${pct}%)\n`;

        contenido +=
            `Diagnóstico: ${descText}\n\n`;

        contenido +=
            '============================================================\n';

    } else {

        contenido +=
            '============================================================\n';

        contenido +=
            '             PPO INFERENCE REPORT — RENFE TFM\n';

        contenido +=
            '============================================================\n\n';

        contenido +=
            `Generation Date: ${fecha}\n`;

        contenido +=
            'Model: Deep Reinforcement Learning (PPO)\n\n';

        contenido +=
            'ENVIRONMENT PARAMETERS\n';

        contenido +=
            '------------------------------------------------------------\n';

        contenido +=
            `Days to departure: ${valorDias} days\n`;

        contenido +=
            `Available seats: ${valorAsientos} seats\n\n`;

        contenido +=
            'AGENT OUTPUT\n';

        contenido +=
            '------------------------------------------------------------\n';

        contenido +=
            `PPO Discrete Action: ${accion}\n`;

        contenido +=
            `Fare Multiplier: ${multi.toFixed(1)}x (${pct > 0 ? '+' : ''}${pct}%)\n`;

        contenido +=
            `Diagnostic: ${descText}\n\n`;

        contenido +=
            '============================================================\n';
    }


    const blob =
        new Blob(
            [contenido],
            {
                type: 'text/plain;charset=utf-8'
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement('a');

    a.href = url;

    a.download =
        `Informe_Renfe_PPO_${valorDias}d_${valorAsientos}s.txt`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}


/* =========================================================
   POLICY HEATMAP
========================================================= */

function renderizarGrafica() {

    const contenedor =
        document.getElementById('graficaIA');

    if (!contenedor) {
        return;
    }


    /* X axis: days */
    const xDias =
        Array.from(
            { length: 31 },
            (_, i) => i
        );


    /* Y axis: seats */
    const yAsientos =
        Array.from(
            { length: 101 },
            (_, i) => i
        );


    /* Policy matrix */
    const zAcciones =
        yAsientos.map(asientos => {

            return xDias.map(dias => {

                return obtenerAccionPPO(
                    dias,
                    asientos
                );

            });

        });


    /*
        Tech light palette:

        0–2  → blue
        3–5  → neutral
        6–8  → amber
    */

    const heatmapColors = [
        [0.00, '#dbeafe'],
        [0.125, '#bfdbfe'],
        [0.25, '#93c5fd'],
        [0.375, '#60a5fa'],

        [0.50, '#cbd5e1'],

        [0.625, '#fcd34d'],
        [0.75, '#fbbf24'],
        [0.875, '#f59e0b'],
        [1.00, '#d97706']
    ];


    const data = [

        {
            z: zAcciones,

            x: xDias,

            y: yAsientos,

            type: 'heatmap',

            zmin: 0,

            zmax: 8,

            colorscale: heatmapColors,

            showscale: true,

            hoverongaps: false,

            hovertemplate:
                `<b>${currentLang === 'es' ? 'Días' : 'Days'}:</b> %{x}` +
                `<br><b>${currentLang === 'es' ? 'Plazas' : 'Seats'}:</b> %{y}` +
                `<br><b>Action:</b> %{z}` +
                '<extra></extra>',

            colorbar: {
                thickness: 8,
                len: 0.82,

                outlinewidth: 0,

                tickmode: 'array',

                tickvals: [
                    0, 1, 2,
                    3, 4, 5,
                    6, 7, 8
                ],

                ticktext: [
                    '0',
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8'
                ],

                tickfont: {
                    family: 'Inter',
                    size: 9,
                    color: '#94a3b8'
                }
            }
        },


        /* Current state marker */
        {
            x: [valorDias],

            y: [valorAsientos],

            mode: 'markers',

            type: 'scatter',

            name: 'Current State',

            marker: {
                color: '#0f172a',

                size: 13,

                symbol: 'circle',

                line: {
                    color: '#ffffff',
                    width: 3
                }
            },

            hovertemplate:
                `<b>${currentLang === 'es' ? 'Estado actual' : 'Current state'}</b>` +
                `<br>${currentLang === 'es' ? 'Días' : 'Days'}: ${valorDias}` +
                `<br>${currentLang === 'es' ? 'Plazas' : 'Seats'}: ${valorAsientos}` +
                '<extra></extra>'
        }

    ];


    const layout = {

        autosize: true,

        margin: {
            t: 10,
            l: 52,
            r: 60,
            b: 48
        },


        xaxis: {

            title: {
                text:
                    currentLang === 'es'
                        ? 'Días hasta salida'
                        : 'Days to departure',

                font: {
                    family: 'Inter',
                    size: 10,
                    color: '#64748b'
                }
            },

            tickfont: {
                family: 'JetBrains Mono',
                size: 9,
                color: '#94a3b8'
            },

            gridcolor: 'rgba(148, 163, 184, 0.10)',

            zeroline: false,

            fixedrange: true
        },


        yaxis: {

            title: {
                text:
                    currentLang === 'es'
                        ? 'Plazas disponibles'
                        : 'Available seats',

                font: {
                    family: 'Inter',
                    size: 10,
                    color: '#64748b'
                }
            },

            tickfont: {
                family: 'JetBrains Mono',
                size: 9,
                color: '#94a3b8'
            },

            gridcolor: 'rgba(148, 163, 184, 0.10)',

            zeroline: false,

            fixedrange: true
        },


        paper_bgcolor:
            'rgba(0,0,0,0)',

        plot_bgcolor:
            'rgba(0,0,0,0)',

        showlegend:
            false,


        hoverlabel: {

            bgcolor: '#0f172a',

            bordercolor: '#1e293b',

            font: {
                family: 'Inter',
                size: 10,
                color: '#ffffff'
            }
        }
    };


    const config = {

        responsive: true,

        displayModeBar: false,

        scrollZoom: false,

        doubleClick: false
    };


    Plotly.react(
        contenedor,
        data,
        layout,
        config
    );
}


/* =========================================================
   INITIALIZATION
========================================================= */

window.onload = function () {

    const sliderD =
        document.getElementById(
            'sliderDias'
        );

    const sliderA =
        document.getElementById(
            'sliderAsientos'
        );


    if (sliderD) {

        sliderD.addEventListener(
            'input',
            event => {

                actualizarValores(
                    event.target.value,
                    valorAsientos
                );

            }
        );
    }


    if (sliderA) {

        sliderA.addEventListener(
            'input',
            event => {

                actualizarValores(
                    valorDias,
                    event.target.value
                );

            }
        );
    }


    setLang('es');

    actualizarValores(
        15,
        45
    );

    renderizarGrafica();
};