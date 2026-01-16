import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js'
import portfolioRoutes from './routes/PortfolioRoutes.js'
import cashRoutes from './routes/CashRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.get("/api", (req, res) => {
    res.send("Hello from the test route");
});

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/usercash', cashRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});