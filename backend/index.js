import express from 'express';
import cors from 'cors';
import { connectDB, getGridFSBucket } from './config/db.js';
import foodRouter from './routes/foodRoutes.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoute.js';

import path from 'path';

//app config
const app = express();
const port = process.env.PORT || 5001;

// middleware
app.use(express.json());
app.use(cors()); // Temporarily allow all for troubleshooting

// DB connection & Server Start
connectDB().then(() => {
    // api endpoints
    app.use("/api/food", foodRouter);

    app.use("/images", express.static(path.resolve('images')));
    app.use("/images", express.static(path.resolve('uploads')));

    // Fallback for GridFS if file doesn't exist in uploads (optional but good for compatibility)
    app.get("/images/:filename", async (req, res, next) => {
        try {
            const bucket = getGridFSBucket();
            if (!bucket) return next();
            const file = await bucket.find({ filename: req.params.filename }).toArray();
            if (!file || file.length === 0) return next();
            bucket.openDownloadStreamByName(req.params.filename).pipe(res);
        } catch (err) {
            next();
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
