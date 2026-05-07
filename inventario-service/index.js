import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import inventarioRouter from './routes/inventario.js';

const app = express();
const PORT = process.env.PORT || 8083;

app.use(cors());
app.use(express.json());

app.use('/api/inventario', inventarioRouter);

app.get('/health', (_req, res) => res.json({ status: 'UP', service: 'inventario-service' }));

app.listen(PORT, () => {
    console.log(`[SmartLogix] Microservicio de Inventario corriendo en puerto ${PORT}`);
});