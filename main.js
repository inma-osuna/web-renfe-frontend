const ACCIONES_INFO = {
  0: { mult: 0.80, label: "Descuento (-20%)" },
  1: { mult: 0.85, label: "Descuento (-15%)" },
  2: { mult: 0.90, label: "Descuento (-10%)" },
  3: { mult: 0.95, label: "Descuento (-5%)" },
  4: { mult: 1.00, label: "Neutro (0%)" },
  5: { mult: 1.05, label: "Recargo (+5%)" },
  6: { mult: 1.10, label: "Recargo (+10%)" },
  7: { mult: 1.15, label: "Yield Alto (+15%)" },
  8: { mult: 1.20, label: "Premium (+20%)" }
};

const D = {
  selectorRuta: document.getElementById("selector_ruta"),
  sliderDias: document.getElementById("slider_dias"),
  sliderAsientos: document.getElementById("slider_asientos"),
  txtDias: document.getElementById("txt_dias"),
  txtAsientos: document.getElementById("txt_asientos"),
  kpiPrecioBase: document.getElementById("kpi_precio_base"),
  kpiTarifaMaxima: document.getElementById("kpi_tarifa_maxima"),
  kpiMultiplicador: document.getElementById("kpi_multiplicador"),
  kpiDescAccion: document.getElementById("kpi_desc_accion"),
  kpiPrecioFinal: document.getElementById("kpi_precio_final"),
  kpiVariacion: document.getElementById("kpi_variacion"),
  bannerGob: document.getElementById("banner_gobernanza"),
  titGob: document.getElementById("titulo_gobernanza"),
  descGob: document.getElementById("desc_gobernanza"),
  iconoGob: document.getElementById("icono_gobernanza")
};

document.addEventListener("DOMContentLoaded", () => {
  if (typeof CEREBRO_IA === "undefined") {
    document.getElementById("status_cerebro").textContent = "Error: Sin Cerebro";
    document.getElementById("status_cerebro").className = "text-red-300 font-bold";
    return;
  }
  
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
  const precioBase = data.precios_base[dias] || 60;
  const tarifaMax = data.tarifa_maxima || 250;

  // LÓGICA DE GOBERNANZA
  const precioCrudo = precioBase * info.mult;
  let precioFinal = precioCrudo;
  let veto = false;

  if (precioCrudo > tarifaMax) {
    precioFinal = tarifaMax;
    veto = true;
  }

  D.kpiPrecioBase.textContent = precioBase.toFixed(2);
  D.kpiTarifaMaxima.textContent = tarifaMax.toFixed(2);
  D.kpiMultiplicador.textContent = info.mult.toFixed(2) + "x";
  D.kpiDescAccion.textContent = info.label;
  D.kpiPrecioFinal.textContent = precioFinal.toFixed(2);

  const variacion = ((precioFinal - precioBase) / precioBase) * 100;
  D.kpiVariacion.textContent = `${variacion > 0 ? '+' : ''}${variacion.toFixed(1)}% vs tarifa base`;

  // UI ALARMA
  if (veto) {
    D.bannerGob.classList.remove("hidden", "border-emerald-400", "bg-emerald-50");
    D.bannerGob.classList.add("border-red-400", "bg-red-50", "text-red-900");
    D.iconoGob.textContent = "🛑";
    D.titGob.textContent = "LÍMITE REGULADO SUPERADO - PRECIO CAPADO";
    D.descGob.textContent = `La IA pidió ${precioCrudo.toFixed(2)}€ pero la normativa impide superar ${tarifaMax.toFixed(2)}€. Se aplica el tope.`;
  } else {
    D.bannerGob.classList.remove("hidden", "border-red-400", "bg-red-50");
    D.bannerGob.classList.add("border-emerald-400", "bg-emerald-50", "text-emerald-900");
    D.iconoGob.textContent = "✅";
    D.titGob.textContent = "TARIFA DENTRO DE LOS MÁRGENES LEGALES";
    D.descGob.textContent = `El precio (${precioFinal.toFixed(2)}€) respeta la regulación máxima del corredor (${tarifaMax.toFixed(2)}€).`;
  }

  renderPlotly(data, dias, asientos, cambioRuta);
}

function renderPlotly(data, diasActual, asientosActual, refrescarTodo) {
  // CLAVE PARA QUE NO SE SALGAN LOS GRÁFICOS
  const config = { responsive: true, displayModeBar: false };

  if (refrescarTodo) {
    // 1. Heatmap
    const zValues = [];
    for (let d = 0; d <= 30; d++) {
      const fila = [];
      for (let a = 0; a <= 100; a++) {
        fila.push(data.politica[`${d}_${a}`] ?? 4);
      }
      zValues.push(fila);
    }
    
    Plotly.react('grafico_heatmap', [{
      z: zValues, 
      x: Array.from({length: 101}, (_, i) => i), 
      y: Array.from({length: 31}, (_, i) => i),
      type: 'heatmap', 
      // ESCALA DE COLORES: ROSA A NARANJA
      colorscale: [
        [0.0, '#fce7f3'],  // Rosa clarito (Descuentos)
        [0.5, '#f472b6'],  // Rosa intenso (Base)
        [1.0, '#ea580c']   // Naranja fuerte (Premium)
      ], 
      zmin: 0, zmax: 8,
      colorbar: { thickness: 12 }
    }, {
      x: [asientosActual], y: [diasActual], mode: 'markers', name: 'Estado Actual',
      marker: { color: '#ffffff', size: 10, line: { color: '#ea580c', width: 2 } }
    }], { 
      autosize: true,
      margin: { t: 15, r: 15, b: 35, l: 45 }, 
      xaxis: { title: 'Plazas Libres' }, 
      yaxis: { title: 'Días Antelación' },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      showlegend: false
    }, config);

    // 2. Curva
    const diasX = Array.from({ length: 31 }, (_, i) => i);
    const preY = diasX.map(d => data.precios_base[d] || 60);
    
    Plotly.newPlot('grafico_curva', [{
      x: diasX, y: preY, type: 'scatter', mode: 'lines', name: 'Tarifa Base', 
      line: { color: '#f472b6', width: 3 } // Línea rosa
    }, {
      x: [0, 30], y: [data.tarifa_maxima, data.tarifa_maxima], type: 'scatter', mode: 'lines',
      name: 'Tope Legal', line: { color: '#ea580c', dash: 'dash', width: 2 } // Línea naranja a trazos
    }, {
      x: [diasActual], y: [data.precios_base[diasActual]], type: 'scatter', mode: 'markers', name: 'Día Actual',
      marker: { color: '#ea580c', size: 10, line: { color: '#ffffff', width: 2 } } // Punto naranja
    }], { 
      autosize: true,
      margin: { t: 15, r: 15, b: 35, l: 45 },
      xaxis: { title: 'Días Antelación' },
      yaxis: { title: 'Precio (€)' },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      showlegend: false 
    }, config);
  } else {
    Plotly.restyle('grafico_heatmap', { 'x': [[asientosActual]], 'y': [[diasActual]] }, [1]);
    Plotly.restyle('grafico_curva', { 'x': [[diasActual]], 'y': [[data.precios_base[diasActual]]] }, [2]);
  }
}