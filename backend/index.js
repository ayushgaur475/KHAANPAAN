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
    origin: function (origin, callback) {
        // Allow any local development URL, the main frontend, or the admin dashboard
        if (!origin || 
            origin.startsWith("http://localhost") || 
            origin.startsWith("http://127.0.0.1") || 
            origin === "https://khaanpaan-frontend.vercel.app" ||
            origin === "https://khaanpaan-admin.vercel.app" ||
            origin === "https://khaanpaan-backend.onrender.com") {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// DB connection & Server Start
connectDB().then(() => {
    // api endpoints
    app.use("/api/food", foodRouter);

    app.use("/images", express.static('images'));
    app.use("/images", express.static('uploads'));

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
