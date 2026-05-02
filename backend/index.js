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
import { gridfsBucket } from './config/db.js';

app.get("/images/:filename", async (req, res) => {
    try {
        console.log(`DEBUG: Received request for image: ${req.params.filename}`);
        const file = await gridfsBucket.find({ filename: req.params.filename }).toArray();
        if (!file || file.length === 0) {
            console.error(`DEBUG ERROR: Image not found in GridFS: ${req.params.filename}`);
            return res.status(404).json({ err: 'No file exists' });
        }
        const readStream = gridfsBucket.openDownloadStreamByName(req.params.filename);
        readStream.pipe(res);
    } catch (err) {
        console.error(`DEBUG ERROR: GridFS Stream Error: ${err.message}`);
        res.status(500).json({ err: 'Error streaming file' });
    }
});
app.use("/api/user/", userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order", orderRouter)

app.get("/", (req, res) => {
    res.send("API working");
});
 
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
