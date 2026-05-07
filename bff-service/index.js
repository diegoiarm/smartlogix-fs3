import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bffRouter from './routes/bff.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/bff', bffRouter);

app.get('/health', (_req, res) => res.json({ status: 'UP', service: 'bff-service' }));

app.listen(PORT, () => {
    console.log(`[SmartLogix] BFF corriendo en puerto ${PORT}`);
});
