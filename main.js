
let valorDias = 15;
let valorAsientos = 50;
let currentLang = 'es';

const multiplicadores = [
    0.6, 0.7, 0.8,
    0.9, 1.0, 1.1,
    1.2, 1.3, 1.4
];

const translations = {

    es: {
        header_subtitle: 'Motor de precios dinámicos',
        online: 'Modelo activo',
        export_btn: 'Exportar',

        input: 'Entrada',
        env_params: 'Parámetros del entorno',

        days_label: 'Días para la salida',
        seats_label: 'Plazas disponibles',

        state: 'Estado',
        ready: 'Listo',

        decision: 'Decisión',
        inf_title: 'Inferencia del agente PPO',

        multiplier: 'Multiplicador',
        discrete_action: 'Acción',

        diagnosis: 'Diagnóstico',
        algorithm: 'Algoritmo',

        visualization: 'Visualización',
        heatmap_title: 'Espacio de política',

        current: 'Estado actual',

        low: 'Descuento',
        neutral: 'Tarifa base',
        high: 'Incremento',

        days_axis: 'Días hasta salida',
        seats_axis: 'Plazas disponibles',
        action: 'Acción'
    },


    en: {
        header_subtitle: 'Dynamic pricing engine',
        online: 'Model active',
        export_btn: 'Export',

        input: 'Input',
        env_params: 'Environment parameters',

        days_label: 'Days to departure',
        seats_label: 'Available seats',

        state: 'Status',
        ready: 'Ready',

        decision: 'Decision',
        inf_title: 'PPO agent inference',

        multiplier: 'Multiplier',
        discrete_action: 'Action',

        diagnosis: 'Diagnosis',
        algorithm: 'Algorithm',

        visualization: 'Visualization',
        heatmap_title: 'Policy space',

        current: 'Current state',

        low: 'Discount',
        neutral: 'Base fare',
        high: 'Increase',

        days_axis: 'Days to departure',
        seats_axis: 'Available seats',
        action: 'Action'
    }

};


/* =========================================================
   TRANSLATION HELPER
========================================================= */

function t(key) {

    return translations[currentLang][key] || key;

}


/* =========================================================
   LANGUAGE
========================================================= */

function setLang(lang) {

    currentLang = lang;

    const btnES = document.getElementById('btnES');
    const btnEN = document.getElementById('btnEN');

    const active =
        'px-2.5 py-1 rounded-md text-[9px] font-bold bg-white shadow-sm';

    const inactive =
        'px-2.5 py-1 rounded-md text-[9px] font-bold text-slate-400';


    if (btnES) {

        btnES.className =
            lang === 'es'
                ? active
                : inactive;

    }


    if (btnEN) {

        btnEN.className =
            lang === 'en'
                ? active
                : inactive;

    }


    document.documentElement.lang = lang;


    document
        .querySelectorAll('[data-i18n]')
        .forEach(element => {

            const key =
                element.dataset.i18n;

            if (
                translations[lang] &&
                translations[lang][key]
            ) {

                element.textContent =
                    translations[lang][key];

            }

        });


    actualizarEtiquetas();

    ejecutarModeloIA();

    renderizarGrafica();

}


/* =========================================================
   VALUES
========================================================= */

function actualizarEtiquetas() {

    const txtD =
        document.getElementById('txtDias');

    const txtA =
        document.getElementById('txtAsientos');


    if (txtD) {

        txtD.textContent =
            `${valorDias} d`;

    }


    if (txtA) {

        txtA.textContent =
            `${valorAsientos} ${
                currentLang === 'es'
                    ? 'pl'
                    : 'seats'
            }`;

    }

}


/* =========================================================
   ENVIRONMENT
========================================================= */

function actualizarValores(dias, asientos) {

    valorDias =
        parseInt(dias, 10);

    valorAsientos =
        parseInt(asientos, 10);


    const sliderD =
        document.getElementById(
            'sliderDias'
        );

    const sliderA =
        document.getElementById(
            'sliderAsientos'
        );


    if (sliderD) {

        sliderD.value =
            valorDias;

    }


    if (sliderA) {

        sliderA.value =
            valorAsientos;

    }


    actualizarEtiquetas();

    ejecutarModeloIA();

    renderizarGrafica();

}


