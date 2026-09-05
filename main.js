// DICCIONARIO Y LÓGICA DE IDIOMA
let lang = 'es';

const i18n = {
  es: {
    tab_dashboard: "Dashboard", tab_docs: "Documentación Técnica", btn_exportar: "Exportar Reporte",
    tit_params: "Parámetros del Entorno", lbl_ruta: "Corredor Ferroviario",
    lbl_dias: "Días para la salida", lbl_plazas: "Inventario", lbl_d: "d", lbl_pl: "pl",
    tit_recom: "Recomendación del Modelo", lbl_mult: "Multiplicador de Precio", lbl_accion: "Acción Discreta:",
    kpi_tit_base: "Tarifa Base (Día actual)", kpi_tit_techo: "Techo Histórico",
    kpi_tit_var: "Variación Aplicada", kpi_tit_final: "Precio Final Cliente",
    tit_heatmap: "Mapa de Política: Random Forest", tit_curva: "Proyección de Tarifa Base",
    leg_1: "Descuentos", leg_2: "Neutro", leg_3: "Yield alcista",
    tit_gob: "VETO POR MÁXIMO HISTÓRICO", text_capado: "CAPADO AL LÍMITE",
    docs_h2: "Arquitectura del Motor de Precios",
    docs_p: "Especificaciones técnicas del despliegue del modelo predictivo y reglas de negocio. Este dashboard interactúa con el objeto JSON <code class='font-mono text-red-500 bg-red-50 px-1.5 py-0.5 rounded'>CEREBRO_IA</code> exportado en tiempo real.",
    docs_t1: "Pipeline de Datos y Big Data", docs_d1: "El entrenamiento del agente de aprendizaje por refuerzo y el procesamiento masivo de tarifas históricas se ha ejecutado utilizando un entorno distribuido en <strong>PySpark</strong>.",
    docs_t2: "Modelo de Machine Learning", docs_d2: "El núcleo emplea un <strong>Random Forest Regressor</strong> para aproximar los Q-Values. El <em>Espacio de Estados</em> es un plano continuo normalizado [0, 1] y evalúa Lead Time y capacidad.",
    docs_t3: "Espacio de Acciones Discretas", docs_d3: "El agente selecciona sobre 9 acciones que varían el precio. El espectro abarca desde descuentos del <strong>0.80x (-20%)</strong> hasta recargos premium del <strong>1.20x (+20%)</strong>.",
    docs_t4: "Gobernanza y Límite Histórico", docs_d4: "Reglas de negocio estrictas. Cualquier salida del algoritmo que sugiera una tarifa superior al <strong>Techo Histórico</strong> de la ruta es automáticamente truncada al límite.",
    plot_x_h: "Lead Time (Días)", plot_y_h: "Asientos Disponibles", plot_x_c: "Días Antelación", plot_y_c: "Precio (€)"
  },
  en: {
    tab_dashboard: "Dashboard", tab_docs: "Technical Docs", btn_exportar: "Export Report",
    tit_params: "Environment Parameters", lbl_ruta: "Railway Corridor",
    lbl_dias: "Days to departure", lbl_plazas: "Inventory", lbl_d: "d", lbl_pl: "sts",
    tit_recom: "Model Recommendation", lbl_mult: "Price Multiplier", lbl_accion: "Discrete Action:",
    kpi_tit_base: "Base Fare (Current Day)", kpi_tit_techo: "Historical Ceiling",
    kpi_tit_var: "Applied Variation", kpi_tit_final: "Final Client Price",
    tit_heatmap: "Policy Map: Random Forest", tit_curva: "Base Fare Projection",
    leg_1: "Discounts", leg_2: "Neutral", leg_3: "Bullish Yield",
    tit_gob: "VETO BY HISTORICAL MAXIMUM", text_capado: "CAPPED AT LIMIT",
    docs_h2: "Pricing Engine Architecture",
    docs_p: "Technical specs for the deployment of the predictive model and business rules. This dashboard interacts with the JSON object <code class='font-mono text-red-500 bg-red-50 px-1.5 py-0.5 rounded'>CEREBRO_IA</code> exported in real-time.",
    docs_t1: "Data Pipeline & Big Data", docs_d1: "The training of the reinforcement learning agent and the massive processing of historical fares was executed using a distributed environment in <strong>PySpark</strong>.",
    docs_t2: "Machine Learning Model", docs_d2: "The core uses a <strong>Random Forest Regressor</strong> to approximate Q-Values. The <em>State Space</em> is a continuous normalized plane [0, 1] evaluating Lead Time and capacity.",
    docs_t3: "Discrete Action Space", docs_d3: "The agent selects from 9 actions varying the price. The spectrum ranges from <strong>0.80x (-20%)</strong> discounts to premium surcharges of <strong>1.20x (+20%)</strong>.",
    docs_t4: "Governance & Historical Limit", docs_d4: "Strict business rules. Any algorithm output suggesting a fare above the route's <strong>Historical Ceiling</strong> is automatically truncated to the limit.",
    plot_x_h: "Lead Time (Days)", plot_y_h: "Available Seats", plot_x_c: "Days in Advance", plot_y_c: "Price (€)"
  }
};

