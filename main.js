// main.js
let valorDias = 15;
let valorAsientos = 45;
let currentLang = 'es';

const translations = {
    'es': {
        'subtitle': 'Machine Learning Engine',
        'title': 'Motor de Precios Dinámicos',
        'export_btn': 'Exportar Reporte',
        'env_params': 'Parámetros del Entorno',
        'days_label': 'Días para la salida',
        'seats_label': 'Asientos disponibles',
        'inf_title': 'Inferencia del Modelo',
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
        'subtitle': 'Machine Learning Engine',
        'title': 'Dynamic Pricing Engine',
        'export_btn': 'Export Report',
        'env_params': 'Environment Parameters',
        'days_label': 'Days to departure',
        'seats_label': 'Available seats',
        'inf_title': 'Model Inference',
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
    const btnES = document.getElementById('btnES');
    const btnEN = document.getElementById('btnEN');
    if (btnES) btnES.className = lang === 'es' ? 'bg-emerald-500 text-zinc-950 px-3 py-1 rounded-lg text-xs font-bold transition-all' : 'text-zinc-400 hover:text-zinc-100 px-3 py-1 rounded-lg text-xs font-bold transition-colors';
    if (btnEN) btnEN.className = lang === 'en' ? 'bg-emerald-500 text-zinc-950 px-3 py-1 rounded-lg text-xs font-bold transition-all' : 'text-zinc-400 hover:text-zinc-100 px-3 py-1 rounded-lg text-xs font-bold transition-colors';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    ejecutarModeloIA();
}

function actualizarValores(d, a) {
    valorDias = parseInt(d);
    valorAsientos = parseInt(a);
    
    const sliderD = document.getElementById('sliderDias');
    const txtD = document.getElementById('txtDias');
    const sliderA = document.getElementById('sliderAsientos');
    const txtA = document.getElementById('txtAsientos');

    if (sliderD) sliderD.value = valorDias;
    if (txtD) txtD.innerText = valorDias + " d";
    if (sliderA) sliderA.value = valorAsientos;
    if (txtA) txtA.innerText = valorAsientos + " pl";

    ejecutarModeloIA();
    renderizarGrafica();
}

function obtenerAccionModelo(dias, asientos) {
    const clave = `${dias}_${asientos}`;
    if (typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[clave] !== undefined) {
        return CEREBRO_IA[clave];
    }
    return 4;
}

function ejecutarModeloIA() {
    const accion = obtenerAccionModelo(valorDias, valorAsientos);
    const multiplicadores = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4];
    const multi = multiplicadores[accion] !== undefined ? multiplicadores[accion] : 1.0;
    const pct = Math.round((multi - 1) * 100);

    const elMulti = document.getElementById('precioMultiplicador');
    const elAccion = document.getElementById('accionAgente');
    const elPct = document.getElementById('ajustePorcentaje');
    const elDesc = document.getElementById('textoExplicativoAccion');

    if (elMulti) elMulti.innerText = multi.toFixed(1) + "x";
    if (elAccion) elAccion.innerText = accion;
    if (elPct) elPct.innerText = (pct > 0 ? "+" : "") + pct + "%";

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
    if (elDesc) elDesc.innerText = desc;
}

