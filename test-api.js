const baseUrl = "http://localhost:3000/api/equipos";

let errores = 0;
let pruebas = 0;

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

    pruebas++;

    try {
        const respuesta = await fetch(baseUrl + ruta, opciones);

        const texto = await respuesta.text();
        let datos;

        try {
            datos = texto ? JSON.parse(texto) : null;
        } catch {
            datos = texto;
        }

        if (respuesta.status === codigoEsperado) {
            console.log(`OK ${nombre}`);
        } else {
            console.log(`KO ${nombre}: esperado ${codigoEsperado}, recibido ${respuesta.status}`);
            errores++;
        }

        return datos;

    } catch (error) {
        console.log(`KO ${nombre}: ${error.message}`);
        errores++;
        return null;
    }
}


function comprobar(nombre, condicion) {
    pruebas++;

    if (condicion) {
        console.log(`OK ${nombre}`);
    } else {
        console.log(`KO ${nombre}`);
        errores++;
    }
}


function obtenerTodosLosJugadores(listaEquipos) {
    return listaEquipos.flatMap(equipo =>
        Array.isArray(equipo.jugadores) ? equipo.jugadores : []
    );
}


async function ejecutarPruebas() {

    const equiposCreados = [];
    const sufijo = Date.now();

    try {

        const equiposIniciales = await probar(
            "Obtener equipos",
            "GET",
            "/",
            undefined,
            200
        );

        comprobar(
            "La lista de equipos es un array",
            Array.isArray(equiposIniciales)
        );

        if (!Array.isArray(equiposIniciales)) return;

        const idsIniciales = equiposIniciales.map(x => x.id);

        comprobar(
            "Los IDs iniciales de equipos son únicos",
            new Set(idsIniciales).size === idsIniciales.length
        );

        const jugadoresIniciales = obtenerTodosLosJugadores(equiposIniciales);
        const idsJugadoresIniciales = jugadoresIniciales.map(x => x.id);

        comprobar(
            "Los IDs iniciales de jugadores son únicos globalmente",
            new Set(idsJugadoresIniciales).size === idsJugadoresIniciales.length
        );


        const resultadoA = await probar(
            "Crear Los No Muertos",
            "POST",
            "/",
            { nombre: `Los No Muertos ${sufijo}`, division: "Primera" },
            201
        );

        const equipoA = resultadoA?.equipo?.id;

        comprobar(
            "El primer equipo recibe un ID válido",
            Number.isInteger(equipoA)
        );

        if (!Number.isInteger(equipoA)) return;

        if (!idsIniciales.includes(equipoA)) {
            equiposCreados.push(equipoA);
        }


        const resultadoB = await probar(
            "Crear Los Vivos",
            "POST",
            "/",
            { nombre: `Los Vivos ${sufijo}`, division: "Segunda" },
            201
        );

        const equipoB = resultadoB?.equipo?.id;

        comprobar(
            "El segundo equipo recibe un ID válido",
            Number.isInteger(equipoB)
        );

        if (!Number.isInteger(equipoB)) return;

        if (!idsIniciales.includes(equipoB) &&
            !equiposCreados.includes(equipoB)) {
            equiposCreados.push(equipoB);
        }

        comprobar(
            "Los nuevos equipos tienen IDs diferentes y únicos",
            equipoA !== equipoB &&
            !idsIniciales.includes(equipoA) &&
            !idsIniciales.includes(equipoB)
        );

        if (equipoA === equipoB ||
            idsIniciales.includes(equipoA) ||
            idsIniciales.includes(equipoB)) return;


        const equiposTrasCrear = await probar(
            "Consultar equipos creados",
            "GET",
            "/",
            undefined,
            200
        );

        const listaEquipos = Array.isArray(equiposTrasCrear)
            ? equiposTrasCrear : [];

        comprobar(
            "Los dos equipos se han guardado",
            listaEquipos.some(x => x.id === equipoA) &&
            listaEquipos.some(x => x.id === equipoB)
        );

        comprobar(
            "Todos los IDs de equipos son únicos",
            new Set(listaEquipos.map(x => x.id)).size === listaEquipos.length
        );


        await probar(
            "Rechazar equipo sin nombre",
            "POST",
            "/",
            { nombre: "", division: "Primera" },
            400
        );

        await probar(
            "Rechazar equipo con nombre de espacios",
            "POST",
            "/",
            { nombre: "   ", division: "Primera" },
            400
        );

        await probar(
            "Rechazar equipo sin división",
            "POST",
            "/",
            { nombre: "Equipo prueba", division: "" },
            400
        );

        await probar(
            "Rechazar división con espacios",
            "POST",
            "/",
            { nombre: "Equipo prueba", division: "   " },
            400
        );

        await probar(
            "Rechazar equipo sin campo nombre",
            "POST",
            "/",
            { division: "Primera" },
            400
        );

        await probar(
            "Rechazar equipo sin campo división",
            "POST",
            "/",
            { nombre: "Equipo prueba" },
            400
        );

        await probar(
            "Rechazar nombre de equipo numérico",
            "POST",
            "/",
            { nombre: 123, division: "Primera" },
            400
        );

        await probar(
            "Rechazar división numérica",
            "POST",
            "/",
            { nombre: "Equipo prueba", division: 123 },
            400
        );


        const equiposTrasInvalidos = await probar(
            "Consultar equipos tras creaciones inválidas",
            "GET",
            "/",
            undefined,
            200
        );

        comprobar(
            "Los equipos inválidos no se han guardado",
            Array.isArray(equiposTrasInvalidos) &&
            equiposTrasInvalidos.length === listaEquipos.length
        );


        await probar(
            "Buscar equipo existente",
            "GET",
            `/${equipoA}`,
            undefined,
            200
        );

        const equipoInexistente = Math.max(
            999999,
            ...listaEquipos.map(x => x.id)
        ) + 10000;

        await probar(
            "Buscar equipo inexistente",
            "GET",
            `/${equipoInexistente}`,
            undefined,
            404
        );

        await probar(
            "Modificar equipo inexistente con PUT",
            "PUT",
            `/${equipoInexistente}`,
            { nombre: "Prueba", division: "Primera" },
            404
        );

        await probar(
            "Modificar equipo inexistente con PATCH",
            "PATCH",
            `/${equipoInexistente}`,
            { nombre: "Prueba" },
            404
        );

        await probar(
            "Eliminar equipo inexistente",
            "DELETE",
            `/${equipoInexistente}`,
            undefined,
            404
        );


        await probar(
            "Actualizar equipo con PUT",
            "PUT",
            `/${equipoA}`,
            { nombre: "Los No Muertos FC", division: "Segunda" },
            200
        );

        const equipoActualizado = await probar(
            "Consultar equipo actualizado con PUT",
            "GET",
            `/${equipoA}`,
            undefined,
            200
        );

        comprobar(
            "PUT guarda nombre y división",
            equipoActualizado?.nombre === "Los No Muertos FC" &&
            equipoActualizado?.division === "Segunda"
        );


        await probar(
            "Actualizar solo nombre con PATCH",
            "PATCH",
            `/${equipoA}`,
            { nombre: "Los No Muertos CF" },
            200
        );

        const equipoPatch = await probar(
            "Consultar equipo actualizado con PATCH",
            "GET",
            `/${equipoA}`,
            undefined,
            200
        );

        comprobar(
            "PATCH modifica el nombre y conserva la división",
            equipoPatch?.nombre === "Los No Muertos CF" &&
            equipoPatch?.division === "Segunda"
        );


        await probar(
            "Actualizar solo división con PATCH",
            "PATCH",
            `/${equipoA}`,
            { division: "Primera" },
            200
        );

        const equipoPatchDivision = await probar(
            "Consultar equipo tras modificar división",
            "GET",
            `/${equipoA}`,
            undefined,
            200
        );

        comprobar(
            "PATCH modifica la división y conserva el nombre",
            equipoPatchDivision?.nombre === "Los No Muertos CF" &&
            equipoPatchDivision?.division === "Primera"
        );


        await probar(
            "Rechazar PUT sin nombre",
            "PUT",
            `/${equipoA}`,
            { nombre: "", division: "Primera" },
            400
        );

        await probar(
            "Rechazar PUT sin división",
            "PUT",
            `/${equipoA}`,
            { nombre: "Prueba", division: "" },
            400
        );

        await probar(
            "Rechazar PATCH con nombre vacío",
            "PATCH",
            `/${equipoA}`,
            { nombre: "" },
            400
        );

        await probar(
            "Rechazar PATCH con división vacía",
            "PATCH",
            `/${equipoA}`,
            { division: "" },
            400
        );

        await probar(
            "Rechazar PATCH con nombre de espacios",
            "PATCH",
            `/${equipoA}`,
            { nombre: "   " },
            400
        );


        const equipoTrasErrores = await probar(
            "Consultar equipo tras modificaciones inválidas",
            "GET",
            `/${equipoA}`,
            undefined,
            200
        );

        comprobar(
            "Las modificaciones inválidas no cambian el equipo",
            equipoTrasErrores?.nombre === "Los No Muertos CF" &&
            equipoTrasErrores?.division === "Primera"
        );


        await probar(
            "Obtener jugadores del equipo",
            "GET",
            `/${equipoA}/jugadores`,
            undefined,
            200
        );

        await probar(
            "Obtener jugadores de equipo inexistente",
            "GET",
            `/${equipoInexistente}/jugadores`,
            undefined,
            404
        );

        await probar(
            "Crear jugador en equipo inexistente",
            "POST",
            `/${equipoInexistente}/jugadores`,
            { nombre: "Jugador prueba", goles: 5 },
            404
        );


        const resultadoTim = await probar(
            "Crear jugador Tim",
            "POST",
            `/${equipoA}/jugadores`,
            { nombre: "Tim", goles: 5 },
            201
        );

        const jugadorTim = resultadoTim?.jugador?.id;

        comprobar(
            "Tim recibe un ID válido",
            Number.isInteger(jugadorTim)
        );

        if (!Number.isInteger(jugadorTim)) return;


        const resultadoLia = await probar(
            "Crear jugador Lia con cero goles",
            "POST",
            `/${equipoB}/jugadores`,
            { nombre: "Lia", goles: 0 },
            201
        );

        const jugadorLia = resultadoLia?.jugador?.id;

        comprobar(
            "Lia recibe un ID válido",
            Number.isInteger(jugadorLia)
        );

        if (!Number.isInteger(jugadorLia)) return;

        comprobar(
            "Tim y Lia tienen IDs diferentes",
            jugadorTim !== jugadorLia
        );

        comprobar(
            "Se permiten jugadores con cero goles",
            resultadoLia?.jugador?.goles === 0
        );


        const jugadoresA = await probar(
            "Consultar jugadores del primer equipo",
            "GET",
            `/${equipoA}/jugadores`,
            undefined,
            200
        );

        comprobar(
            "Tim se ha guardado correctamente",
            Array.isArray(jugadoresA) &&
            jugadoresA.some(x =>
                x.id === jugadorTim &&
                x.nombre === "Tim" &&
                x.goles === 5
            )
        );


        const jugadoresB = await probar(
            "Consultar jugadores del segundo equipo",
            "GET",
            `/${equipoB}/jugadores`,
            undefined,
            200
        );

        comprobar(
            "Lia se ha guardado correctamente",
            Array.isArray(jugadoresB) &&
            jugadoresB.some(x =>
                x.id === jugadorLia &&
                x.nombre === "Lia" &&
                x.goles === 0
            )
        );


        const equiposConJugadores = await probar(
            "Consultar equipos con jugadores",
            "GET",
            "/",
            undefined,
            200
        );

        const todosLosJugadores = obtenerTodosLosJugadores(
            Array.isArray(equiposConJugadores) ? equiposConJugadores : []
        );

        const idsJugadores = todosLosJugadores.map(x => x.id);

        comprobar(
            "Los IDs de jugadores son únicos globalmente",
            idsJugadores.length === new Set(idsJugadores).size
        );


        await probar(
            "Rechazar jugador sin nombre",
            "POST",
            `/${equipoA}/jugadores`,
            { nombre: "", goles: 0 },
            400
        );

        await probar(
            "Rechazar jugador con nombre de espacios",
            "POST",
            `/${equipoA}/jugadores`,
            { nombre: "   ", goles: 0 },
            400
        );

        await probar(
            "Rechazar jugador sin campo nombre",
            "POST",
            `/${equipoA}/jugadores`,
            { goles: 5 },
            400
        );

        await probar(
            "Rechazar nombre de jugador numérico",
            "POST",
            `/${equipoA}/jugadores`,
            { nombre: 123, goles: 5 },
            400
        );

        await probar(
            "Rechazar goles negativos",
            "POST",
            `/${equipoA}/jugadores`,
            { nombre: "Jugador inválido", goles: -1 },
            400
        );

        await probar(
            "Rechazar goles decimales",
            "POST",
            `/${equipoA}/jugadores`,
            { nombre: "Jugador inválido", goles: 2.5 },
            400
        );

        await probar(
            "Rechazar goles no numéricos",
            "POST",
            `/${equipoA}/jugadores`,
            { nombre: "Jugador inválido", goles: "hola" },
            400
        );

        await probar(
            "Rechazar goles vacíos",
            "POST",
            `/${equipoA}/jugadores`,
            { nombre: "Jugador inválido", goles: "" },
            400
        );

        await probar(
            "Rechazar goles nulos",
            "POST",
            `/${equipoA}/jugadores`,
            { nombre: "Jugador inválido", goles: null },
            400
        );

        await probar(
            "Rechazar jugador sin goles",
            "POST",
            `/${equipoA}/jugadores`,
            { nombre: "Jugador inválido" },
            400
        );


        const jugadoresTrasInvalidos = await probar(
            "Consultar jugadores tras creaciones inválidas",
            "GET",
            `/${equipoA}/jugadores`,
            undefined,
            200
        );

        comprobar(
            "Los jugadores inválidos no se han guardado",
            Array.isArray(jugadoresTrasInvalidos) &&
            jugadoresTrasInvalidos.length === 1 &&
            jugadoresTrasInvalidos[0]?.id === jugadorTim
        );


        await probar(
            "Impedir mover jugador al mismo equipo",
            "PATCH",
            `/${equipoA}/jugadores/${jugadorTim}/mover`,
            { equipoDestinoId: equipoA },
            400
        );

        await probar(
            "Impedir mover jugador a equipo inexistente",
            "PATCH",
            `/${equipoA}/jugadores/${jugadorTim}/mover`,
            { equipoDestinoId: equipoInexistente },
            404
        );

        await probar(
            "Impedir mover jugador con destino vacío",
            "PATCH",
            `/${equipoA}/jugadores/${jugadorTim}/mover`,
            { equipoDestinoId: "" },
            400
        );

        const jugadorInexistente = Math.max(
            999999,
            ...idsJugadores
        ) + 10000;

        await probar(
            "Impedir mover jugador inexistente",
            "PATCH",
            `/${equipoA}/jugadores/${jugadorInexistente}/mover`,
            { equipoDestinoId: equipoB },
            404
        );

        await probar(
            "Impedir mover desde equipo inexistente",
            "PATCH",
            `/${equipoInexistente}/jugadores/${jugadorTim}/mover`,
            { equipoDestinoId: equipoB },
            404
        );


        await probar(
            "Mover Tim al segundo equipo",
            "PATCH",
            `/${equipoA}/jugadores/${jugadorTim}/mover`,
            { equipoDestinoId: equipoB },
            200
        );

        const jugadoresOrigen = await probar(
            "Consultar jugadores del equipo de origen",
            "GET",
            `/${equipoA}/jugadores`,
            undefined,
            200
        );

        comprobar(
            "Tim ya no pertenece al equipo de origen",
            Array.isArray(jugadoresOrigen) &&
            !jugadoresOrigen.some(x => x.id === jugadorTim)
        );


        const jugadoresDestino = await probar(
            "Consultar jugadores del equipo de destino",
            "GET",
            `/${equipoB}/jugadores`,
            undefined,
            200
        );

        comprobar(
            "Tim pertenece ahora al equipo de destino",
            Array.isArray(jugadoresDestino) &&
            jugadoresDestino.some(x => x.id === jugadorTim)
        );

        comprobar(
            "Lia sigue en el equipo de destino",
            Array.isArray(jugadoresDestino) &&
            jugadoresDestino.some(x => x.id === jugadorLia)
        );


        await probar(
            "Impedir eliminar Tim del equipo incorrecto",
            "DELETE",
            `/${equipoA}/jugadores/${jugadorTim}`,
            undefined,
            404
        );

        await probar(
            "Impedir eliminar jugador inexistente",
            "DELETE",
            `/${equipoB}/jugadores/${jugadorInexistente}`,
            undefined,
            404
        );

        await probar(
            "Impedir eliminar jugador de equipo inexistente",
            "DELETE",
            `/${equipoInexistente}/jugadores/${jugadorTim}`,
            undefined,
            404
        );


        await probar(
            "Eliminar Tim",
            "DELETE",
            `/${equipoB}/jugadores/${jugadorTim}`,
            undefined,
            200
        );

        const jugadoresTrasEliminar = await probar(
            "Consultar jugadores tras eliminar Tim",
            "GET",
            `/${equipoB}/jugadores`,
            undefined,
            200
        );

        comprobar(
            "Tim se ha eliminado realmente",
            Array.isArray(jugadoresTrasEliminar) &&
            !jugadoresTrasEliminar.some(x => x.id === jugadorTim)
        );

        comprobar(
            "Eliminar Tim no elimina a Lia",
            Array.isArray(jugadoresTrasEliminar) &&
            jugadoresTrasEliminar.some(x => x.id === jugadorLia)
        );


        const resultadoPablo = await probar(
            "Crear Pablo para comprobar eliminación en cascada",
            "POST",
            `/${equipoA}/jugadores`,
            { nombre: "Pablo", goles: 3 },
            201
        );

        const jugadorPablo = resultadoPablo?.jugador?.id;

        comprobar(
            "Pablo recibe un ID válido",
            Number.isInteger(jugadorPablo)
        );

        if (!Number.isInteger(jugadorPablo)) return;


        const jugadoresAntesEliminarEquipo = await probar(
            "Consultar jugadores antes de eliminar equipo",
            "GET",
            `/${equipoA}/jugadores`,
            undefined,
            200
        );

        comprobar(
            "El equipo contiene a Pablo antes de eliminarse",
            Array.isArray(jugadoresAntesEliminarEquipo) &&
            jugadoresAntesEliminarEquipo.some(x => x.id === jugadorPablo)
        );


        await probar(
            "Eliminar Los No Muertos con jugadores",
            "DELETE",
            `/${equipoA}`,
            undefined,
            200
        );

        await probar(
            "Comprobar que el equipo eliminado no existe",
            "GET",
            `/${equipoA}`,
            undefined,
            404
        );

        const equiposFinales = await probar(
            "Consultar equipos tras eliminación",
            "GET",
            "/",
            undefined,
            200
        );

        const listaFinal = Array.isArray(equiposFinales)
            ? equiposFinales : [];

        comprobar(
            "El equipo eliminado ya no aparece",
            Array.isArray(equiposFinales) &&
            !listaFinal.some(x => x.id === equipoA)
        );

        const jugadoresFinales = obtenerTodosLosJugadores(listaFinal);

        comprobar(
            "Los jugadores del equipo eliminado también desaparecen",
            Array.isArray(equiposFinales) &&
            !jugadoresFinales.some(x => x.id === jugadorPablo)
        );

        comprobar(
            "El otro equipo sigue existiendo",
            listaFinal.some(x => x.id === equipoB)
        );

        comprobar(
            "Los jugadores de otros equipos no se eliminan",
            jugadoresFinales.some(x => x.id === jugadorLia)
        );

    } finally {

        for (const id of equiposCreados) {
            try {
                const respuesta = await fetch(baseUrl + `/${id}`);

                if (respuesta.status === 200) {
                    const eliminacion = await fetch(baseUrl + `/${id}`, {
                        method: "DELETE"
                    });

                    if (eliminacion.status !== 200) {
                        console.log(`No se pudo limpiar el equipo ${id}`);
                        errores++;
                    }
                } else if (respuesta.status !== 404) {
                    console.log(`No se pudo comprobar la limpieza del equipo ${id}`);
                    errores++;
                }

            } catch (error) {
                console.log(`Error limpiando equipo ${id}: ${error.message}`);
                errores++;
            }
        }

        console.log(`\nPruebas terminadas: ${pruebas}`);
        console.log(`Errores: ${errores}`);

        if (errores > 0) {
            process.exitCode = 1;
        }
    }
}


ejecutarPruebas().catch(error => {
    console.error("Error ejecutando las pruebas:", error.message);
    process.exitCode = 1;
});