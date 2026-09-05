const ACCIONES_INFO = {
  0: { mult: 0.80, label: "Descuento máximo para estimular la demanda ante exceso de inventario.", badge: "-20%" },
  1: { mult: 0.85, label: "Descuento agresivo para corregir desvíos en la curva de reservas.", badge: "-15%" },
  2: { mult: 0.90, label: "Descuento moderado, incentivo de compra temprana.", badge: "-10%" },
  3: { mult: 0.95, label: "Ajuste a la baja leve para mantener tracción comercial.", badge: "-5%" },
  4: { mult: 1.00, label: "Tarifa neutra fijada por el modelo. Zona de equilibrio.", badge: "0%" },
  5: { mult: 1.05, label: "Ligero recargo por aumento detectado en la presión de demanda.", badge: "+5%" },
  6: { mult: 1.10, label: "Protección de inventario mediante subida de yield management.", badge: "+10%" },
  7: { mult: 1.15, label: "Yield management alcista por escasez de plazas a corto plazo.", badge: "+15%" },
  8: { mult: 1.20, label: "Recargo premium de escasez absoluta. Maximización de ingresos.", badge: "+20%" }
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
  kpiIdxAccion: document.getElementById("kpi_idx_accion"),
  kpiVariacion: document.getElementById("kpi_variacion"),
  kpiPrecioFinal: document.getElementById("kpi_precio_final"),
  kpiDescAccion: document.getElementById("kpi_desc_accion"),
  capaGobernanza: document.getElementById("capa_gobernanza")
};

document.addEventListener("DOMContentLoaded", () => {
  if (typeof CEREBRO_IA === "undefined") {
    console.error("cerebro.js no está cargado.");
    return;
  }
  
  Object.keys(CEREBRO_IA).forEach(ruta => {
    const opt = document.createElement("option");
    opt.value = ruta;
    opt.textContent = ruta.replace("_", " a ");
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

  // LÓGICA DEL TECHO REGULADO (Gobernanza)
  const precioCrudo = precioBase * info.mult;
  let precioFinal = precioCrudo;
  let veto = false;

  if (precioCrudo > tarifaMax) {
    precioFinal = tarifaMax;
    veto = true;
  }

  // Actualizar tarjeta izquierda
  D.kpiPrecioBase.textContent = precioBase.toFixed(2);
  D.kpiTarifaMaxima.textContent = tarifaMax.toFixed(2);
  D.kpiMultiplicador.textContent = info.mult.toFixed(2);
  D.kpiIdxAccion.textContent = accion;
  D.kpiPrecioFinal.textContent = precioFinal.toFixed(2);
  
  // Alarma de Veto
  if (veto) {
    D.capaGobernanza.classList.remove("hidden");
    D.kpiDescAccion.innerHTML = `<span class="font-bold text-red-600">LÍMITE REBASADO:</span> La IA pedía ${precioCrudo.toFixed(2)}€ pero la normativa impide superar ${tarifaMax.toFixed(2)}€. Regla de negocio aplicada.`;
    D.kpiVariacion.textContent = "VETADO";
    D.kpiVariacion.className = "text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full";
  } else {
    D.capaGobernanza.classList.add("hidden");
    D.kpiDescAccion.textContent = info.label;
    D.kpiVariacion.textContent = info.badge;
    const isNegative = info.mult < 1;
    const isNeutral = info.mult === 1;
    D.kpiVariacion.className = `text-xs font-bold px-2 py-0.5 rounded-full ${
      isNeutral ? "text-gray-500 bg-gray-100" : 
      isNegative ? "text-red-500 bg-red-50" : "text-orange-600 bg-orange-100"
    }`;
  }

  renderPlotly(data, dias, asientos, cambioRuta);
}

function renderPlotly(data, diasActual, asientosActual, refrescarTodo) {
  if (refrescarTodo) {
    const zValues = [];
    for (let a = 100; a >= 0; a--) {
      const fila = [];
      for (let d = 0; d <= 30; d++) {
        fila.push(data.politica[`${d}_${a}`] ?? 4);
      }
      zValues.push(fila);
    }
    
    // Configuración exacta para que encaje como en la foto
    Plotly.react('grafico_heatmap', [{
      z: zValues, 
      x: Array.from({length: 31}, (_, i) => i), 
      y: Array.from({length: 101}, (_, i) => i).reverse(),
      type: 'heatmap', 
      colorscale: [
        [0.0, '#fce7f3'],  // Rosado claro
        [0.375, '#fce7f3'],
        [0.375, '#f472b6'], // Rosa (neutro)
        [0.625, '#f472b6'],
        [0.625, '#ea580c'], // Naranja (yield alto)
        [1.0, '#ea580c']
      ], 
      zmin: 0, zmax: 8,
      colorbar: { thickness: 12, outlinecolor: 'transparent', ticklen: 0 }
    }, {
      x: [diasActual], y: [asientosActual], mode: 'markers', name: 'Estado Actual',
      marker: { color: '#ffffff', size: 10, line: { color: '#000000', width: 2 } }
    }], { 
      autosize: true, 
      margin: { t: 10, r: 0, b: 35, l: 35 }, 
      xaxis: { title: 'Lead Time (Días)' }, 
      yaxis: { title: 'Asientos Disponibles' },
      paper_bgcolor: 'transparent', 
      plot_bgcolor: 'transparent', 
      showlegend: false
    }, { responsive: true, displayModeBar: false });
  } else {
    Plotly.restyle('grafico_heatmap', { 'x': [[diasActual]], 'y': [[asientosActual]] }, [1]);
  }
}