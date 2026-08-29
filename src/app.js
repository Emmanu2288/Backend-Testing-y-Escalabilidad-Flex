import express from "express";
import { config } from "./config/index.js";
import productsRoutes from "./routes/products.routes.js";
import usersRoutes from "./routes/users.routes.js";
import mongoose from "mongoose";
import mocksRoutes from "./routes/mocks.routes.js";
import ordersRoutes from './routes/orders.routes.js'
import deliveriesRoutes from './routes/deliveries.routes.js'

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Server is running"})
});

app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use('/api/orders', ordersRoutes)
app.use('/api/deliveries', deliveriesRoutes)
app.use("/api/mocks", mocksRoutes);


mongoose.connect(config.mongoUri)
    .then(() => console.log("Conectado a la base de datos"))
    .catch((error) => console.error(`Error al conectar a la base de datos: ${error}`));

app.listen(config.port, () => {
    console.log (`Servidor escuchando en el puerto ${config.port}`)
})


