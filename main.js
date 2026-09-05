const multiplicadores = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4];

// Precios base automáticos por ruta
const preciosBasePorRuta = {
    "MADRID_BARCELONA": 65.00,
    "MADRID_SEVILLA": 50.00,
    "MADRID_VALENCIA": 40.00
};

function actualizarDashboard() {
    const rutaSeleccionada = document.getElementById("selector_ruta").value;
    const dias = parseInt(document.getElementById("slider_dias").value);
    const asientos = parseInt(document.getElementById("slider_asientos").value);

    // Actualizar etiquetas visuales de los sliders
    document.getElementById("val_dias").innerText = dias + " d";
    document.getElementById("val_asientos").innerText = asientos + " pl";

    const claveEstado = dias + "_" + asientos;
    let accionIA = 4; // Neutro por defecto

    // Consultar el objeto jerárquico CEREBRO_IA del archivo cerebro.js
    if (typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[rutaSeleccionada]) {
        if (CEREBRO_IA[rutaSeleccionada][claveEstado] !== undefined) {
            accionIA = CEREBRO_IA[rutaSeleccionada][claveEstado];
        }
    }

    const multiplicador = multiplicadores[accionIA];
    const precioBase = preciosBasePorRuta[rutaSeleccionada] || 55.00;
    const precioFinal = precioBase * multiplicador;

    // Calcular porcentaje de cambio respecto a 1.0x
    const pctCambio = Math.round((multiplicador - 1.0) * 100);
    const badge = document.getElementById("badge_pct");
    badge.innerText = (pctCambio > 0 ? "+" : "") + pctCambio + "%";
    badge.className = "text-xs font-bold px-2 py-0.5 rounded " + (pctCambio > 0 ? "bg-orange-50 text-orange-600" : pctCambio < 0 ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600");

    // Actualizar panel de recomendación
    document.getElementById("res_multiplicador").innerText = multiplicador.toFixed(1) + "x";
    document.getElementById("res_accion").innerText = accionIA;
    document.getElementById("res_precio_final").innerText = precioFinal.toFixed(2) + " €";

    renderizarHeatmap(rutaSeleccionada, dias, asientos);
}

function getColorAccion(accion) {
    if (accion <= 2) return "#fbcfe8"; // Rosa / Descuento (0-2)
    if (accion <= 5) return "#ef4444"; // Rojo / Neutro (3-5)
    return "#ea580c";                  // Naranja / Alcista (6-8)
}

function renderizarHeatmap(ruta, diasActuales, asientosActuales) {
    const grid = document.getElementById("heatmap_grid");
    grid.innerHTML = "";
    
    // Configuramos estilo grid dinámico para 31 días (0-30) y bloques de asientos
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(31, minmax(0, 1fr))";
    grid.style.gridTemplateRows = "repeat(10, minmax(0, 1fr))";

    // Generamos una matriz visual simplificada de 10 niveles de asientos x 31 días
    for (let nivelAsiento = 9; nivelAsiento >= 0; nivelAsiento--) {
        let asientosSimulados = nivelAsiento * 10 + 5; // 5, 15, ..., 95
        for (let dia = 0; dia <= 30; dia++) {
            const cell = document.createElement("div");
            cell.className = "w-full h-full rounded-sm transition-all duration-150 relative";
            
            const clave = dia + "_" + asientosSimulados;
            let accionCell = 4;
            if (typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[ruta] && CEREBRO_IA[ruta][clave] !== undefined) {
                accionCell = CEREBRO_IA[ruta][clave];
            }

            cell.style.backgroundColor = getColorAccion(accionCell);

            // Resaltar la celda seleccionada por los sliders
            if (Math.abs(dia - diasActuales) === 0 && Math.abs(asientosSimulados - asientosActuales) < 10) {
                cell.style.border = "2px solid #000";
                cell.style.zIndex = "10";
            }

            grid.appendChild(cell);
        }
    }
}

// Listeners para interactividad en tiempo real
document.getElementById("selector_ruta").addEventListener("change", actualizarDashboard);
document.getElementById("slider_dias").addEventListener("input", actualizarDashboard);
document.getElementById("slider_asientos").addEventListener("input", actualizarDashboard);

// Ejecutar al cargar la página
window.onload = function() {
    actualizarDashboard();
};