// --- CONFIGURACIÓN BASE ---
const MAX_DIAS = 30;
const CAPACIDAD = 100;
const MULTIPLICADORES = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4];

// --- ELEMENTOS DEL DOM ---
const sliderDias = document.getElementById("slider-dias");
const sliderAsientos = document.getElementById("slider-asientos");
const valorDias = document.getElementById("valor-dias");
const valorAsientos = document.getElementById("valor-asientos");

const textoMultiplicador = document.getElementById("texto-multiplicador");
const badgeAccion = document.getElementById("badge-accion");
const badgePorcentaje = document.getElementById("badge-porcentaje");
const textoExplicativo = document.getElementById("texto-explicativo");

const canvas = document.getElementById("heatmap-canvas");
const ctx = canvas.getContext("2d");
const cursorIndicador = document.getElementById("cursor-indicador");

// --- COLORES PARA EL MAPA Y LAS ETIQUETAS ---
// Usamos los mismos hexagesimales que Tailwind (Pink-200, Rose-500, Orange-500)
function obtenerColor(accion) {
    if (accion <= 2) return "#fbcfe8"; // Pink 200 (Descuentos)
    if (accion <= 5) return "#f43f5e"; // Rose 500 (Base)
    return "#f97316";                  // Orange 500 (Alcista)
}

// --- ACTUALIZACIÓN DE LA INTERFAZ (EL PANEL IZQUIERDO) ---
function actualizarDashboard() {
    const dias = parseInt(sliderDias.value);
    const asientos = parseInt(sliderAsientos.value);
    
    // Actualizar textos de los sliders
    valorDias.innerText = `${dias} d`;
    valorAsientos.innerText = `${asientos} pl`;

    // Leer la matriz exportada (CEREBRO_IA viene de cerebro.js)
    const clave = `${dias}_${asientos}`;
    const accion = typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[clave] !== undefined ? CEREBRO_IA[clave] : 4;
    const multiplicador = MULTIPLICADORES[accion];

    // Actualizar número multiplicador
    textoMultiplicador.innerText = `${multiplicador.toFixed(1)}x`;
    
    // Calcular porcentaje respecto a base 1.0x
    const porcentaje = Math.round((multiplicador - 1.0) * 100);
    badgePorcentaje.innerText = porcentaje > 0 ? `+${porcentaje}%` : `${porcentaje}%`;

    // Colorear el porcentaje (verde si sube, rojo si baja, gris si 0)
    if (porcentaje > 0) {
        badgePorcentaje.className = "text-xs font-bold px-2 py-1 rounded-full border border-orange-200 bg-orange-50 text-orange-600";
    } else if (porcentaje < 0) {
        badgePorcentaje.className = "text-xs font-bold px-2 py-1 rounded-full border border-pink-200 bg-pink-50 text-pink-600";
    } else {
        badgePorcentaje.className = "text-xs font-bold px-2 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-500";
    }

    // Actualizar Acción Discreta y LÓGICA DE COLORES DEL TEXTO
    badgeAccion.innerText = accion;
    
    if (accion <= 2) {
        // ZONA ROSA (Descuentos)
        badgeAccion.className = "text-sm font-bold px-2.5 py-0.5 rounded bg-pink-200 text-pink-800";
        textoExplicativo.innerText = "Descuento estratégico activado por alta antelación y baja ocupación proyectada. El objetivo es estimular la demanda temprana.";
    } else if (accion <= 5) {
        // ZONA ROJA (Base)
        badgeAccion.className = "text-sm font-bold px-2.5 py-0.5 rounded bg-rose-500 text-white";
        textoExplicativo.innerText = "Tarifa base neutra. El entorno presenta condiciones de equilibrio normal entre la demanda esperada y la capacidad disponible.";
    } else {
        // ZONA NARANJA (Alcista)
        badgeAccion.className = "text-sm font-bold px-2.5 py-0.5 rounded bg-orange-500 text-white";
        textoExplicativo.innerText = "Recomendación de Yield Management alcista por escasez crítica de inventario. Se prioriza el margen marginal por asiento.";
    }

    actualizarCursorMapa(dias, asientos);
}

// --- DIBUJAR EL MAPA DE CALOR ---
function dibujarMapaDeCalor() {
    // Configurar alta resolución para el canvas
    canvas.width = MAX_DIAS + 1;
    canvas.height = CAPACIDAD + 1;

    // Rellenar el canvas pintando pixel a pixel leyendo el Cerebro
    for (let d = 0; d <= MAX_DIAS; d++) {
        for (let a = 0; a <= CAPACIDAD; a++) {
            const clave = `${d}_${a}`;
            const accion = typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[clave] !== undefined ? CEREBRO_IA[clave] : 4;
            
            ctx.fillStyle = obtenerColor(accion);
            // Invertimos el eje Y para que 100 plazas esté arriba y 0 abajo
            ctx.fillRect(d, CAPACIDAD - a, 1, 1);
        }
    }
}

// --- POSICIONAR EL CÍRCULO EN EL MAPA ---
function actualizarCursorMapa(dias, asientos) {
    if(!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const xRatio = rect.width / (MAX_DIAS + 1);
    const yRatio = rect.height / (CAPACIDAD + 1);

    // Calcular posición X e Y invertida en píxeles reales de la pantalla
    const posX = rect.left + (dias * xRatio) + (xRatio / 2);
    const posY = rect.top + ((CAPACIDAD - asientos) * yRatio) + (yRatio / 2);

    cursorIndicador.style.display = "block";
    // Restamos 8px para centrar el círculo de 16x16 (w-4 h-4 de tailwind)
    cursorIndicador.style.left = `${posX - 8}px`;
    cursorIndicador.style.top = `${posY - 8}px`;
}

// --- EVENT LISTENERS ---
sliderDias.addEventListener("input", actualizarDashboard);
sliderAsientos.addEventListener("input", actualizarDashboard);

// Permitir hacer click en el canvas para mover los sliders automáticamente
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xRatio = rect.width / (MAX_DIAS + 1);
    const yRatio = rect.height / (CAPACIDAD + 1);

    const clickedDias = Math.floor(x / xRatio);
    const clickedAsientos = CAPACIDAD - Math.floor(y / yRatio);

    // Evitar que se salgan de rango
    sliderDias.value = Math.max(0, Math.min(MAX_DIAS, clickedDias));
    sliderAsientos.value = Math.max(0, Math.min(CAPACIDAD, clickedAsientos));

    actualizarDashboard();
});

// Actualizar posición del cursor si se cambia el tamaño de la ventana
window.addEventListener("resize", () => {
    const dias = parseInt(sliderDias.value);
    const asientos = parseInt(sliderAsientos.value);
    actualizarCursorMapa(dias, asientos);
});

// --- INICIALIZACIÓN ---
window.onload = () => {
    dibujarMapaDeCalor();
    actualizarDashboard();
};