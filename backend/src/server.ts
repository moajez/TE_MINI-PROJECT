import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import syllabusRoutes from './routes/syllabusRoutes';
import { error } from 'console';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors());

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
}));

app.use('/api/users', userRoutes);
app.use("/api/syllabus", syllabusRoutes);

app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
    message: 'Server is running',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;