const ACCIONES_INFO = {
  es: {
    0: { mult: 0.80, label: "Descuento agresivo para estimular la demanda ante exceso de inventario.", badge: "-20%" },
    1: { mult: 0.85, label: "Descuento alto para corregir desvíos en la curva de reservas.", badge: "-15%" },
    2: { mult: 0.90, label: "Descuento moderado, incentivo de compra temprana.", badge: "-10%" },
    3: { mult: 0.95, label: "Ajuste a la baja leve para mantener tracción comercial.", badge: "-5%" },
    4: { mult: 1.00, label: "Tarifa neutra fijada por el modelo para mantener el volumen en la zona de equilibrio.", badge: "0%" },
    5: { mult: 1.05, label: "Ligero recargo por aumento detectado en la presión de demanda.", badge: "+5%" },
    6: { mult: 1.10, label: "Protección de inventario mediante subida de yield management.", badge: "+10%" },
    7: { mult: 1.15, label: "Yield management alcista por escasez de plazas a corto plazo.", badge: "+15%" },
    8: { mult: 1.20, label: "Recargo premium de escasez absoluta. Maximización de ingresos.", badge: "+20%" }
  },
  en: {
    0: { mult: 0.80, label: "Aggressive discount to stimulate demand due to excess inventory.", badge: "-20%" },
    1: { mult: 0.85, label: "High discount to correct deviations in the booking curve.", badge: "-15%" },
    2: { mult: 0.90, label: "Moderate discount, early purchase incentive.", badge: "-10%" },
    3: { mult: 0.95, label: "Slight downward adjustment to maintain commercial traction.", badge: "-5%" },
    4: { mult: 1.00, label: "Neutral fare set by the model to maintain volume in the equilibrium zone.", badge: "0%" },
    5: { mult: 1.05, label: "Slight surcharge due to detected increase in demand pressure.", badge: "+5%" },
    6: { mult: 1.10, label: "Inventory protection via yield management increase.", badge: "+10%" },
    7: { mult: 1.15, label: "Bullish yield management due to short-term seat shortage.", badge: "+15%" },
    8: { mult: 1.20, label: "Absolute scarcity premium surcharge. Revenue maximization.", badge: "+20%" }
  }
};

const D = {
  selectorRuta: document.getElementById("selector_ruta"),
  sliderDias: document.getElementById("slider_dias"),
  sliderAsientos: document.getElementById("slider_asientos"),
  txtDias: document.getElementById("txt_dias"),
  txtAsientos: document.getElementById("txt_asientos"),
  sbPct: document.getElementById("sb_pct"),
  sbMult: document.getElementById("sb_multiplicador"),
  sbAccion: document.getElementById("sb_accion"),
  sbDesc: document.getElementById("sb_desc"),
  kpiBase: document.getElementById("kpi_base"),
  kpiTecho: document.getElementById("kpi_techo"),
  kpiVarTexto: document.getElementById("kpi_var_texto"),
  kpiFinal: document.getElementById("kpi_final"),
  bannerGob: document.getElementById("banner_gobernanza"),
  titGob: document.getElementById("titulo_gobernanza"),
  descGob: document.getElementById("desc_gobernanza")
};

