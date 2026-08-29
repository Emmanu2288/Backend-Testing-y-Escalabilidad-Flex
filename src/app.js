import express from "express";
import productsRoutes from "./routes/products.routes.js";
import usersRoutes from "./routes/users.routes.js";
import mocksRoutes from "./routes/mocks.routes.js";
import ordersRoutes from './routes/orders.routes.js'
import deliveriesRoutes from './routes/deliveries.routes.js'
import { routeNotFound } from './middlewares/routeNotFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import loggerTestRoutes from './routes/logger.routes.js'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpecs } from './docs/swagger.config.js'

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
app.use('/api/loggerTest', loggerTestRoutes)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

app.use(routeNotFound)
app.use(errorHandler)

export default app

