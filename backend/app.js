import express from 'express';
import db from './db.js';
import searchRouter from './routes/search.route.js';
import procedureRouter from './routes/procedure.route.js';

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
app.use('/api', procedureRouter);

export default app;