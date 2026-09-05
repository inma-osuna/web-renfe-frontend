/**
 * RENFE Dynamic Pricing Engine - Frontend Controller
 * Conecta los controles con el modelo de decisión CEREBRO_IA y renderiza las políticas en Plotly.
 */

// Mapeo canónico de las 9 acciones discretas del entorno de precios Renfe
const ACCIONES_INFO = {
  0: { mult: 0.80, label: "Desc. Agresivo (-20%)", color: "#10b981", badge: "bg-emerald-100 text-emerald-800" },
  1: { mult: 0.85, label: "Desc. Alto (-15%)", color: "#34d399", badge: "bg-emerald-100 text-emerald-800" },
  2: { mult: 0.90, label: "Desc. Medio (-10%)", color: "#6ee7b7", badge: "bg-emerald-100 text-emerald-800" },
  3: { mult: 0.95, label: "Desc. Leve (-5%)", color: "#a7f3d0", badge: "bg-teal-100 text-teal-800" },
  4: { mult: 1.00, label: "Tarifa Base Neutra (0%)", color: "#94a3b8", badge: "bg-slate-200 text-slate-800" },
  5: { mult: 1.05, label: "Recargo Leve (+5%)", color: "#fed7aa", badge: "bg-amber-100 text-amber-800" },
  6: { mult: 1.10, label: "Recargo Medio (+10%)", color: "#fdba74", badge: "bg-orange-100 text-orange-800" },
  7: { mult: 1.15, label: "Yield Alto (+15%)", color: "#fb923c", badge: "bg-orange-200 text-orange-900" },
  8: { mult: 1.20, label: "Yield Premium (+20%)", color: "#ef4444", badge: "bg-red-100 text-red-800" }
};

// Elementos del DOM
const selectorRuta = document.getElementById("selector_ruta");
const sliderDias = document.getElementById("slider_dias");
const sliderAsientos = document.getElementById("slider_asientos");
const txtDias = document.getElementById("txt_dias");
const txtAsientos = document.getElementById("txt_asientos");
const txtEstadoNorm = document.getElementById("txt_estado_norm");
const txtClaveMatriz = document.getElementById("txt_clave_matriz");

const kpiPrecioBase = document.getElementById("kpi_precio_base");
const kpiLeadTime = document.getElementById("kpi_lead_time");
const kpiBadgeAccion = document.getElementById("kpi_badge_accion");
const kpiMultiplicador = document.getElementById("kpi_multiplicador");
const kpiDescAccion = document.getElementById("kpi_desc_accion");
const kpiIdxAccion = document.getElementById("kpi_idx_accion");
const kpiPrecioFinal = document.getElementById("kpi_precio_final");
const kpiVariacion = document.getElementById("kpi_variacion");
const kpiPrecioCrudo = document.getElementById("kpi_precio_crudo");
const kpiTarifaMaxima = document.getElementById("kpi_tarifa_maxima");
const kpiMargen = document.getElementById("kpi_margen");

const bannerGobernanza = document.getElementById("banner_gobernanza");
const iconoGobernanza = document.getElementById("icono_gobernanza");
const tituloGobernanza = document.getElementById("titulo_gobernanza");
const descGobernanza = document.getElementById("desc_gobernanza");

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  if (typeof CEREBRO_IA === "undefined" || !CEREBRO_IA || Object.keys(CEREBRO_IA).length === 0) {
    document.getElementById("status_cerebro").textContent = "Error: cerebro.js no detectado";
    document.getElementById("status_cerebro").className = "text-xs text-red-300 font-bold";
    console.error("No se ha encontrado el objeto CEREBRO_IA. Asegúrate de que cerebro.js está cargado correctamente.");
    return;
  }

  poblarSelectorRutas();
  registrarEventos();
  actualizarSimulacion(true);
});

function poblarSelectorRutas() {
  selectorRuta.innerHTML = "";
  const rutas = Object.keys(CEREBRO_IA);

  rutas.forEach((clave) => {
    const partes = clave.split("_");
    const nombreLegible = partes.length === 2 
      ? `${formatearNombre(partes[0])} ➔ ${formatearNombre(partes[1])}`
      : clave;

    const opt = document.createElement("option");
    opt.value = clave;
    opt.textContent = nombreLegible;
    selectorRuta.appendChild(opt);
  });
}

