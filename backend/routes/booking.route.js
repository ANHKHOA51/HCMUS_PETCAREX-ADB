import db from '../db.js';
import express from "express";

router = express.Router();

// Example route to get all bookings
router.get('/create-booking', async (req, res) => {
  try {
    const result = await db.input('CustomerID', sql.Int, req.query.customerId)
      .input('ServiceID', sql.Int, req.query.serviceId)
      .input('BookingDate', sql.DateTime, new Date(req.query.bookingDate))
      .execute()
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;