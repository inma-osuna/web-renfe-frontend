const multiplicadores = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4];

function inicializarSelectorRutas() {
    const select = document.getElementById("selector_ruta");
    if (!select || typeof CEREBRO_IA === 'undefined') return;
    
    select.innerHTML = "";
    Object.keys(CEREBRO_IA).forEach(ruta => {
        const option = document.createElement("option");
        option.value = ruta;
        option.innerText = ruta.replace("_", " - ");
        select.appendChild(option);
    });
}

function cambiarVista(vista) {
    const vistaDash = document.getElementById("vista_dashboard");
    const vistaDocs = document.getElementById("vista_docs");
    const navDash = document.getElementById("nav_dashboard");
    const navDocs = document.getElementById("nav_docs");

    if (vista === 'dashboard') {
        vistaDash.classList.remove("hidden");
        vistaDocs.classList.add("hidden");
        navDash.className = "text-red-600 border-b-2 border-red-600 pb-1 transition-all";
        navDocs.className = "text-gray-400 hover:text-gray-700 pb-1 transition-all";
        Plotly.relayout('plotly_heatmap', {});
    } else {
        vistaDash.classList.add("hidden");
        vistaDocs.classList.remove("hidden");
        navDocs.className = "text-red-600 border-b-2 border-red-600 pb-1 transition-all";
        navDash.className = "text-gray-400 hover:text-gray-700 pb-1 transition-all";
    }
}

function actualizarDashboard() {
    const rutaSeleccionada = document.getElementById("selector_ruta").value;
    const dias = parseInt(document.getElementById("slider_dias").value);
    const asientos = parseInt(document.getElementById("slider_asientos").value);

    document.getElementById("val_dias").innerText = dias + " d";
    document.getElementById("val_asientos").innerText = asientos + " pl";

    const claveEstado = dias + "_" + asientos;
    let accionIA = 4;
    let precioBase = 50.00;
    let tarifaMaxima = 300.00;

    // Extraer datos estructurados del nuevo cerebro multiruta
    if (typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[rutaSeleccionada]) {
        const datosRuta = CEREBRO_IA[rutaSeleccionada];
        
        // 1. Obtener acción del modelo
        if (datosRuta.politica && datosRuta.politica[claveEstado] !== undefined) {
            accionIA = datosRuta.politica[claveEstado];
        }
        
        // 2. Obtener el precio base real de ese día exacto desde el ETL de PySpark
        if (datosRuta.precios_base && datosRuta.precios_base[dias.toString()] !== undefined) {
            precioBase = datosRuta.precios_base[dias.toString()];
        }
        
        // 3. Obtener el techo máximo real de la ruta
        if (datosRuta.tarifa_maxima !== undefined) {
            tarifaMaxima = datosRuta.tarifa_maxima;
        }
    }

    const multiplicador = multiplicadores[accionIA];
    const precioMatematicoOptimo = precioBase * multiplicador;
    
    // GOBERNANZA DE NEGOCIO: Veto estricto si se supera el techo
    let precioFinal = precioMatematicoOptimo;
    let restriccionAplicada = null;

    if (precioMatematicoOptimo > tarifaMaxima) {
        precioFinal = tarifaMaxima;
        restriccionAplicada = "TECHO";
    }

    const pctCambio = Math.round((multiplicador - 1.0) * 100);
    const badge = document.getElementById("badge_pct");
    badge.innerText = (pctCambio > 0 ? "+" : "") + pctCambio + "%";
    badge.className = "text-xs font-bold px-2 py-0.5 rounded " + (pctCambio > 0 ? "bg-orange-50 text-orange-600" : pctCambio < 0 ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600");

    document.getElementById("res_multiplicador").innerText = multiplicador.toFixed(1) + "x";
    document.getElementById("res_accion").innerText = accionIA;
    
    const elementoPrecio = document.getElementById("res_precio_final");
    const contenedorAlerta = document.getElementById("alerta_negocio");
    const textoAlerta = document.getElementById("texto_alerta_negocio");
    const descEstado = document.getElementById("descripcion_estado");

    if (restriccionAplicada === "TECHO") {
        elementoPrecio.innerHTML = `${precioFinal.toFixed(2)} € <span class="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold ml-1">VETADO POR TECHO</span>`;
        if (textoAlerta) {
            textoAlerta.innerText = `El modelo proponía ${precioMatematicoOptimo.toFixed(2)} € (base de ${precioBase.toFixed(2)}€ a ${dias} días x ${multiplicador.toFixed(1)}x), superando el límite histórico de ${tarifaMaxima.toFixed(2)} € para esta línea.`;
        }
        if (descEstado) descEstado.innerText = "Tarifa bloqueada por cumplimiento normativo y techos de gobernanza.";
        if (contenedorAlerta) contenedorAlerta.classList.remove("hidden");
    } else {
        elementoPrecio.innerText = precioFinal.toFixed(2) + " € (Base: " + precioBase.toFixed(2) + "€)";
        if (descEstado) descEstado.innerText = "Tarifa óptima validada por el modelo dentro del marco de precios de la ruta.";
        if (contenedorAlerta) contenedorAlerta.classList.add("hidden");
    }

    renderizarHeatmapPlotly(rutaSeleccionada, dias, asientos);
}

function renderizarHeatmapPlotly(ruta, diasActuales, asientosActuales) {
    const ejeX = Array.from({length: 31}, (_, i) => i);
    const ejeY = Array.from({length: 101}, (_, i) => i);
    
    const zData = [];
    for (let a = 100; a >= 0; a--) {
        const fila = [];
        for (let d = 0; d <= 30; d++) {
            const clave = d + "_" + a;
            let val = 4;
            if (typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[ruta] && CEREBRO_IA[ruta].politica && CEREBRO_IA[ruta].politica[clave] !== undefined) {
                val = CEREBRO_IA[ruta].politica[clave];
            }
            fila.push(val);
        }
        zData.push(fila);
    }

    const dataHeatmap = {
        z: zData,
        x: ejeX,
        y: ejeY.reverse(),
        type: 'heatmap',
        colorscale: [
            [0.0, '#fbcfe8'],
            [0.33, '#fbcfe8'],
            [0.34, '#ef4444'],
            [0.66, '#ef4444'],
            [0.67, '#ea580c'],
            [1.0, '#ea580c']
        ],
        showscale: true,
        colorbar: { len: 0.9, thickness: 10 }
    };

    const puntoSeleccionado = {
        x: [diasActuales],
        y: [asientosActuales],
        mode: 'markers',
        type: 'scatter',
        marker: {
            color: 'white',
            size: 11,
            line: { color: 'black', width: 2 }
        },
        showlegend: false
    };

    const layout = {
        margin: { t: 15, r: 10, b: 35, l: 45 },
        xaxis: { title: 'Lead Time (Días)', dtick: 5 },
        yaxis: { title: 'Asientos Disponibles' },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent'
    };

    Plotly.react('plotly_heatmap', [dataHeatmap, puntoSeleccionado], layout, {responsive: true, displayModeBar: false});
}

document.getElementById("selector_ruta").addEventListener("change", actualizarDashboard);
document.getElementById("slider_dias").addEventListener("input", actualizarDashboard);
document.getElementById("slider_asientos").addEventListener("input", actualizarDashboard);

window.onload = function() {
    inicializarSelectorRutas();
    actualizarDashboard();
};