/* =========================================================
   PPO
========================================================= */

function obtenerAccionPPO(
    dias,
    asientos
) {

    const clave =
        `${dias}_${asientos}`;


    if (
        typeof CEREBRO_IA !== 'undefined' &&
        CEREBRO_IA[clave] !== undefined
    ) {

        return CEREBRO_IA[clave];

    }


    return 4;

}


/* =========================================================
   MULTIPLIER
========================================================= */

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
   DIAGNOSIS
========================================================= */

function obtenerDiagnostico(accion) {

    if (currentLang === 'es') {

        if (accion <= 2) {

            return 'Descuento estratégico por alta antelación y baja ocupación.';

        }


        if (accion <= 5) {

            return 'Tarifa base estable en zona de equilibrio del mercado.';

        }


        return 'Incremento de tarifa por escasez de plazas.';

    }


    if (accion <= 2) {

        return 'Strategic discount due to early departure and low occupancy.';

    }


    if (accion <= 5) {

        return 'Stable base fare in the market equilibrium zone.';

    }


    return 'Fare increase driven by seat scarcity.';

}


/* =========================================================
   AGENT
========================================================= */

function ejecutarModeloIA() {

    const accion =
        obtenerAccionPPO(
            valorDias,
            valorAsientos
        );


    const multi =
        obtenerMultiplicador(
            accion
        );


    const pct =
        Math.round(
            (multi - 1) * 100
        );


    const elMulti =
        document.getElementById(
            'precioMultiplicador'
        );

    const elAccion =
        document.getElementById(
            'accionAgente'
        );

    const elPct =
        document.getElementById(
            'ajustePorcentaje'
        );

    const elDesc =
        document.getElementById(
            'textoExplicativoAccion'
        );


    if (elMulti) {

        elMulti.textContent =
            `${multi.toFixed(1)}x`;

    }


    if (elAccion) {

        elAccion.textContent =
            accion;

    }


    if (elDesc) {

        elDesc.textContent =
            obtenerDiagnostico(
                accion
            );

    }


    if (elPct) {

        elPct.textContent =
            `${pct > 0 ? '+' : ''}${pct}%`;


        if (pct > 0) {

            elPct.className =
                'mono text-[10px] font-bold px-2 py-1 rounded-md bg-amber-500/10 text-amber-500';

        } else if (pct < 0) {

            elPct.className =
                'mono text-[10px] font-bold px-2 py-1 rounded-md bg-blue-500/10 text-blue-400';

        } else {

            elPct.className =
                'mono text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 text-slate-300';

        }

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
        obtenerMultiplicador(
            accion
        );


    const pct =
        Math.round(
            (multi - 1) * 100
        );


    const fecha =
        new Date().toLocaleString();


    let contenido;


    if (currentLang === 'es') {

        contenido = [

            'INFORME DE INFERENCIA — RENFE TFM',

            '-----------------------------------',

            `Fecha: ${fecha}`,

            'Modelo: Deep Reinforcement Learning (PPO)',

            '',

            'PARÁMETROS',

            `Días para la salida: ${valorDias}`,

            `Plazas disponibles: ${valorAsientos}`,

            '',

            'RESULTADO',

            `Acción PPO: ${accion}`,

            `Multiplicador: ${multi.toFixed(1)}x (${pct > 0 ? '+' : ''}${pct}%)`,

            `Diagnóstico: ${obtenerDiagnostico(accion)}`

        ].join('\n');


    } else {

        contenido = [

            'PPO INFERENCE REPORT — RENFE TFM',

            '--------------------------------',

            `Date: ${fecha}`,

            'Model: Deep Reinforcement Learning (PPO)',

            '',

            'PARAMETERS',

            `Days to departure: ${valorDias}`,

            `Available seats: ${valorAsientos}`,

            '',

            'RESULT',

            `PPO action: ${accion}`,

            `Multiplier: ${multi.toFixed(1)}x (${pct > 0 ? '+' : ''}${pct}%)`,

            `Diagnosis: ${obtenerDiagnostico(accion)}`

        ].join('\n');

    }


    const blob =
        new Blob(
            [contenido],
            {
                type: 'text/plain;charset=utf-8'
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const a =
        document.createElement(
            'a'
        );


    a.href = url;


    a.download =
        `Renfe_PPO_${valorDias}d_${valorAsientos}pl.txt`;


    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);

}


/* =========================================================
   HEATMAP
========================================================= */

function renderizarGrafica() {

    const contenedor =
        document.getElementById(
            'graficaIA'
        );


    if (
        !contenedor ||
        typeof Plotly === 'undefined'
    ) {

        return;

    }


    const xDias =
        Array.from(
            { length: 31 },
            (_, i) => i
        );


    const yAsientos =
        Array.from(
            { length: 101 },
            (_, i) => i
        );


    const zAcciones =
        yAsientos.map(
            asientos =>

                xDias.map(
                    dias =>

                        obtenerAccionPPO(
                            dias,
                            asientos
                        )

                )
        );


    const data = [

        {
            z: zAcciones,

            x: xDias,

            y: yAsientos,

            type: 'heatmap',

            zmin: 0,

            zmax: 8,

            colorscale: [

                [0.00, '#dbeafe'],

                [0.25, '#60a5fa'],

                [0.50, '#e2e8f0'],

                [0.75, '#fbbf24'],

                [1.00, '#d97706']

            ],

            showscale: false,

            hovertemplate:

                `<b>${t('days_axis')}:</b> %{x}` +

                `<br><b>${t('seats_axis')}:</b> %{y}` +

                `<br><b>${t('action')}:</b> %{z}` +

                '<extra></extra>'
        },


        {
            x: [valorDias],

            y: [valorAsientos],

            mode: 'markers',

            type: 'scatter',

            marker: {

                color: '#0f172a',

                size: 11,

                line: {

                    color: '#ffffff',

                    width: 2.5

                }

            },

            hovertemplate:

                `<b>${t('current')}</b>` +

                `<br>${t('days_axis')}: ${valorDias}` +

                `<br>${t('seats_axis')}: ${valorAsientos}` +

                '<extra></extra>'
        }

    ];


    const layout = {

        autosize: true,

        margin: {

            t: 12,

            r: 12,

            b: 48,

            l: 55

        },


        paper_bgcolor:
            'rgba(0,0,0,0)',

        plot_bgcolor:
            'rgba(0,0,0,0)',


        xaxis: {

            title: {

                text:
                    t('days_axis'),

                font: {

                    family: 'Inter',

                    size: 9,

                    color: '#64748b'

                }

            },

            tickfont: {

                family: 'JetBrains Mono',

                size: 8,

                color: '#94a3b8'

            },

            gridcolor:
                'rgba(148,163,184,.10)',

            zeroline:
                false,

            fixedrange:
                true

        },


        yaxis: {

            title: {

                text:
                    t('seats_axis'),

                font: {

                    family: 'Inter',

                    size: 9,

                    color: '#64748b'

                }

            },

            tickfont: {

                family: 'JetBrains Mono',

                size: 8,

                color: '#94a3b8'

            },

            gridcolor:
                'rgba(148,163,184,.10)',

            zeroline:
                false,

            fixedrange:
                true

        },


        hoverlabel: {

            bgcolor:
                '#0f172a',

            bordercolor:
                '#0f172a',

            font: {

                family:
                    'Inter',

                size:
                    9,

                color:
                    '#ffffff'

            }

        }

    };


    Plotly.react(

        contenedor,

        data,

        layout,

        {

            responsive: true,

            displayModeBar: false,

            scrollZoom: false

        }

    );

}


/* =========================================================
   INITIALIZATION
========================================================= */

window.addEventListener(
    'load',
    () => {

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
            50
        );

    }
);
```
