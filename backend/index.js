import express from 'express';
import cors from 'cors';
import { connectDB, getGridFSBucket } from './config/db.js';
import foodRouter from './routes/foodRoutes.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoute.js';

//app config
const app = express();
const port = process.env.PORT || 5001;

// middleware
app.use(express.json());
app.use(cors({
    origin: ["https://khaanpaan-frontend.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// DB connection & Server Start
connectDB().then(() => {
    // api endpoints
    app.use("/api/food", foodRouter);

    app.get("/images/:filename", async (req, res) => {
        try {
            const bucket = getGridFSBucket();
            if (!bucket) {
                return res.status(500).json({ err: 'GridFS not initialized' });
            }
            const file = await bucket.find({ filename: req.params.filename }).toArray();
            if (!file || file.length === 0) {
                return res.status(404).json({ err: 'No file exists' });
            }
            const readStream = bucket.openDownloadStreamByName(req.params.filename);
            readStream.pipe(res);
        } catch (err) {
            res.status(500).json({ err: 'Error streaming file' });
        }
    });

    app.use("/api/user", userRouter); // Removed trailing slash
    app.use("/api/cart", cartRouter);
    app.use("/api/order", orderRouter)

    app.get("/", (req, res) => {
        res.send("API working");
    });

    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
});
