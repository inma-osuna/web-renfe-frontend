const ACCIONES_INFO = {
  0: { mult: 0.80, label: "Desc. Agresivo (-20%)", badge: "bg-emerald-100 text-emerald-800" },
  1: { mult: 0.85, label: "Desc. Alto (-15%)", badge: "bg-emerald-100 text-emerald-800" },
  2: { mult: 0.90, label: "Desc. Medio (-10%)", badge: "bg-emerald-100 text-emerald-800" },
  3: { mult: 0.95, label: "Desc. Leve (-5%)", badge: "bg-teal-100 text-teal-800" },
  4: { mult: 1.00, label: "Base Neutra (0%)", badge: "bg-slate-200 text-slate-800" },
  5: { mult: 1.05, label: "Recargo Leve (+5%)", badge: "bg-amber-100 text-amber-800" },
  6: { mult: 1.10, label: "Recargo Medio (+10%)", badge: "bg-orange-100 text-orange-800" },
  7: { mult: 1.15, label: "Yield Alto (+15%)", badge: "bg-orange-200 text-orange-900" },
  8: { mult: 1.20, label: "Yield Premium (+20%)", badge: "bg-red-100 text-red-800" }
};

const D = {
  selectorRuta: document.getElementById("selector_ruta"),
  sliderDias: document.getElementById("slider_dias"),
  sliderAsientos: document.getElementById("slider_asientos"),
  txtDias: document.getElementById("txt_dias"),
  txtAsientos: document.getElementById("txt_asientos"),
  txtEstadoNorm: document.getElementById("txt_estado_norm"),
  txtClaveMatriz: document.getElementById("txt_clave_matriz"),
  kpiPrecioBase: document.getElementById("kpi_precio_base"),
  kpiLeadTime: document.getElementById("kpi_lead_time"),
  kpiBadgeAccion: document.getElementById("kpi_badge_accion"),
  kpiMultiplicador: document.getElementById("kpi_multiplicador"),
  kpiDescAccion: document.getElementById("kpi_desc_accion"),
  kpiIdxAccion: document.getElementById("kpi_idx_accion"),
  kpiPrecioFinal: document.getElementById("kpi_precio_final"),
  kpiVariacion: document.getElementById("kpi_variacion"),
  kpiPrecioCrudo: document.getElementById("kpi_precio_crudo"),
  kpiTarifaMaxima: document.getElementById("kpi_tarifa_maxima"),
  kpiMargen: document.getElementById("kpi_margen"),
  bannerGob: document.getElementById("banner_gobernanza"),
  titGob: document.getElementById("titulo_gobernanza"),
  descGob: document.getElementById("desc_gobernanza"),
  iconoGob: document.getElementById("icono_gobernanza")
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
  D.txtEstadoNorm.textContent = `[${(dias / 30).toFixed(2)}, ${(asientos / 100).toFixed(2)}]`;
  D.txtClaveMatriz.textContent = `${dias}_${asientos}`;

  const accion = data.politica[`${dias}_${asientos}`] ?? 4;
  const info = ACCIONES_INFO[accion];
  const precioBase = data.precios_base[dias] || 60;
  const tarifaMax = data.tarifa_maxima || 250;

  const precioCrudo = precioBase * info.mult;
  let precioFinal = precioCrudo;
  let veto = false;

  if (precioCrudo > tarifaMax) {
    precioFinal = tarifaMax;
    veto = true;
  }

  D.kpiPrecioBase.textContent = precioBase.toFixed(2);
  D.kpiLeadTime.textContent = `${dias} días antes`;
  D.kpiBadgeAccion.textContent = `Acción ${accion}`;
  D.kpiBadgeAccion.className = `px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide ${info.badge}`;
  D.kpiMultiplicador.textContent = info.mult.toFixed(2);
  D.kpiDescAccion.textContent = info.label;
  D.kpiIdxAccion.textContent = accion;
  D.kpiPrecioFinal.textContent = precioFinal.toFixed(2);
  D.kpiPrecioCrudo.textContent = precioCrudo.toFixed(2);
  D.kpiTarifaMaxima.textContent = tarifaMax.toFixed(2);
  D.kpiMargen.textContent = (tarifaMax - precioFinal).toFixed(2);

  const deltaPct = ((precioFinal - precioBase) / precioBase) * 100;
  if (deltaPct > 0) {
    D.kpiVariacion.textContent = `▲ +${deltaPct.toFixed(1)}% vs base`;
    D.kpiVariacion.className = "text-xs font-semibold text-amber-600 mt-1";
  } else if (deltaPct < 0) {
    D.kpiVariacion.textContent = `▼ ${deltaPct.toFixed(1)}% vs base`;
    D.kpiVariacion.className = "text-xs font-semibold text-emerald-600 mt-1";
  } else {
    D.kpiVariacion.textContent = `■ 0.0% (Tarifa Neutra)`;
    D.kpiVariacion.className = "text-xs font-semibold text-slate-500 mt-1";
  }

  if (veto) {
    D.bannerGob.className = "rounded-xl border border-red-300 bg-red-50 p-4 shadow-sm text-red-900";
    D.iconoGob.textContent = "🛑";
    D.titGob.textContent = "VETO DE GOBERNANZA COMERCIAL ACTIVADO";
    D.descGob.textContent = `La IA recomendó ${precioCrudo.toFixed(2)}€, superando el techo regulatorio legal de ${tarifaMax.toFixed(2)}€. Se aplica recorte forzoso al límite máximo permitido.`;
    D.bannerGob.classList.remove("hidden");
  } else {
    D.bannerGob.className = "rounded-xl border border-emerald-300 bg-emerald-50 p-4 shadow-sm text-emerald-900";
    D.iconoGob.textContent = "✅";
    D.titGob.textContent = "TARIFACIÓN DINÁMICA CONFORME CON REGULACIÓN";
    D.descGob.textContent = `El precio calculado opera con total solvencia dentro de la banda tarifaria autorizada (Techo: ${tarifaMax.toFixed(2)}€).`;
    D.bannerGob.classList.remove("hidden");
  }

  renderPlotly(data, dias, asientos, cambioRuta);
}

