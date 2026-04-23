import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pedidosRouter from './routes/pedidos.js';

const app = express();
const PORT = process.env.PORT || 8082;

app.use(cors());
app.use(express.json());

app.use('/api/pedidos', pedidosRouter);

app.get('/health', (_req, res) => res.json({ status: 'UP', service: 'pedidos-service' }));

app.listen(PORT, () => {
    console.log(`[SmartLogix] Microservicio de Pedidos corriendo en puerto ${PORT}`);
});
