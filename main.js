// main.js - Inferencia Pura del Proyecto (TFM Renfe)
let valorDias = 15;
let valorAsientos = 50;
let currentLang = 'es';

const translations = {
    'es': {
        'nav_dashboard': 'Dashboard',
        'subtitle': 'Deep Reinforcement Learning',
        'title': 'Motor de Precios Dinámicos',
        'export_btn': 'Exportar Reporte',
        'env_params': 'Parámetros del Entorno',
        'days_label': 'Días para la salida',
        'seats_label': 'Asientos disponibles',
        'inf_title': 'Inferencia del Agente PPO',
        'multiplier': 'Multiplicador',
        'discrete_action': 'Acción Discreta',
        'heatmap_title': 'Espacio de Política (Heatmap)',
        'leg_1_title': 'Acciones 0–2 (0.6x - 0.8x)',
        'leg_1_desc': 'Descuentos agresivos para estimular la demanda.',
        'leg_2_title': 'Acciones 3–5 (0.9x - 1.1x)',
        'leg_2_desc': 'Tarifa base neutra de equilibrio.',
        'leg_3_title': 'Acciones 6–8 (1.2x - 1.4x)',
        'leg_3_desc': 'Yield management alcista por escasez.'
    },
    'en': {
        'nav_dashboard': 'Dashboard',
        'subtitle': 'Deep Reinforcement Learning',
        'title': 'Dynamic Pricing Engine',
        'export_btn': 'Export Report',
        'env_params': 'Environment Parameters',
        'days_label': 'Days to departure',
        'seats_label': 'Available seats',
        'inf_title': 'PPO Agent Inference',
        'multiplier': 'Multiplier',
        'discrete_action': 'Discrete Action',
        'heatmap_title': 'Policy Space (Heatmap)',
        'leg_1_title': 'Actions 0–2 (0.6x - 0.8x)',
        'leg_1_desc': 'Aggressive discounts to stimulate demand.',
        'leg_2_title': 'Actions 3–5 (0.9x - 1.1x)',
        'leg_2_desc': 'Neutral equilibrium base fare.',
        'leg_3_title': 'Actions 6–8 (1.2x - 1.4x)',
        'leg_3_desc': 'Bullish yield management for scarcity.'
    }
};

function setLang(lang) {
    currentLang = lang;
    document.getElementById('btnES').className = lang === 'es' ? 'bg-zinc-900 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all' : 'text-zinc-500 hover:text-zinc-900 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors';
    document.getElementById('btnEN').className = lang === 'en' ? 'bg-zinc-900 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all' : 'text-zinc-500 hover:text-zinc-900 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    ejecutarModeloIA();
    renderizarGrafica();
}

function actualizarValores(d, a) {
    valorDias = parseInt(d);
    valorAsientos = parseInt(a);
    document.getElementById('sliderDias').value = valorDias;
    document.getElementById('txtDias').innerText = valorDias + " d";
    document.getElementById('sliderAsientos').value = valorAsientos;
    document.getElementById('txtAsientos').innerText = valorAsientos + " pl";
    ejecutarModeloIA();
    renderizarGrafica();
}

function obtenerAccionPPO(dias, asientos) {
    const clave = `${dias}_${asientos}`;
    if (typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[clave] !== undefined) {
        return CEREBRO_IA[clave];
    }
    return 4; // Valor por defecto estricto si no existe la clave
}

function ejecutarModeloIA() {
    const accion = obtenerAccionPPO(valorDias, valorAsientos);
    const multi = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4][accion] || 1.0;
    const pct = Math.round((multi - 1) * 100);

    document.getElementById('precioMultiplicador').innerText = multi.toFixed(1) + "x";
    document.getElementById('accionAgente').innerText = accion;
    document.getElementById('ajustePorcentaje').innerText = (pct > 0 ? "+" : "") + pct + "%";

    let desc = "";
    if (currentLang === 'es') {
        if (accion <= 2) desc = "Descuento estratégico activado por alta antelación y baja ocupación.";
        else if (accion <= 5) desc = "Tarifa base estable en zona de equilibrio del mercado.";
        else desc = "Yield management alcista por escasez crítica de plazas.";
    } else {
        if (accion <= 2) desc = "Strategic discount activated due to early horizon and low occupancy.";
        else if (accion <= 5) desc = "Stable base fare in market equilibrium zone.";
        else desc = "Bullish yield management due to critical seat scarcity.";
    }
    document.getElementById('textoExplicativoAccion').innerText = desc;
}

