const multiplicadores = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4];

// Precios base de referencia por ruta
const preciosBasePorRuta = {
    "MADRID_BARCELONA": 65.00,
    "MADRID_SEVILLA": 50.00,
    "MADRID_VALENCIA": 40.00
};

// Topes máximos históricos (Price Ceiling) extraídos de tus datos de Renfe
const tarifasMaximasPorRuta = {
    "MADRID_BARCELONA": 150.00, // Ajusta este valor al máximo real de tu ETL si difiere
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

    // APLICACIÓN DEL TOPE DE SEGURIDAD (Igual que en tu entorno Gymnasium)
    const precioCalculado = precioBase * multiplicador;
    const precioFinal = Math.min(precioCalculado, tarifaMaxima);

    const pctCambio = Math.round((multiplicador - 1.0) * 100);
    const badge = document.getElementById("badge_pct");
    badge.innerText = (pctCambio > 0 ? "+" : "") + pctCambio + "%";
    badge.className = "text-xs font-bold px-2 py-0.5 rounded " + (pctCambio > 0 ? "bg-orange-50 text-orange-600" : pctCambio < 0 ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600");

    document.getElementById("res_multiplicador").innerText = multiplicador.toFixed(1) + "x";
    document.getElementById("res_accion").innerText = accionIA;
    
    // Si el precio ha sido frenado por el techo, avisamos visualmente
    if (precioCalculado > tarifaMaxima) {
        document.getElementById("res_precio_final").innerText = precioFinal.toFixed(2) + " € (Tope Máximo)";
    } else {
        document.getElementById("res_precio_final").innerText = precioFinal.toFixed(2) + " €";
    }

    renderizarHeatmap(rutaSeleccionada, dias, asientos);
}

function getColorAccion(accion) {
    if (accion <= 2) return "#fbcfe8";
    if (accion <= 5) return "#ef4444";
    return "#ea580c";
}

function renderizarHeatmap(ruta, diasActuales, asientosActuales) {
    const grid = document.getElementById("heatmap_grid");
    grid.innerHTML = "";
    
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(31, minmax(0, 1fr))";
    grid.style.gridTemplateRows = "repeat(10, minmax(0, 1fr))";

    for (let nivelAsiento = 9; nivelAsiento >= 0; nivelAsiento--) {
        let asientosSimulados = nivelAsiento * 10 + 5;
        for (let dia = 0; dia <= 30; dia++) {
            const cell = document.createElement("div");
            cell.className = "w-full h-full rounded-sm transition-all duration-150 relative";
            
            const clave = dia + "_" + asientosSimulados;
            let accionCell = 4;
            if (typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[ruta] && CEREBRO_IA[ruta][clave] !== undefined) {
                accionCell = CEREBRO_IA[ruta][clave];
            }

            cell.style.backgroundColor = getColorAccion(accionCell);

            if (Math.abs(dia - diasActuales) === 0 && Math.abs(asientosSimulados - asientosActuales) < 10) {
                cell.style.border = "2px solid #000";
                cell.style.zIndex = "10";
            }

            grid.appendChild(cell);
        }
    }
}

document.getElementById("selector_ruta").addEventListener("change", actualizarDashboard);
document.getElementById("slider_dias").addEventListener("input", actualizarDashboard);
document.getElementById("slider_asientos").addEventListener("input", actualizarDashboard);

window.onload = function() {
    actualizarDashboard();
};