function calcularPrecio() {
    const origen = document.getElementById("origen").value.toUpperCase();
    const destino = document.getElementById("destino").value.toUpperCase();
    const dias = parseInt(document.getElementById("dias").value);
    const asientos = parseInt(document.getElementById("asientos").value);
    const precioBase = parseFloat(document.getElementById("precio_base").value);

    // Validación de entradas
    if (isNaN(dias) || isNaN(asientos) || isNaN(precioBase)) {
        alert("Error: Por favor, introduzca valores numéricos válidos en todos los campos.");
        return;
    }

    if (origen === destino) {
        alert("Error de lógica comercial: La estación de origen y destino no pueden ser idénticas.");
        return;
    }

    // Configuración del estado
    const claveRuta = origen + "_" + destino;
    const claveEstado = dias + "_" + asientos;
    
    let accionIA;
    const alertaElement = document.getElementById("res-alerta");
    alertaElement.style.display = "none";

    // Consulta al modelo exportado
    if (typeof CEREBRO_IA !== 'undefined' && CEREBRO_IA[claveRuta] && CEREBRO_IA[claveRuta][claveEstado] !== undefined) {
        accionIA = CEREBRO_IA[claveRuta][claveEstado];
    } else {
        // Fallback: Si no existen datos entrenados para la ruta seleccionada, no se aplica elasticidad.
        accionIA = 4;
        alertaElement.innerText = "* Nota: Trayecto sin matriz de decisión entrenada. Se aplica multiplicador base estático (1.0x).";
        alertaElement.style.display = "block";
    }

    // Espacio de acciones del entorno Gymnasium
    const multiplicadores = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4];
    const multiplicadorAplicado = multiplicadores[accionIA];

    // Cálculo final
    const precioFinal = precioBase * multiplicadorAplicado;

    // Actualización de la interfaz
    document.getElementById("res-ruta").innerText = origen + " - " + destino;
    document.getElementById("res-mult").innerText = multiplicadorAplicado.toFixed(2) + "x";
    document.getElementById("res-precio").innerText = precioFinal.toFixed(2) + " €";
    
    document.getElementById("resultado").style.display = "block";
}