import express from 'express';
import equiposRoutes from "./routes/equipo.routes.js"
import jugadorRoutes from './routes/jugador.routes.js';

const app = express();

app.use(express.json());

//ahora es con api/
app.use("/api/equipos", equiposRoutes);
app.use("/api/equipos", jugadorRoutes);

app.listen(3000, () => {
    console.log('Funchiona en el puerto 3000');
});
