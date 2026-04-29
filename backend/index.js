import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoutes.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoute.js';

//app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors()); // allow access to backend from any frontend

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON:', err.message);
        return res.status(400).send({ status: 400, message: 'Bad JSON format' });
    }
    next();
});

// DB connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user/", userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order", orderRouter)

app.get("/", (req, res) => {
    res.send("API working");
});
 
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
