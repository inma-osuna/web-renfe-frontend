let valorDias = 15;
let valorAsientos = 50;
let currentLang = 'es';

const translations = {
    'es': {
        'subtitle': 'Dynamic Yield Engine',
        'title': 'Price Optimization',
        'export_btn': 'Exportar Reporte',
        'env_params': 'Parámetros del Entorno',
        'days_label': 'Días al despegue (Lead Time)',
        'seats_label': 'Inventario',
        'inf_title': 'Recomendación del Modelo',
        'multiplier': 'Multiplicador de Precio',
        'discrete_action': 'Acción:',
        'heatmap_title': 'Mapa de Política: Random Forest',
        'leg_1_title': 'Estrategia de Descuento (Acción 0-2)',
        'leg_2_title': 'Tarifa Neutra (Acción 3-5)',
        'leg_3_title': 'Yield Alcista (Acción 6-8)'
    },
    'en': {
        'subtitle': 'Dynamic Yield Engine',
        'title': 'Price Optimization',
        'export_btn': 'Export Report',
        'env_params': 'Environment Parameters',
        'days_label': 'Lead Time (Days)',
        'seats_label': 'Available Inventory',
        'inf_title': 'Model Recommendation',
        'multiplier': 'Price Multiplier',
        'discrete_action': 'Action:',
        'heatmap_title': 'Policy Map: Random Forest',
        'leg_1_title': 'Discount Strategy (Action 0-2)',
        'leg_2_title': 'Neutral Fare (Action 3-5)',
        'leg_3_title': 'Bullish Yield (Action 6-8)'
    }
};

function setLang(lang) {
    currentLang = lang;
    const btnES = document.getElementById('btnES');
    const btnEN = document.getElementById('btnEN');
    if (btnES) btnES.className = lang === 'es' ? 'bg-white shadow-sm text-gray-900 px-3 py-1 rounded-md text-xs font-semibold transition-all' : 'text-gray-500 hover:text-gray-900 px-3 py-1 rounded-md text-xs font-semibold transition-colors';
    if (btnEN) btnEN.className = lang === 'en' ? 'bg-white shadow-sm text-gray-900 px-3 py-1 rounded-md text-xs font-semibold transition-all' : 'text-gray-500 hover:text-gray-900 px-3 py-1 rounded-md text-xs font-semibold transition-colors';
    
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
    
    if (elPct) {
        elPct.innerText = (pct > 0 ? "+" : "") + pct + "%";
        // Estilo dinámico del badge según descuento o aumento
        if (pct < 0) {
            elPct.className = "absolute top-4 right-4 text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-100";
        } else if (pct > 0) {
            elPct.className = "absolute top-4 right-4 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100";
        } else {
            elPct.className = "absolute top-4 right-4 text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200";
        }
    }

    let desc = "";
    if (currentLang === 'es') {
        if (accion <= 2) desc = "Se recomienda aplicar un descuento estratégico debido a la alta antelación y la baja ocupación proyectada.";
        else if (accion <= 5) desc = "El sistema sugiere mantener la tarifa en la zona de equilibrio actual del mercado.";
        else desc = "Recomendación de Yield Management alcista por alta demanda y escasez crítica de inventario.";
    } else {
        if (accion <= 2) desc = "Strategic discount recommended due to early lead time and low projected occupancy.";
        else if (accion <= 5) desc = "The system suggests maintaining the fare within the current market equilibrium zone.";
        else desc = "Bullish Yield Management recommended due to high demand and critical inventory scarcity.";
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

    let contenido = `==================================================\n`;
    contenido += `      PIVOTICS - PRICING OPTIMIZATION REPORT      \n`;
    contenido += `==================================================\n`;
    contenido += `Fecha / Date: ${fecha}\n`;
    contenido += `Modelo / Model: Random Forest Optimization\n\n`;
    contenido += `[ESTADO DEL INVENTARIO / INVENTORY STATUS]\n`;
    contenido += ` > Días (Lead Time): ${valorDias}\n`;
    contenido += ` > Plazas Libres (Seats): ${valorAsientos}\n\n`;
    contenido += `[DECISIÓN ALGORÍTMICA / ALGORITHMIC DECISION]\n`;
    contenido += ` > Acción Discreta (Action): ${accion}\n`;
    contenido += ` > Ajuste de Precio (Price Adj): ${multi.toFixed(1)}x (${pct > 0 ? "+" : ""}${pct}%)\n`;
    contenido += ` > Diagnóstico: ${descText}\n`;
    contenido += `==================================================\n`;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pivotics_Report_${valorDias}d_${valorAsientos}s.txt`;
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

    // Colores SaaS Corporativos: De verde bosque a amarillo/ámbar
    let heatmapColors = [
        [0, '#115e59'],   // teal-800
        [0.25, '#14b8a6'],// teal-500
        [0.5, '#fef08a'], // yellow-200
        [0.75, '#fbbf24'],// amber-400
        [1, '#d97706']    // amber-600
    ];

    let data = [
        {
            z: zAcciones, x: xDias, y: yAsientos, type: 'heatmap', zmin: 0, zmax: 8, colorscale: heatmapColors,
            colorbar: { thickness: 12, len: 0.8, tickfont: { family: 'Inter', size: 11, color: '#4b5563' } },
            hoverongaps: false
        },
        {
            x: [valorDias], y: [valorAsientos], mode: 'markers', type: 'scatter',
            marker: { color: '#ffffff', size: 14, symbol: 'circle', line: { color: '#0f766e', width: 3 } },
            name: 'Punto de Inferencia'
        }
    ];

    Plotly.react('graficaIA', data, {
        autosize: true,
        margin: { t: 20, l: 50, r: 20, b: 40 },
        xaxis: { 
            title: { text: currentLang === 'es' ? 'Lead Time (Días)' : 'Lead Time (Days)', font: { family: 'Inter', size: 12, color: '#6b7280' } }, 
            tickfont: { family: 'Inter', color: '#6b7280' }, 
            gridcolor: '#f3f4f6' 
        },
        yaxis: { 
            title: { text: currentLang === 'es' ? 'Asientos Disponibles' : 'Available Seats', font: { family: 'Inter', size: 12, color: '#6b7280' } }, 
            tickfont: { family: 'Inter', color: '#6b7280' }, 
            gridcolor: '#f3f4f6' 
        },
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
    actualizarValores(15, 50); // Empieza en 50 asientos
};