function renderPlotly(data, diasActual, asientosActual, refrescarTodo) {
  const config = { responsive: true, displayModeBar: false };

  if (refrescarTodo) {
    const zValues = [];
    for (let d = 0; d <= 30; d++) {
      const fila = [];
      for (let a = 0; a <= 100; a++) {
        fila.push(data.politica[`${d}_${a}`] ?? 4);
      }
      zValues.push(fila);
    }
    
    Plotly.react('grafico_heatmap', [{
      z: zValues, x: Array.from({length: 101}, (_, i) => i), y: Array.from({length: 31}, (_, i) => i),
      type: 'heatmap', 
      colorscale: [[0.0, '#fce7f3'], [0.5, '#f472b6'], [1.0, '#ea580c']], 
      zmin: 0, zmax: 8, colorbar: { thickness: 12 }
    }, {
      x: [asientosActual], y: [diasActual], mode: 'markers',
      marker: { color: '#ffffff', size: 10, line: { color: '#ea580c', width: 2 } }
    }], { 
      autosize: true, margin: { t: 15, r: 15, b: 35, l: 35 }, 
      xaxis: { title: 'Plazas Libres' }, yaxis: { title: 'Días' },
      paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', showlegend: false
    }, config);

    const diasX = Array.from({ length: 31 }, (_, i) => i);
    const preY = diasX.map(d => data.precios_base[d] || 60);
    
    Plotly.newPlot('grafico_curva', [{
      x: diasX, y: preY, type: 'scatter', mode: 'lines', line: { color: '#f472b6', width: 3 }
    }, {
      x: [0, 30], y: [data.tarifa_maxima, data.tarifa_maxima], type: 'scatter', mode: 'lines',
      line: { color: '#ea580c', dash: 'dash', width: 2 }
    }, {
      x: [diasActual], y: [data.precios_base[diasActual]], type: 'scatter', mode: 'markers',
      marker: { color: '#ea580c', size: 10, line: { color: '#ffffff', width: 2 } }
    }], { 
      autosize: true, margin: { t: 15, r: 15, b: 35, l: 35 },
      xaxis: { title: 'Días' }, yaxis: { title: 'Precio (€)' },
      paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', showlegend: false 
    }, config);
  } else {
    Plotly.restyle('grafico_heatmap', { 'x': [[asientosActual]], 'y': [[diasActual]] }, [1]);
    Plotly.restyle('grafico_curva', { 'x': [[diasActual]], 'y': [[data.precios_base[diasActual]]] }, [2]);
  }
}