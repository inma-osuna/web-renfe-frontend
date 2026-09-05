const ACCIONES_INFO = {
  0: { mult: 0.80, label: "Descuento agresivo para estimular la demanda ante exceso de inventario.", badge: "-20%" },
  1: { mult: 0.85, label: "Descuento alto para corregir desvíos en la curva de reservas.", badge: "-15%" },
  2: { mult: 0.90, label: "Descuento moderado, incentivo de compra temprana.", badge: "-10%" },
  3: { mult: 0.95, label: "Ajuste a la baja leve para mantener tracción comercial.", badge: "-5%" },
  4: { mult: 1.00, label: "Tarifa neutra fijada por el modelo para mantener el volumen en la zona de equilibrio.", badge: "0%" },
  5: { mult: 1.05, label: "Ligero recargo por aumento detectado en la presión de demanda.", badge: "+5%" },
  6: { mult: 1.10, label: "Protección de inventario mediante subida de yield management.", badge: "+10%" },
  7: { mult: 1.15, label: "Yield management alcista por escasez de plazas a corto plazo.", badge: "+15%" },
  8: { mult: 1.20, label: "Recargo premium de escasez absoluta. Maximización de ingresos.", badge: "+20%" }
};

// VINCULACIÓN CON EL HTML
const D = {
  selectorRuta: document.getElementById("selector_ruta"),
  sliderDias: document.getElementById("slider_dias"),
  sliderAsientos: document.getElementById("slider_asientos"),
  txtDias: document.getElementById("txt_dias"),
  txtAsientos: document.getElementById("txt_asientos"),
  
  // Panel Lateral Izquierdo
  sbPct: document.getElementById("sb_pct"),
  sbMult: document.getElementById("sb_multiplicador"),
  sbAccion: document.getElementById("sb_accion"),
  sbDesc: document.getElementById("sb_desc"),

  // Cuadritos
  kpiBase: document.getElementById("kpi_base"),
  kpiTecho: document.getElementById("kpi_techo"),
  kpiVarTexto: document.getElementById("kpi_var_texto"),
  kpiFinal: document.getElementById("kpi_final"),

  // Gobernanza
  bannerGob: document.getElementById("banner_gobernanza"),
  titGob: document.getElementById("titulo_gobernanza"),
  descGob: document.getElementById("desc_gobernanza")
};

// FUNCIÓN PARA CAMBIAR ENTRE PESTAÑAS (EXPUESTA GLOBALMENTE)
window.switchTab = function(tab) {
  const vistaDash = document.getElementById('vista_dashboard');
  const vistaDocs = document.getElementById('vista_docs');
  const tabDash = document.getElementById('tab_dashboard');
  const tabDocs = document.getElementById('tab_docs');

  if(tab === 'dashboard') {
    vistaDash.classList.remove('hidden');
    vistaDash.classList.add('flex');
    vistaDocs.classList.add('hidden');
    tabDash.className = "text-red-500 border-b-2 border-red-500 pb-1";
    tabDocs.className = "text-gray-500 hover:text-gray-900 pb-1 transition-colors";
    // Redibujar gráficos para evitar bugs visuales al cambiar de pestaña
    Plotly.Plots.resize('grafico_heatmap');
    Plotly.Plots.resize('grafico_curva');
  } else {
    vistaDash.classList.add('hidden');
    vistaDash.classList.remove('flex');
    vistaDocs.classList.remove('hidden');
    tabDash.className = "text-gray-500 hover:text-gray-900 pb-1 transition-colors";
    tabDocs.className = "text-red-500 border-b-2 border-red-500 pb-1";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (typeof CEREBRO_IA === "undefined") return;
  
  Object.keys(CEREBRO_IA).forEach(ruta => {
    const opt = document.createElement("option");
    opt.value = ruta;
    opt.textContent = ruta.replace("_", " ➔ ");
    D.selectorRuta.appendChild(opt);
  });

  D.selectorRuta.addEventListener("change", () => update(true));
  D.sliderDias.addEventListener("input", () => update(false));
  D.sliderAsientos.addEventListener("input", () => update(false));
  
  update(true);
});

