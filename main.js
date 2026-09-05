const multiplicadores = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4];

const preciosBasePorRuta = {
    "MADRID_BARCELONA": 65.00,
    "MADRID_SEVILLA": 50.00,
    "MADRID_VALENCIA": 40.00
};

const tarifasMaximasPorRuta = {
    "MADRID_BARCELONA": 150.00,
    "MADRID_SEVILLA": 120.00,
    "MADRID_VALENCIA": 100.00
};

function actualizarDashboard() {
    const rutaSeleccionada = document.getElementById("selector_ruta").value;
    const dias = parseInt(document.getElementById("slider_dias").value);
    const asientos = parseInt(document.getElementById("slider_asientos").value);

    document.getElementById("val_dias").innerText = dias + " d";
    document.getElementById("val_asientos").innerText = asientos + " pl";

    const claveEstado = dias + "_" + asientos;
    let accionIA = 4;

    if (typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[rutaSeleccionada]) {
        if (CEREBRO_IA[rutaSeleccionada][claveEstado] !== undefined) {
            accionIA = CEREBRO_IA[rutaSeleccionada][claveEstado];
        }
    }

    const multiplicador = multiplicadores[accionIA];
    const precioBase = preciosBasePorRuta[rutaSeleccionada] || 55.00;
    const tarifaMaxima = tarifasMaximasPorRuta[rutaSeleccionada] || 150.00;

    const precioCalculado = precioBase * multiplicador;
    const superaTope = precioCalculado > tarifaMaxima;
    const precioFinal = Math.min(precioCalculado, tarifaMaxima);

    const pctCambio = Math.round((multiplicador - 1.0) * 100);
    const badge = document.getElementById("badge_pct");
    badge.innerText = (pctCambio > 0 ? "+" : "") + pctCambio + "%";
    badge.className = "text-xs font-bold px-2 py-0.5 rounded " + (pctCambio > 0 ? "bg-orange-50 text-orange-600" : pctCambio < 0 ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600");

    document.getElementById("res_multiplicador").innerText = multiplicador.toFixed(1) + "x";
    document.getElementById("res_accion").innerText = accionIA;
    
    // Elementos de UI para el precio y la alerta de tope
    const elementoPrecio = document.getElementById("res_precio_final");
    const contenedorAlerta = document.getElementById("alerta_tope");
    const textoAlerta = document.getElementById("texto_alerta_tope");

    if (superaTope) {
        elementoPrecio.innerHTML = `${precioFinal.toFixed(2)} € <span class="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold ml-1">TOPADO</span>`;
        textoAlerta.innerText = `El modelo propuso ${precioCalculado.toFixed(2)} € (${multiplicador.toFixed(1)}x sobre base de ${precioBase.toFixed(2)}€), superando el techo regulatorio histórico de ${tarifaMaxima.toFixed(2)} € para esta ruta. Se ha aplicado el bloqueo de conformidad.`;
        contenedorAlerta.classList.remove("hidden");
    } else {
        elementoPrecio.innerText = precioFinal.toFixed(2) + " €";
        contenedorAlerta.classList.add("hidden");
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
            if (typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[ruta] && CEREBRO_IA[ruta][clave] !== undefined) {
                val = CEREBRO_IA[ruta][clave];
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
        colorbar: {
            len: 0.9,
            thickness: 12
        }
    };

    const puntoSeleccionado = {
        x: [diasActuales],
        y: [asientosActuales],
        mode: 'markers',
        type: 'scatter',
        marker: {
            color: 'white',
            size: 12,
            line: { color: 'black', width: 2 }
        },
        showlegend: false
    };

    const layout = {
        margin: { t: 20, r: 10, b: 40, l: 50 },
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
    actualizarDashboard();
};