function descargarReporte() {
    const accion = obtenerAccionPPO(valorDias, valorAsientos);
    const multi = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4][accion];
    const pct = Math.round((multi - 1) * 100);
    const fecha = new Date().toLocaleString();

    let contenido = "";
    if (currentLang === 'es') {
        contenido = `==================================================\n`;
        contenido += `        INFORME DE INFERENCIA - TFM RENFE         \n`;
        contenido += `==================================================\n`;
        contenido += `Fecha de generación: ${fecha}\n`;
        contenido += `Modelo: Deep Reinforcement Learning (PPO)\n\n`;
        contenido += `PARÁMETROS DEL ENTORNO:\n`;
        contenido += ` - Días para la salida: ${valorDias} días\n`;
        contenido += ` - Asientos disponibles: ${valorAsientos} plazas\n\n`;
        contenido += `RESULTADO DEL AGENTE:\n`;
        contenido += ` - Acción Discreta PPO: ${accion}\n`;
        contenido += ` - Multiplicador de Tarifa: ${multi.toFixed(1)}x (${pct > 0 ? "+" : ""}${pct}%)\n`;
        contenido += ` - Diagnóstico: ${document.getElementById('textoExplicativoAccion').innerText}\n`;
        contenido += `==================================================\n`;
    } else {
        contenido = `==================================================\n`;
        contenido += `        PPO INFERENCE REPORT - RENFE TFM          \n`;
        contenido += `==================================================\n`;
        contenido += `Generation Date: ${fecha}\n`;
        contenido += `Model: Deep Reinforcement Learning (PPO)\n\n`;
        contenido += `ENVIRONMENT PARAMETERS:\n`;
        contenido += ` - Days to departure: ${valorDias} days\n`;
        contenido += ` - Available seats: ${valorAsientos} seats\n\n`;
        contenido += `AGENT OUTPUT:\n`;
        contenido += ` - PPO Discrete Action: ${accion}\n`;
        contenido += ` - Fare Multiplier: ${multi.toFixed(1)}x (${pct > 0 ? "+" : ""}${pct}%)\n`;
        contenido += ` - Diagnostic: ${document.getElementById('textoExplicativoAccion').innerText}\n`;
        contenido += `==================================================\n`;
    }

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Informe_Renfe_PPO_${valorDias}d_${valorAsientos}s.txt`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function renderizarGrafica() {
    let xDias = [];
    for (let i = 0; i <= 30; i++) xDias.push(i);
    let yAsientos = [];
    for (let i = 0; i <= 100; i++) yAsientos.push(i);
    let zAcciones = [];
    for (let a = 0; a <= 100; a++) {
        let fila = [];
        for (let d = 0; d <= 30; d++) {
            fila.push(obtenerAccionPPO(d, a));
        }
        zAcciones.push(fila);
    }

    let heatmapColors = [
        [0, '#fef2f2'], [0.125, '#fee2e2'], [0.25, '#fda4af'], 
        [0.375, '#fb7185'], [0.5, '#f43f5e'], [0.625, '#e11d48'],
        [0.75, '#be123c'], [0.875, '#9f1239'], [1, '#881337']
    ];

    let data = [
        {
            z: zAcciones, x: xDias, y: yAsientos, type: 'heatmap', zmin: 0, zmax: 8, colorscale: heatmapColors,
            colorbar: { thickness: 10, len: 0.9, tickfont: { size: 10 } }
        },
        {
            x: [valorDias], y: [valorAsientos], mode: 'markers', type: 'scatter',
            marker: { color: '#09090b', size: 12, symbol: 'circle', line: { color: '#ffffff', width: 2 } },
            name: 'Selección'
        }
    ];

    Plotly.react('graficaIA', data, {
        autosize: true,
        margin: { t: 5, l: 40, r: 10, b: 35 },
        xaxis: { title: { text: currentLang === 'es' ? 'Días' : 'Days', font: { size: 11 } } },
        yaxis: { title: { text: currentLang === 'es' ? 'Plazas' : 'Seats', font: { size: 11 } } },
        paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false
    }, { responsive: true, displayModeBar: false });
}

window.onload = function() {
    const sliderD = document.getElementById('sliderDias');
    const sliderA = document.getElementById('sliderAsientos');
    
    if (sliderD) sliderD.addEventListener('input', (e) => actualizarValores(e.target.value, valorAsientos));
    if (sliderA) sliderA.addEventListener('input', (e) => actualizarValores(valorDias, e.target.value));
    
    setLang('es');
    actualizarValores(15, 45);
};