function update(cambioRuta) {
  const ruta = D.selectorRuta.value;
  const dias = parseInt(D.sliderDias.value);
  const asientos = parseInt(D.sliderAsientos.value);
  const data = CEREBRO_IA[ruta];

  D.txtDias.textContent = dias;
  D.txtAsientos.textContent = asientos;

  const accion = data.politica[`${dias}_${asientos}`] ?? 4;
  const info = ACCIONES_INFO[accion];
  const precioBase = data.precios_base[String(dias)] || 60;
  const tarifaMax = data.tarifa_maxima || 250;

  // LÓGICA DE GOBERNANZA: EL PRECIO NUNCA SUPERA EL REGULADO
  const precioCrudo = precioBase * info.mult;
  let precioFinal = precioCrudo;
  let veto = false;

  if (precioCrudo > tarifaMax) {
    precioFinal = tarifaMax;
    veto = true;
  }

  // 1. Actualizar Tarjeta del Sidebar
  D.sbMult.textContent = info.mult.toFixed(2);
  D.sbAccion.textContent = accion;
  D.sbDesc.textContent = info.label;
  D.sbPct.textContent = info.badge;
  
  const isNegative = info.mult < 1;
  const isNeutral = info.mult === 1;
  D.sbPct.className = `text-xs font-bold px-2 py-0.5 rounded-full ${
    isNeutral ? "text-gray-500 bg-gray-100" : 
    isNegative ? "text-red-500 bg-pink-50" : "text-orange-600 bg-orange-50"
  }`;

  // 2. Actualizar Cuadritos Superiores
  D.kpiBase.textContent = precioBase.toFixed(2);
  D.kpiTecho.textContent = tarifaMax.toFixed(2);
  D.kpiFinal.textContent = precioFinal.toFixed(2);

  const variacion = ((precioFinal - precioBase) / precioBase) * 100;
  
  if (veto) {
    D.kpiVarTexto.innerHTML = `<span class="text-red-600 text-sm font-bold bg-red-50 px-2 py-1 rounded">CAPADO AL LÍMITE</span>`;
    D.sbDesc.innerHTML = `<span class="font-bold text-red-600">⚠️ VETO ACTIVO:</span> La IA superó el límite de ${tarifaMax.toFixed(2)}€. Tarifa regulada aplicada.`;
  } else {
    D.kpiVarTexto.innerHTML = `<span class="${variacion > 0 ? 'text-orange-500' : variacion < 0 ? 'text-emerald-500' : 'text-gray-500'}">
      ${variacion > 0 ? '+' : ''}${variacion.toFixed(1)}%
    </span>`;
  }

  // Alarma
  if (veto) {
    D.bannerGob.classList.remove("hidden");
    D.descGob.innerHTML = `La IA determinó un precio óptimo de <b>${precioCrudo.toFixed(2)}€</b> (Base ${precioBase.toFixed(2)}€ x ${info.mult.toFixed(2)}), superando el techo legal de <b>${tarifaMax.toFixed(2)}€</b>.`;
  } else {
    D.bannerGob.classList.add("hidden");
  }

  renderPlotly(data, dias, asientos, cambioRuta);
}

function renderPlotly(data, diasActual, asientosActual, refrescarTodo) {
  const config = { responsive: true, displayModeBar: false };

  if (refrescarTodo) {
    const zValues = [];
    for (let a = 100; a >= 0; a--) {
      const fila = [];
      for (let d = 0; d <= 30; d++) {
        fila.push(data.politica[`${d}_${a}`] ?? 4);
      }
      zValues.push(fila);
    }
    
    // HEATMAP
    Plotly.react('grafico_heatmap', [{
      z: zValues, 
      x: Array.from({length: 31}, (_, i) => i), 
      y: Array.from({length: 101}, (_, i) => i).reverse(),
      type: 'heatmap', 
      colorscale: [
        [0.0, '#fbcfe8'], [0.33, '#fbcfe8'], // Rosa
        [0.33, '#ef4444'], [0.66, '#ef4444'], // Rojo
        [0.66, '#ea580c'], [1.0, '#ea580c']   // Naranja
      ], 
      zmin: 0, zmax: 8,
      showscale: false
    }, {
      x: [diasActual], y: [asientosActual], mode: 'markers', name: 'Estado Actual',
      marker: { color: '#ffffff', size: 12, line: { color: '#000000', width: 2 } }
    }], { 
      autosize: true, 
      margin: { t: 5, r: 5, b: 35, l: 35 }, 
      xaxis: { title: 'Lead Time (Días)' }, 
      yaxis: { title: 'Asientos Disponibles' },
      paper_bgcolor: 'transparent', 
      plot_bgcolor: 'transparent', 
      showlegend: false
    }, config);

    // CURVA DE PRECIOS BASE
    const diasX = Array.from({ length: 31 }, (_, i) => i);
    const preY = diasX.map(d => data.precios_base[String(d)] || 60);
    
    Plotly.newPlot('grafico_curva', [{
      x: diasX, y: preY, type: 'scatter', mode: 'lines', name: 'Tarifa Base',
      line: { color: '#ef4444', width: 3 }
    }, {
      x: [0, 30], y: [data.tarifa_maxima, data.tarifa_maxima], type: 'scatter', mode: 'lines',
      name: 'Techo Legal', line: { color: '#ea580c', dash: 'dash', width: 2 }
    }, {
      x: [diasActual], y: [data.precios_base[String(diasActual)] || 60], type: 'scatter', mode: 'markers', name: 'Actual',
      marker: { color: '#ea580c', size: 10, line: { color: '#ffffff', width: 2 } }
    }], { 
      autosize: true, 
      margin: { t: 5, r: 5, b: 35, l: 35 },
      xaxis: { title: 'Días Antelación' }, 
      yaxis: { title: 'Precio (€)' },
      paper_bgcolor: 'transparent', 
      plot_bgcolor: 'transparent', 
      showlegend: false 
    }, config);
  } else {
    Plotly.restyle('grafico_heatmap', { 'x': [[diasActual]], 'y': [[asientosActual]] }, [1]);
    Plotly.restyle('grafico_curva', { 'x': [[diasActual]], 'y': [[data.precios_base[String(diasActual)] || 60]] }, [2]);
  }
}