let valorDias = 15;
let valorAsientos = 50;
let currentLang = 'es';

const translations = {
    'es': {
        'subtitle': 'SYS.ML_ENGINE_v1.0',
        'title': 'Motor de Precios Dinámicos',
        'export_btn': '[EXPORT_REPORT]',
        'env_params': '// ENV_PARAMETERS',
        'days_label': 'Días (Lead Time)',
        'seats_label': 'Asientos Libres',
        'inf_title': '>> INFERENCE_OUTPUT',
        'multiplier': 'Multiplicador',
        'discrete_action': 'Acción Discreta',
        'heatmap_title': '// POLICY_SPACE_MATRIX',
        'leg_1_title': 'ACT: 0–2 (0.6x - 0.8x)',
        'leg_1_desc': 'Descuentos agresivos para estimular la demanda.',
        'leg_2_title': 'ACT: 3–5 (0.9x - 1.1x)',
        'leg_2_desc': 'Tarifa base neutra de equilibrio.',
        'leg_3_title': 'ACT: 6–8 (1.2x - 1.4x)',
        'leg_3_desc': 'Yield management alcista por escasez.'
    },
    'en': {
        'subtitle': 'SYS.ML_ENGINE_v1.0',
        'title': 'Dynamic Pricing Engine',
        'export_btn': '[EXPORT_REPORT]',
        'env_params': '// ENV_PARAMETERS',
        'days_label': 'Days (Lead Time)',
        'seats_label': 'Available Seats',
        'inf_title': '>> INFERENCE_OUTPUT',
        'multiplier': 'Multiplier',
        'discrete_action': 'Discrete Action',
        'heatmap_title': '// POLICY_SPACE_MATRIX',
        'leg_1_title': 'ACT: 0–2 (0.6x - 0.8x)',
        'leg_1_desc': 'Aggressive discounts to stimulate demand.',
        'leg_2_title': 'ACT: 3–5 (0.9x - 1.1x)',
        'leg_2_desc': 'Neutral equilibrium base fare.',
        'leg_3_title': 'ACT: 6–8 (1.2x - 1.4x)',
        'leg_3_desc': 'Bullish yield management for scarcity.'
    }
};

function setLang(lang) {
    currentLang = lang;
    const btnES = document.getElementById('btnES');
    const btnEN = document.getElementById('btnEN');
    if (btnES) btnES.className = lang === 'es' ? 'bg-white border border-stone-300 shadow-sm text-stone-900 px-3 py-1 rounded text-[11px] font-bold' : 'text-stone-500 hover:text-stone-900 px-3 py-1 rounded text-[11px] font-bold';
    if (btnEN) btnEN.className = lang === 'en' ? 'bg-white border border-stone-300 shadow-sm text-stone-900 px-3 py-1 rounded text-[11px] font-bold' : 'text-stone-500 hover:text-stone-900 px-3 py-1 rounded text-[11px] font-bold';
    
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
    return 4; // Valor fallback
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
        contenido += `Fecha: ${fecha}\n`;
        contenido += `Modelo: Machine Learning (Random Forest)\n\n`;
        contenido += `[PARAMETROS]\n`;
        contenido += ` > Días Lead Time: ${valorDias}\n`;
        contenido += ` > Asientos Libres: ${valorAsientos}\n\n`;
        contenido += `[INFERENCIA]\n`;
        contenido += ` > Acción Óptima: ${accion}\n`;
        contenido += ` > Multiplicador: ${multi.toFixed(1)}x (${pct > 0 ? "+" : ""}${pct}%)\n`;
        contenido += ` > Diagnóstico: ${descText}\n`;
        contenido += `==================================================\n`;
    } else {
        contenido = `==================================================\n`;
        contenido += `        INFERENCE REPORT - RENFE TFM              \n`;
        contenido += `==================================================\n`;
        contenido += `Date: ${fecha}\n`;
        contenido += `Model: Machine Learning (Random Forest)\n\n`;
        contenido += `[PARAMETERS]\n`;
        contenido += ` > Lead Time Days: ${valorDias}\n`;
        contenido += ` > Available Seats: ${valorAsientos}\n\n`;
        contenido += `[INFERENCE]\n`;
        contenido += ` > Optimal Action: ${accion}\n`;
        contenido += ` > Multiplier: ${multi.toFixed(1)}x (${pct > 0 ? "+" : ""}${pct}%)\n`;
        contenido += ` > Diagnostic: ${descText}\n`;
        contenido += `==================================================\n`;
    }

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_Pricing_RF_${valorDias}d_${valorAsientos}s.txt`;
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

    // Escala analítica clara (Esmeralda/Ambar, sin azul)
    let heatmapColors = [
        [0, '#f5f5f4'], 
        [0.25, '#d1fae5'], 
        [0.5, '#10b981'], 
        [0.75, '#f59e0b'], 
        [1, '#ea580c']
    ];

    let data = [
        {
            z: zAcciones, x: xDias, y: yAsientos, type: 'heatmap', zmin: 0, zmax: 8, colorscale: heatmapColors,
            colorbar: { thickness: 12, len: 0.9, tickfont: { family: 'JetBrains Mono', size: 10, color: '#57534e' } },
            hoverongaps: false
        },
        {
            x: [valorDias], y: [valorAsientos], mode: 'markers', type: 'scatter',
            marker: { color: '#1c1917', size: 10, symbol: 'square', line: { color: '#ffffff', width: 1.5 } },
            name: 'Selección'
        }
    ];

    Plotly.react('graficaIA', data, {
        autosize: true,
        margin: { t: 10, l: 40, r: 10, b: 35 },
        xaxis: { title: { text: currentLang === 'es' ? 'Días' : 'Days', font: { family: 'JetBrains Mono', size: 11, color: '#78716c' } }, tickfont: { family: 'JetBrains Mono', color: '#78716c' }, gridcolor: '#e7e5e4' },
        yaxis: { title: { text: currentLang === 'es' ? 'Plazas' : 'Seats', font: { family: 'JetBrains Mono', size: 11, color: '#78716c' } }, tickfont: { family: 'JetBrains Mono', color: '#78716c' }, gridcolor: '#e7e5e4' },
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
    actualizarValores(15, 50); // <--- Inicializado a 50 plazas por defecto
    renderizarGrafica();
};