import express from 'express';
import equiposRoutes from "./routes/equipo.routes.js"

const app = express();

app.use(express.json());

app.use("/equipos",equiposRoutes);

app.listen(3000, () => {
  console.log('Funchiona en el puerto 3000');
});
