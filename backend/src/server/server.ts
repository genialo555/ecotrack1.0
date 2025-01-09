import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

// Middleware pour gérer les CORS
app.use(cors());
app.use(express.json());

// Exemple de route
app.get('/api/endpoint', (req: Request, res: Response) => {
  res.json({ message: "Hello from the TypeScript backend!" });
});

// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