// EXPORTAR REPORTE
window.exportarReporte = function() {
  const ruta = D.selectorRuta.value;
  const dias = D.sliderDias.value;
  const asientos = D.sliderAsientos.value;
  const data = CEREBRO_IA[ruta];
  const accion = data.politica[`${dias}_${asientos}`] ?? 4;
  const info = ACCIONES_INFO[lang][accion];
  const precioBase = data.precios_base[String(dias)] || 60;
  
  // Techo histórico real
  const tarifaMax = data.tarifa_maxima || 250;
  
  const precioCrudo = precioBase * info.mult;
  const precioFinal = precioCrudo > tarifaMax ? tarifaMax : precioCrudo;
  const veto = precioCrudo > tarifaMax ? "SI (PRECIO LIMITADO)" : "NO";

  const texto = `=========================================\n` +
                `RENFE RM - REPORTE DE DYNAMIC PRICING\n` +
                `=========================================\n` +
                `Fecha Generación: ${new Date().toLocaleString()}\n` +
                `Corredor Ferroviario: ${ruta}\n\n` +
                `[ PARÁMETROS DEL ENTORNO ]\n` +
                `Lead Time: ${dias} días\n` +
                `Inventario Remanente: ${asientos} plazas\n\n` +
                `[ RECOMENDACIÓN DEL MODELO IA ]\n` +
                `Acción Discreta: ${accion}\n` +
                `Multiplicador Aplicado: ${info.mult.toFixed(2)}x\n` +
                `Tarifa Base Histórica: ${precioBase.toFixed(2)} €\n\n` +
                `[ GOBERNANZA COMERCIAL ]\n` +
                `Techo Histórico Aplicable: ${tarifaMax.toFixed(2)} €\n` +
                `Máximo Histórico Rebasado: ${veto}\n\n` +
                `[ PRECIO FINAL CLIENTE ]\n` +
                `Tarifa Final Recomendada: ${precioFinal.toFixed(2)} €\n` +
                `=========================================`;

  const blob = new Blob([texto], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Renfe_Reporte_${ruta}_D${dias}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// CAMBIAR IDIOMA
window.setLang = function(l) {
  lang = l;
  if (lang === 'es') {
    document.getElementById('btn_es').className = "px-3 py-1.5 bg-gray-100 text-gray-800 transition-colors";
    document.getElementById('btn_en').className = "px-3 py-1.5 text-gray-400 hover:bg-gray-50 transition-colors";
  } else {
    document.getElementById('btn_en').className = "px-3 py-1.5 bg-gray-100 text-gray-800 transition-colors";
    document.getElementById('btn_es').className = "px-3 py-1.5 text-gray-400 hover:bg-gray-50 transition-colors";
  }
  
  Object.keys(i18n[lang]).forEach(key => {
    const el = document.getElementById(key);
    if(el) el.innerHTML = i18n[lang][key];
  });
  
  update(true);
};

// PESTAÑAS
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
  const info = ACCIONES_INFO[lang][accion];
  const precioBase = data.precios_base[String(dias)] || 60;
  
  // Se restaura el Techo Histórico de la ruta
  const tarifaMax = data.tarifa_maxima || 250; 

  const precioCrudo = precioBase * info.mult;
  let precioFinal = precioCrudo;
  let veto = false;

  if (precioCrudo > tarifaMax) {
    precioFinal = tarifaMax;
    veto = true;
  }

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

  D.kpiBase.textContent = precioBase.toFixed(2);
  D.kpiTecho.textContent = tarifaMax.toFixed(2);
  D.kpiFinal.textContent = precioFinal.toFixed(2);

  const variacion = ((precioFinal - precioBase) / precioBase) * 100;
  
  if (veto) {
    D.kpiVarTexto.innerHTML = `<span class="text-red-600 text-sm font-bold bg-red-50 px-2 py-1 rounded">${i18n[lang].text_capado}</span>`;
    D.descGob.innerHTML = lang === 'es' 
      ? `La IA intentó aplicar un recargo, superando el Techo Histórico de <b>${tarifaMax.toFixed(2)}€</b>.`
      : `AI attempted a surcharge, exceeding the Historical Ceiling of <b>${tarifaMax.toFixed(2)}€</b>.`;
    D.bannerGob.classList.remove("hidden");
  } else {
    D.kpiVarTexto.innerHTML = `<span class="${variacion > 0 ? 'text-orange-500' : variacion < 0 ? 'text-emerald-500' : 'text-gray-500'}">
      ${variacion > 0 ? '+' : ''}${variacion.toFixed(1)}%
    </span>`;
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
    
    Plotly.react('grafico_heatmap', [{
      z: zValues, x: Array.from({length: 31}, (_, i) => i), y: Array.from({length: 101}, (_, i) => i).reverse(),
      type: 'heatmap', 
      colorscale: [[0.0, '#fbcfe8'], [0.33, '#fbcfe8'], [0.33, '#ef4444'], [0.66, '#ef4444'], [0.66, '#ea580c'], [1.0, '#ea580c']], 
      zmin: 0, zmax: 8, showscale: false
    }, {
      x: [diasActual], y: [asientosActual], mode: 'markers', name: 'Actual',
      marker: { color: '#ffffff', size: 12, line: { color: '#000000', width: 2 } }
    }], { 
      autosize: true, margin: { t: 5, r: 5, b: 35, l: 35 }, 
      xaxis: { title: i18n[lang].plot_x_h }, yaxis: { title: i18n[lang].plot_y_h },
      paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', showlegend: false
    }, config);

    const diasX = Array.from({ length: 31 }, (_, i) => i);
    const preY = diasX.map(d => data.precios_base[String(d)] || 60);
    
    Plotly.newPlot('grafico_curva', [{
      x: diasX, y: preY, type: 'scatter', mode: 'lines', line: { color: '#ef4444', width: 3 }
    }, {
      // Línea horizontal que marca el techo máximo legal
      x: [0, 30], y: [data.tarifa_maxima, data.tarifa_maxima], type: 'scatter', mode: 'lines',
      line: { color: '#ea580c', dash: 'dash', width: 2 }
    }, {
      x: [diasActual], y: [data.precios_base[String(diasActual)] || 60], type: 'scatter', mode: 'markers',
      marker: { color: '#ea580c', size: 10, line: { color: '#ffffff', width: 2 } }
    }], { 
      autosize: true, margin: { t: 5, r: 5, b: 35, l: 35 },
      xaxis: { title: i18n[lang].plot_x_c }, yaxis: { title: i18n[lang].plot_y_c },
      paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', showlegend: false 
    }, config);
  } else {
    Plotly.restyle('grafico_heatmap', { 'x': [[diasActual]], 'y': [[asientosActual]] }, [1]);
    Plotly.restyle('grafico_curva', { 'x': [[diasActual]], 'y': [[data.precios_base[String(diasActual)] || 60]] }, [2]);
  }
}