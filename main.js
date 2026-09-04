let valorDias = 15;
let valorAsientos = 50;
let currentLang = 'es';

const translations = {
    'es': {
        'title': 'Revenue Management',
        'subtitle': 'Dynamic Pricing',
        'nav_dashboard': 'Dashboard',
        'nav_docs': 'Documentación Técnica',
        'export_btn': 'Exportar Reporte',
        'env_params': 'Parámetros del Entorno',
        'days_label': 'Días para la salida', // Corregido
        'seats_label': 'Inventario',
        'inf_title': 'Recomendación del Modelo',
        'multiplier': 'Multiplicador de Precio',
        'discrete_action': 'Acción Discreta:',
        'heatmap_title': 'Mapa de Política: Random Forest',
        
        'leg_1_title': 'Acciones 0–2 (0.6x - 0.8x)',
        'leg_1_desc': 'Descuentos agresivos.',
        'leg_2_title': 'Acciones 3–5 (0.9x - 1.1x)',
        'leg_2_desc': 'Tarifa base neutra.',
        'leg_3_title': 'Acciones 6–8 (1.2x - 1.4x)',
        'leg_3_desc': 'Yield management alcista.',
        
        // DOCUMENTACIÓN EXTENDIDA - NARRATIVA 10/10
        'doc_title': 'Fundamentos y Arquitectura del Modelo',
        'doc_subtitle': 'Análisis metodológico del motor de Revenue Management Dinámico.',
        'doc_sec1_title': 'Formulación del Problema (Revenue Management)',
        'doc_sec1_p1': 'La optimización de precios en el sector ferroviario de Alta Velocidad requiere un equilibrio continuo entre la maximización del factor de ocupación y el incremento del ingreso marginal por asiento. El objetivo del sistema desarrollado es maximizar el Yield total de un tren ajustando la política de precios de forma dinámica.',
        'doc_sec1_p2': 'Para lograrlo, el entorno se ha modelado como un Proceso de Decisión de Markov (MDP), donde el agente de inteligencia artificial observa un estado en el tiempo t y ejecuta una acción de fijación de precio para maximizar la recompensa futura esperada.',
        
        'doc_sec2_title': 'Espacio de Estados y Acciones (MDP)',
        'doc_sec2_state': 'Espacio de Estados (S)',
        'doc_sec2_s1_title': 'Lead Time:',
        'doc_sec2_s1_desc': 'Días restantes hasta la salida (0 a 30). Captura la evolución de la curva de demanda y la inelasticidad del pasajero de última hora.',
        'doc_sec2_s2_title': 'Inventario Disponible:',
        'doc_sec2_s2_desc': 'Asientos libres restantes. A menor capacidad, mayor es el coste de oportunidad de vender barato.',
        'doc_sec2_action': 'Espacio de Acciones (A)',
        'doc_sec2_a_desc': 'El sistema acciona una variable discreta escalar entre 0 y 8, que se traduce algorítmicamente en un multiplicador sobre la tarifa base:',
        
        'doc_sec3_title': 'Evolución Algorítmica: PPO y Random Forest',
        'doc_sec3_p1': 'En la fase experimental, el agente entrenado mediante Proximal Policy Optimization (PPO) demostró una alta eficacia económica, adoptando una política extrema de tipo "bang-bang" (grandes descuentos vs. subidas agresivas). Sin embargo, esta polarización resulta poco estable para una operativa comercial continua.',
        'doc_sec3_p2': 'Por ello, para la capa demostrativa de esta interfaz, se ha implementado como motor operativo un modelo Random Forest Regressor (enfoque predict-then-optimize). Este algoritmo de ensamble proporciona una superficie de decisiones mucho más progresiva, granular e interpretable para el usuario de negocio.',
        'doc_sec3_p3': 'La evaluación Monte Carlo se mantiene en la arquitectura global como un mecanismo de arbitraje independiente, demostrando empíricamente la solidez del sistema frente a diferentes escenarios de estrés de demanda.',
        
        'doc_sec4_title': 'Guía de Interpretación del Dashboard',
        'doc_sec4_p1': 'El Mapa de Política de la interfaz expone visualmente el espacio de decisión completo del modelo. Permite al analista evaluar la estrategia global de un vistazo:',
        'doc_sec4_li1': 'Zonas Claras (Rosa pálido): Aparecen principalmente con muchos días de antelación y muchas plazas libres. Indican acciones de descuento para estimular compras tempranas y asegurar el Load Factor base.',
        'doc_sec4_li2': 'Zonas Cálidas (Naranja fuego): Se concentran cuando hay escasez y urgencia temporal. Representan la activación del Yield Management restrictivo para capitalizar la disposición a pagar de los clientes corporativos.'
    },
    'en': {
        'title': 'Revenue Management',
        'subtitle': 'Dynamic Pricing',
        'nav_dashboard': 'Dashboard',
        'nav_docs': 'Technical Documentation',
        'export_btn': 'Export Report',
        'env_params': 'Environment Parameters',
        'days_label': 'Lead Time (Days)',
        'seats_label': 'Inventory (Seats)',
        'inf_title': 'Model Recommendation',
        'multiplier': 'Price Multiplier',
        'discrete_action': 'Discrete Action:',
        'heatmap_title': 'Policy Map: Random Forest',
        
        'leg_1_title': 'Actions 0–2 (0.6x - 0.8x)',
        'leg_1_desc': 'Aggressive discounts.',
        'leg_2_title': 'Actions 3–5 (0.9x - 1.1x)',
        'leg_2_desc': 'Neutral base fare.',
        'leg_3_title': 'Actions 6–8 (1.2x - 1.4x)',
        'leg_3_desc': 'Bullish yield management.',
        
        'doc_title': 'Model Fundamentals & Architecture',
        'doc_subtitle': 'Methodological analysis of the Dynamic Revenue Management engine.',
        'doc_sec1_title': 'Problem Formulation (Revenue Management)',
        'doc_sec1_p1': 'Price optimization in the High-Speed railway sector requires a continuous balance between maximizing the load factor and increasing the marginal revenue per seat. The goal of this system is to maximize total Yield by dynamically adjusting the pricing policy.',
        'doc_sec1_p2': 'To achieve this, the environment is modeled as a Markov Decision Process (MDP), where the AI agent observes a state at time t and executes a pricing action to maximize expected future rewards.',
        
        'doc_sec2_title': 'State and Action Space (MDP)',
        'doc_sec2_state': 'State Space (S)',
        'doc_sec2_s1_title': 'Lead Time:',
        'doc_sec2_s1_desc': 'Days remaining until departure (0 to 30). Captures the evolution of the demand curve and last-minute passenger inelasticity.',
        'doc_sec2_s2_title': 'Available Inventory:',
        'doc_sec2_s2_desc': 'Remaining free seats. Lower capacity implies a higher opportunity cost of selling cheap.',
        'doc_sec2_action': 'Action Space (A)',
        'doc_sec2_a_desc': 'The system triggers a discrete scalar variable between 0 and 8, which translates algorithmically into a base fare multiplier:',
        
        'doc_sec3_title': 'Algorithmic Evolution: PPO and Random Forest',
        'doc_sec3_p1': 'In the experimental phase, the agent trained via Proximal Policy Optimization (PPO) demonstrated high economic efficacy by adopting an extreme "bang-bang" policy. However, this polarization is less stable for continuous commercial operations.',
        'doc_sec3_p2': 'Therefore, for the demonstration layer of this interface, a Random Forest Regressor model (predict-then-optimize approach) was implemented as the operational engine. This ensemble algorithm provides a much more progressive, granular, and interpretable decision surface for business users.',
        'doc_sec3_p3': 'The Monte Carlo evaluation is maintained in the global architecture as an independent arbitrage mechanism, empirically proving the system\'s robustness against various demand stress scenarios.',
        
        'doc_sec4_title': 'Dashboard Interpretation Guide',
        'doc_sec4_p1': 'The interface\'s Policy Map visually exposes the complete decision space of the model, allowing analysts to evaluate the global strategy at a glance:',
        'doc_sec4_li1': 'Light Zones (Pale Pink): Found mostly with high lead times and abundant seats. They indicate discount actions to stimulate early bookings and secure the base Load Factor.',
        'doc_sec4_li2': 'Warm Zones (Fire Orange): Concentrated when time and seats are scarce. They represent the activation of restrictive Yield Management to capitalize on the willingness to pay of corporate or urgent travelers.'
    }
};

