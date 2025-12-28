import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './db.js';
import authRouter from './routes/auth.route.js';
import appointmentRouter from './routes/appointment.route.js';
import medicalRouter from './routes/medical.route.js';
import receiptRouter from './routes/receipt.route.js';
import reportRouter from './routes/report.route.js';
import vaccineRouter from './routes/vaccine.route.js';
import productRouter from './routes/product.route.js';
import branchRouter from './routes/branch.route.js';
import petRouter from './routes/pet.route.js';

const app = express();
app.use(
  cors({
    origin: "*",
    // origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", async (req, res) => {
  // const pool = await db;
  const result = await db.query`
      SELECT * FROM HOIVIEN
    `;
  res.json(result.recordsets);
});

// app.use('/search', searchRouter); // Removed
app.use('/auth', authRouter);
app.use('/appointments', appointmentRouter); // Was /examine
app.use('/medical', medicalRouter); // Was /examine
app.use('/receipt', receiptRouter);
app.use('/report', reportRouter);
app.use('/vaccine', vaccineRouter);
app.use('/product', productRouter);
app.use('/branch', branchRouter);
app.use('/pet', petRouter);

export default app;
