function calcularPrecio() {
    const origen = document.getElementById("origen").value.toUpperCase();
    const destino = document.getElementById("destino").value.toUpperCase();
    const dias = parseInt(document.getElementById("dias").value);
    const asientos = parseInt(document.getElementById("asientos").value);

    if (isNaN(dias) || isNaN(asientos)) {
        document.getElementById("resultado").innerText = "Por favor, introduce valores numéricos válidos.";
        return;
    }

    if (origen === destino) {
        document.getElementById("resultado").innerText = "El origen y el destino no pueden ser iguales.";
        return;
    }

    const claveRuta = origen + "_" + destino;
    const claveEstado = dias + "_" + asientos;

    // EL SISTEMA ASIGNA EL PRECIO BASE DE FORMA AUTOMÁTICA
    let precioBase;
    if (claveRuta === "MADRID_BARCELONA" || claveRuta === "BARCELONA_MADRID") {
        precioBase = 65.00;
    } else if (claveRuta === "MADRID_SEVILLA" || claveRuta === "SEVILLA_MADRID") {
        precioBase = 50.00;
    } else if (claveRuta === "MADRID_VALENCIA" || claveRuta === "VALENCIA_MADRID") {
        precioBase = 40.00;
    } else {
        precioBase = 55.00; // Por defecto para otras posibles combinaciones
    }

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
        "Precio Base Referencia: " + precioBase.toFixed(2) + " €\n" +
        "Multiplicador IA: " + multiplicadorAplicado.toFixed(2) + "x\n" +
        "Precio Final Recomendado: " + precioFinal.toFixed(2) + " €";
}