function formatearNombre(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function registrarEventos() {
  selectorRuta.addEventListener("change", () => actualizarSimulacion(true));
  
  sliderDias.addEventListener("input", () => {
    txtDias.textContent = sliderDias.value;
    actualizarSimulacion(false);
  });

  sliderAsientos.addEventListener("input", () => {
    txtAsientos.textContent = sliderAsientos.value;
    actualizarSimulacion(false);
  });
}

function actualizarSimulacion(cambioRuta = false) {
  const ruta = selectorRuta.value;
  const dias = parseInt(sliderDias.value, 10);
  const asientos = parseInt(sliderAsientos.value, 10);
  const datosRuta = CEREBRO_IA[ruta];

  if (!datosRuta) return;

  // 1. Textos y claves de estado
  txtDias.textContent = dias;
  txtAsientos.textContent = asientos;
  txtEstadoNorm.textContent = `[${(dias / 30).toFixed(2)}, ${(asientos / 100).toFixed(2)}]`;
  const claveEstado = `${dias}_${asientos}`;
  txtClaveMatriz.textContent = claveEstado;

  // 2. Extracción de decisiones y precios base
  const accion = datosRuta.politica[claveEstado] !== undefined ? datosRuta.politica[claveEstado] : 4;
  const infoAccion = ACCIONES_INFO[accion] || ACCIONES_INFO[4];
  const precioBase = datosRuta.precios_base[String(dias)] || datosRuta.precios_base[dias] || 60.0;
  const tarifaMax = datosRuta.tarifa_maxima || 250.0;

  // 3. Cálculo de la tarifa y lógica de gobernanza
  const precioCrudo = precioBase * infoAccion.mult;
  let precioFinal = precioCrudo;
  let vetoActivado = false;

  if (precioCrudo > tarifaMax) {
    precioFinal = tarifaMax;
    vetoActivado = true;
  }

  // 4. Actualización de KPIs en el DOM
  kpiPrecioBase.textContent = precioBase.toFixed(2);
  kpiLeadTime.textContent = `${dias} días antes`;

  kpiBadgeAccion.textContent = `Acción ${accion}`;
  kpiBadgeAccion.className = `px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide ${infoAccion.badge}`;
  kpiMultiplicador.textContent = infoAccion.mult.toFixed(2);
  kpiDescAccion.textContent = infoAccion.label;
  kpiIdxAccion.textContent = accion;

  kpiPrecioFinal.textContent = precioFinal.toFixed(2);
  kpiPrecioCrudo.textContent = precioCrudo.toFixed(2);

  const deltaPct = ((precioFinal - precioBase) / precioBase) * 100;
  if (deltaPct > 0) {
    kpiVariacion.textContent = `▲ +${deltaPct.toFixed(1)}% vs base`;
    kpiVariacion.className = "text-xs font-semibold text-amber-600 mt-1";
  } else if (deltaPct < 0) {
    kpiVariacion.textContent = `▼ ${deltaPct.toFixed(1)}% vs base`;
    kpiVariacion.className = "text-xs font-semibold text-emerald-600 mt-1";
  } else {
    kpiVariacion.textContent = `■ 0.0% (Tarifa Neutra)`;
    kpiVariacion.className = "text-xs font-semibold text-slate-500 mt-1";
  }

  kpiTarifaMaxima.textContent = tarifaMax.toFixed(2);
  const margen = tarifaMax - precioFinal;
  kpiMargen.textContent = margen.toFixed(2);

  // 5. Renderizado de banner de gobernanza
  actualizarBannerGobernanza(vetoActivado, precioCrudo, tarifaMax);

  // 6. Gráficos interactivos
  renderizarHeatmap(datosRuta, dias, asientos, cambioRuta);
  if (cambioRuta) {
    renderizarCurvaPrecios(datosRuta, dias);
  } else {
    actualizarPuntoCurvaPrecios(dias, precioBase);
  }
}

function actualizarBannerGobernanza(vetoActivado, precioCrudo, tarifaMax) {
  if (vetoActivado) {
    bannerGobernanza.className = "rounded-xl border border-red-300 bg-red-50 p-4 shadow-sm text-red-900";
    iconoGobernanza.textContent = "🛑";
    tituloGobernanza.textContent = "VETO DE GOBERNANZA COMERCIAL ACTIVADO";
    descGobernanza.textContent = `La IA recomendó ${precioCrudo.toFixed(2)}€, superando el techo regulatorio legal de ${tarifaMax.toFixed(2)}€. Se aplica recorte forzoso al límite máximo permitido.`;
    bannerGobernanza.classList.remove("hidden");
  } else {
    bannerGobernanza.className = "rounded-xl border border-emerald-300 bg-emerald-50 p-4 shadow-sm text-emerald-900";
    iconoGobernanza.textContent = "✅";
    tituloGobernanza.textContent = "TARIFACIÓN DINÁMICA CONFORME CON REGULACIÓN";
    descGobernanza.textContent = `El precio calculado opera con total solvencia dentro de la banda tarifaria autorizada (Techo: ${tarifaMax.toFixed(2)}€).`;
    bannerGobernanza.classList.remove("hidden");
  }
}

/**
 * Renderiza o actualiza el Heatmap en Plotly
 */
function renderizarHeatmap(datosRuta, leadTimeActual, plazasActual, cambioRuta) {
  const maxDias = 30;
  const maxAsientos = 100;
  
  const zValues = [];
  for (let d = 0; d <= maxDias; d++) {
    const fila = [];
    for (let a = 0; a <= maxAsientos; a++) {
      const val = datosRuta.politica[`${d}_${a}`];
      fila.push(val !== undefined ? val : 4);
    }
    zValues.push(fila);
  }

  // Traza del Heatmap
  const traceHeatmap = {
    z: zValues,
    x: Array.from({ length: maxAsientos + 1 }, (_, i) => i),
    y: Array.from({ length: maxDias + 1 }, (_, i) => i),
    type: 'heatmap',
    colorscale: [
      [0.0, '#10b981'], // Verde (Descuentos)
      [0.375, '#a7f3d0'],
      [0.5, '#94a3b8'],  // Gris neutro (Tarifa Base)
      [0.625, '#fed7aa'],
      [1.0, '#ef4444']   // Rojo (Yield Premium)
    ],
    zmin: 0,
    zmax: 8,
    colorbar: {
      title: 'Acción IA',
      titleside: 'right',
      tickmode: 'array',
      tickvals: [0, 2, 4, 6, 8],
      ticktext: ['-20%', '-10%', 'Base', '+10%', '+20%'],
      len: 0.9,
      thickness: 14
    },
    hoverongaps: false
  };

  // Marcador del estado actual
  const tracePunto = {
    x: [plazasActual],
    y: [leadTimeActual],
    mode: 'markers',
    type: 'scatter',
    marker: {
      color: '#ffffff',
      size: 14,
      symbol: 'circle',
      line: { color: '#5c2483', width: 3 }
    },
    name: 'Estado Actual',
    hoverinfo: 'name+x+y'
  };

  const layout = {
    margin: { t: 20, r: 20, b: 40, l: 45 },
    xaxis: { title: 'Plazas Libres (Inventario)', range: [0, 100], dtick: 20 },
    yaxis: { title: 'Días hasta Salida (Lead Time)', range: [0, 30], dtick: 5 },
    showlegend: false,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent'
  };

  const config = { responsive: true, displayModeBar: false };

  Plotly.react('grafico_heatmap', [traceHeatmap, tracePunto], layout, config);
}

/**
 * Renderiza la curva histórica de precios por Lead Time
 */
function renderizarCurvaPrecios(datosRuta, leadTimeActual) {
  const diasX = Array.from({ length: 31 }, (_, i) => i);
  const preciosY = diasX.map(d => datosRuta.precios_base[String(d)] || datosRuta.precios_base[d] || 60);

  const traceCurva = {
    x: diasX,
    y: preciosY,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Precio Base',
    line: { color: '#5c2483', width: 2.5 },
    marker: { size: 5 }
  };

  const traceMaximo = {
    x: [0, 30],
    y: [datosRuta.tarifa_maxima, datosRuta.tarifa_maxima],
    type: 'scatter',
    mode: 'lines',
    name: 'Techo Legal',
    line: { color: '#ef4444', dash: 'dash', width: 2 }
  };

  const tracePuntoActual = {
    x: [leadTimeActual],
    y: [datosRuta.precios_base[String(leadTimeActual)] || 60],
    type: 'scatter',
    mode: 'markers',
    name: 'Día Seleccionado',
    marker: { color: '#fb923c', size: 10, line: { color: '#ffffff', width: 2 } }
  };

  const layout = {
    margin: { t: 20, r: 20, b: 40, l: 45 },
    xaxis: { title: 'Días de Antelación', range: [0, 30], dtick: 5 },
    yaxis: { title: 'Tarifa (€)', rangemode: 'tozero' },
    showlegend: true,
    legend: { orientation: 'h', y: 1.15, x: 0.1 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent'
  };

  const config = { responsive: true, displayModeBar: false };

  Plotly.newPlot('grafico_curva', [traceCurva, traceMaximo, tracePuntoActual], layout, config);
}

function actualizarPuntoCurvaPrecios(leadTimeActual, precioBase) {
  Plotly.restyle('grafico_curva', {
    x: [[leadTimeActual]],
    y: [[precioBase]]
  }, [2]);
}