function switchTab(tabId) {
    const dashView = document.getElementById('view-dashboard');
    const docsView = document.getElementById('view-docs');
    const navDash = document.getElementById('nav-dashboard');
    const navDocs = document.getElementById('nav-docs');

    if(tabId === 'dashboard') {
        dashView.classList.remove('hidden');
        docsView.classList.add('hidden');
        navDash.className = "px-4 h-full tab-active transition-colors text-sm";
        navDocs.className = "px-4 h-full tab-inactive transition-colors text-sm";
        setTimeout(renderizarGrafica, 50);
    } else {
        dashView.classList.add('hidden');
        docsView.classList.remove('hidden');
        navDash.className = "px-4 h-full tab-inactive transition-colors text-sm";
        navDocs.className = "px-4 h-full tab-active transition-colors text-sm";
    }
}

function setLang(lang) {
    currentLang = lang;
    const btnES = document.getElementById('btnES');
    const btnEN = document.getElementById('btnEN');
    if (btnES) btnES.className = lang === 'es' ? 'bg-white shadow-sm text-gray-900 px-3 py-1 rounded-md text-xs font-semibold transition-all' : 'text-gray-500 hover:text-gray-900 px-3 py-1 rounded-md text-xs font-semibold transition-colors';
    if (btnEN) btnEN.className = lang === 'en' ? 'bg-white shadow-sm text-gray-900 px-3 py-1 rounded-md text-xs font-semibold transition-all' : 'text-gray-500 hover:text-gray-900 px-3 py-1 rounded-md text-xs font-semibold transition-colors';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key]; // innerHTML para que pille las etiquetas <strong> y <em>
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
    
    // --- LÓGICA DE COLORES CORREGIDA ---
    if (elAccion) {
        elAccion.innerText = accion;
        if (accion <= 2) {
            elAccion.className = "text-xs font-bold text-pink-800 bg-pink-200 shadow-sm px-2 py-0.5 rounded";
        } else if (accion <= 5) {
            elAccion.className = "text-xs font-bold text-white bg-rose-500 shadow-sm px-2 py-0.5 rounded";
        } else {
            elAccion.className = "text-xs font-bold text-white bg-orange-500 shadow-sm px-2 py-0.5 rounded";
        }
    }
    
    if (elPct) {
        elPct.innerText = (pct > 0 ? "+" : "") + pct + "%";
        if (pct < 0) {
            elPct.className = "absolute top-4 right-4 text-xs font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200";
        } else if (pct > 0) {
            elPct.className = "absolute top-4 right-4 text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200";
        } else {
            elPct.className = "absolute top-4 right-4 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200";
        }
    }

    let desc = "";
    if (currentLang === 'es') {
        if (accion <= 2) desc = "Descuento estratégico activado por alta antelación y baja ocupación proyectada.";
        else if (accion <= 5) desc = "Tarifa base estable en zona de equilibrio del mercado.";
        else desc = "Recomendación de Yield Management alcista por alta demanda y escasez crítica de inventario.";
    } else {
        if (accion <= 2) desc = "Strategic discount recommended due to early lead time and low projected occupancy.";
        else if (accion <= 5) desc = "Stable base fare in market equilibrium zone.";
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
    contenido += `      DYNAMIC PRICING OPTIMIZATION REPORT         \n`;
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
    a.download = `Pricing_Report_${valorDias}d_${valorAsientos}s.txt`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function renderizarGrafica() {
    const contenedor = document.getElementById('graficaIA');
    if (!contenedor || contenedor.offsetWidth === 0) return;

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

    let heatmapColors = [
        [0, '#fff1f2'],     // rose-50
        [0.25, '#fbcfe8'],  // pink-200 (cambiado para alinear)
        [0.5, '#f43f5e'],   // rose-500
        [0.75, '#f97316'],  // orange-500
        [1, '#c2410c']      // orange-700
    ];

    let data = [
        {
            z: zAcciones, x: xDias, y: yAsientos, type: 'heatmap', zmin: 0, zmax: 8, colorscale: heatmapColors,
            colorbar: { thickness: 12, len: 0.8, tickfont: { family: 'Inter', size: 11, color: '#4b5563' } },
            hoverongaps: false
        },
        {
            x: [valorDias], y: [valorAsientos], mode: 'markers', type: 'scatter',
            marker: { color: '#ffffff', size: 14, symbol: 'circle', line: { color: '#9f1239', width: 3 } },
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
    actualizarValores(15, 50);
};