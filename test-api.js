const baseUrl = "http://localhost:3000/api/equipos";

let errores = 0;

async function probar(nombre, metodo, ruta, body, codigoEsperado) {
    const opciones = {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body !== undefined) {
        opciones.body = JSON.stringify(body);
    }

    const respuesta = await fetch(baseUrl + ruta, opciones);
    const datos = await respuesta.json();

    if (respuesta.status === codigoEsperado) {
        console.log(`OK ${nombre}`);
    } else {
        console.log(`KO ${nombre}: esperado ${codigoEsperado}, recibido ${respuesta.status}`);
        errores++;
    }

    return datos;
}

async function ejecutarPruebas() {
    // Consultar equipos
    await probar("Obtener equipos", "GET", "/", undefined, 200);

    // Crear equipo
    const resultado = await probar(
        "Crear Los No Muertos",
        "POST",
        "/",
        { nombre: "Los No Muertos", division: "Primera" },
        201
    );

    const equipoId = resultado.equipo.id;

    // Validaciones de equipos
    await probar(
        "Rechazar equipo sin nombre",
        "POST",
        "/",
        { nombre: "", division: "Primera" },
        400
    );

    await probar(
        "Buscar equipo inexistente",
        "GET",
        "/999999",
        undefined,
        404
    );

    // Crear jugador
    const jugadorResultado = await probar(
        "Crear jugador Tim",
        "POST",
        `/${equipoId}/jugadores`,
        { nombre: "Tim", goles: 5 },
        201
    );

    const jugadorId = jugadorResultado.jugador.id;

    // Validaciones de jugadores
    await probar(
        "Rechazar goles negativos",
        "POST",
        `/${equipoId}/jugadores`,
        { nombre: "Jugador inválido", goles: -1 },
        400
    );

    await probar(
        "Rechazar goles decimales",
        "POST",
        `/${equipoId}/jugadores`,
        { nombre: "Jugador inválido", goles: 2.5 },
        400
    );

    await probar(
        "Rechazar jugador sin nombre",
        "POST",
        `/${equipoId}/jugadores`,
        { nombre: "", goles: 0 },
        400
    );

    // Mover jugador
    await probar(
        "Impedir mover jugador al mismo equipo",
        "PATCH",
        `/${equipoId}/jugadores/${jugadorId}/mover`,
        { equipoDestinoId: equipoId },
        400
    );

    await probar(
        "Impedir mover a equipo inexistente",
        "PATCH",
        `/${equipoId}/jugadores/${jugadorId}/mover`,
        { equipoDestinoId: 999999 },
        404
    );

    // Eliminar jugador
    await probar(
        "Eliminar Tim",
        "DELETE",
        `/${equipoId}/jugadores/${jugadorId}`,
        undefined,
        200
    );

    // Eliminar equipo
    await probar(
        "Eliminar Los No Muertos",
        "DELETE",
        `/${equipoId}`,
        undefined,
        200
    );

    console.log(`\nPruebas terminadas. Errores: ${errores}`);

    if (errores > 0) {
        process.exitCode = 1;
    }
}

ejecutarPruebas().catch(error => {
    console.error("Error ejecutando las pruebas:", error.message);
    process.exitCode = 1;
});