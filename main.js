function calcularPrecio() {
    const origen = document.getElementById("origen").value.toUpperCase();
    const destino = document.getElementById("destino").value.toUpperCase();
    const dias = parseInt(document.getElementById("dias").value);
    const asientos = parseInt(document.getElementById("asientos").value);
    const precioBase = parseFloat(document.getElementById("precio_base").value);

    if (isNaN(dias) || isNaN(asientos) || isNaN(precioBase)) {
        document.getElementById("resultado").innerText = "Por favor, introduce valores numéricos válidos.";
        return;
    }

    if (origen === destino) {
        document.getElementById("resultado").innerText = "El origen y el destino no pueden ser iguales.";
        return;
    }

    const claveRuta = origen + "_" + destino;
    const claveEstado = dias + "_" + asientos;

    let accionIA;

    if (typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[claveRuta] && CEREBRO_IA[claveRuta][claveEstado] !== undefined) {
        accionIA = CEREBRO_IA[claveRuta][claveEstado];
    } else {
        accionIA = 4;
    }

    const multiplicadores = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4];
    const multiplicadorAplicado = multiplicadores[accionIA];

    const precioFinal = precioBase * multiplicadorAplicado;

    document.getElementById("resultado").innerText = 
        "Ruta: " + origen + " - " + destino + "\n" +
        "Multiplicador IA: " + multiplicadorAplicado.toFixed(2) + "x\n" +
        "Precio Final Recomendado: " + precioFinal.toFixed(2) + " €";
}