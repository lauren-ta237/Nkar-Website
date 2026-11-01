import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// @ts-expect-error swagger-ui-express does not ship declarations in this environment
import swaggerUi from 'swagger-ui-express';
import { apiRouter } from './app.js';
import { openapi } from './openapi.js';
const app = express();
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGINS ?? 'http://localhost:5173').split(','), credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true }));
app.get('/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.get('/openapi.json', (_req, res) => res.json(openapi));
app.use('/api/v1', apiRouter);
app.use((err, req, res, _next) => { const status = err.name === 'ZodError' ? 400 : (err.statusCode ?? 500); const code = err.name === 'ZodError' ? 'VALIDATION_ERROR' : (err.code ?? 'INTERNAL_ERROR'); req.log?.error(err); res.status(status).json({ success: false, error: { code, message: status === 500 ? 'Internal server error' : err.message, details: err.details }, requestId: req.id }); });
if (process.env.NODE_ENV !== 'test')
    app.listen(Number(process.env.PORT ?? 4000), () => console.log(`Nkar API listening on ${process.env.PORT ?? 4000}`));
export { app };
