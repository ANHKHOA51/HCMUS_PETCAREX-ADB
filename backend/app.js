import express from 'express';
import db from './db.js';
import searchRouter from './routes/search.route.js';
import authRouter from './routes/auth.route.js';
import examineRouter from './routes/examine.route.js';
import receiptRouter from './routes/receipt.route.js';
import reportRouter from './routes/report.route.js';
import vaccineRouter from './routes/vaccine.route.js';
import productRouter from './routes/product.route.js';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', async (req, res) => {
  // const pool = await db;
  const result = await db.query`
      SELECT * FROM HOIVIEN
    `;
  res.json(result.recordsets);
});

app.use('/search', searchRouter);
app.use('/auth', authRouter);
app.use('/examine', examineRouter);
app.use('/receipt', receiptRouter);
app.use('/report', reportRouter);
app.use('/vaccine', vaccineRouter);
app.use('/product', productRouter);

export default app;