function descargarReporte() {
    const accion = obtenerAccionModelo(valorDias, valorAsientos);
    const multiplicadores = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4];
    const multi = multiplicadores[accion] || 1.0;
    const pct = Math.round((multi - 1) * 100);
    const fecha = new Date().toLocaleString();
    const descElem = document.getElementById('textoExplicativoAccion');
    const descText = descElem ? descElem.innerText : "";

    let contenido = "";
    if (currentLang === 'es') {
        contenido = `==================================================\n`;
        contenido += `        INFORME DE INFERENCIA - TFM RENFE         \n`;
        contenido += `==================================================\n`;
        contenido += `Fecha de generación: ${fecha}\n`;
        contenido += `Modelo: Machine Learning (Random Forest)\n\n`;
        contenido += `PARÁMETROS DEL ENTORNO:\n`;
        contenido += ` - Días para la salida: ${valorDias} días\n`;
        contenido += ` - Asientos disponibles: ${valorAsientos} plazas\n\n`;
        contenido += `RESULTADO DEL SISTEMA:\n`;
        contenido += ` - Acción Óptima: ${accion}\n`;
        contenido += ` - Multiplicador de Tarifa: ${multi.toFixed(1)}x (${pct > 0 ? "+" : ""}${pct}%)\n`;
        contenido += ` - Diagnóstico: ${descText}\n`;
        contenido += `==================================================\n`;
    } else {
        contenido = `==================================================\n`;
        contenido += `        INFERENCE REPORT - RENFE TFM              \n`;
        contenido += `==================================================\n`;
        contenido += `Generation Date: ${fecha}\n`;
        contenido += `Model: Machine Learning (Random Forest)\n\n`;
        contenido += `ENVIRONMENT PARAMETERS:\n`;
        contenido += ` - Days to departure: ${valorDias} days\n`;
        contenido += ` - Available seats: ${valorAsientos} seats\n\n`;
        contenido += `SYSTEM OUTPUT:\n`;
        contenido += ` - Optimal Action: ${accion}\n`;
        contenido += ` - Fare Multiplier: ${multi.toFixed(1)}x (${pct > 0 ? "+" : ""}${pct}%)\n`;
        contenido += ` - Diagnostic: ${descText}\n`;
        contenido += `==================================================\n`;
    }

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Informe_Renfe_Pricing_${valorDias}d_${valorAsientos}s.txt`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function renderizarGrafica() {
    const contenedor = document.getElementById('graficaIA');
    if (!contenedor) return;

    let xDias = [];
    for (let i = 0; i <= 30; i++) xDias.push(i);
    let yAsientos = [];
    for (let i = 0; i <= 100; i++) yAsientos.push(i);
    
    let zAcciones = [];
    for (let a = 0; a <= 100; a++) {
        let fila = [];
        for (let d = 0; d <= 30; d++) {
            fila.push(obtenerAccionModelo(d, a));
        }
        zAcciones.push(fila);
    }

    // Custom dark-mode friendly emerald/amber/zinc heatmap colorscale (No Blue)
    let heatmapColors = [
        [0, '#042f2e'], 
        [0.25, '#0f766e'], 
        [0.5, '#14b8a6'], 
        [0.75, '#f59e0b'], 
        [1, '#b45309']
    ];

    let data = [
        {
            z: zAcciones, x: xDias, y: yAsientos, type: 'heatmap', zmin: 0, zmax: 8, colorscale: heatmapColors,
            colorbar: { thickness: 10, len: 0.9, tickfont: { size: 10, color: '#a1a1aa' } },
            hoverongaps: false
        },
        {
            x: [valorDias], y: [valorAsientos], mode: 'markers', type: 'scatter',
            marker: { color: '#10b981', size: 12, symbol: 'circle', line: { color: '#ffffff', width: 2 } },
            name: 'Selección'
        }
    ];

    Plotly.react('graficaIA', data, {
        autosize: true,
        margin: { t: 10, l: 40, r: 10, b: 35 },
        xaxis: { title: { text: currentLang === 'es' ? 'Días' : 'Days', font: { size: 11, color: '#a1a1aa' } }, tickfont: { color: '#a1a1aa' }, gridcolor: '#27272a' },
        yaxis: { title: { text: currentLang === 'es' ? 'Plazas' : 'Seats', font: { size: 11, color: '#a1a1aa' } }, tickfont: { color: '#a1a1aa' }, gridcolor: '#27272a' },
        paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false
    }, { responsive: true, displayModeBar: false });
}

window.onload = function() {
    const sliderD = document.getElementById('sliderDias');
    const sliderA = document.getElementById('sliderAsientos');
    
    if (sliderD) {
        sliderD.addEventListener('input', (e) => actualizarValores(e.target.value, valorAsientos));
    }
    if (sliderA) {
        sliderA.addEventListener('input', (e) => actualizarValores(valorDias, e.target.value));
    }
    
    setLang('es');
    actualizarValores(15, 45);
    renderizarGrafica();
};