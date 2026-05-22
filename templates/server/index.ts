import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so local client on port 5173 can call this server directly if needed
// (Although we recommend configuring Vite dev proxy to map /api)
app.use(cors());
app.use(express.json());

// In-memory data store
let posts = [
  {
    id: 1,
    title: "Bootstrapping with Vite and React",
    body: "Vite is an exceptionally fast frontend tool builder. Combining it with React, Zustand, and TanStack Query yields an incredibly modular development stack."
  },
  {
    id: 2,
    title: "Global State Management with Zustand",
    body: "Zustand is a tiny, fast, and scalable bear-necessity state management tool. It utilizes simple hook selectors without wrapping the application in complex provider hierarchies."
  },
  {
    id: 3,
    title: "Data Synchronizing via TanStack Query",
    body: "Query manages caching, background updating, and stale data resolution out of the box, allowing you to focus on application business logic."
  }
];

// Endpoint: Return server metrics & uptime
app.get('/api/stats', (req: Request, res: Response) => {
  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  
  res.json({
    usersCount: 1420 + Math.floor(Math.random() * 10),
    requestsCount: 48920 + Math.floor(Math.random() * 50),
    uptime: `${hours}h ${minutes}m ${seconds}s`,
    systemLoad: `${(5 + Math.random() * 15).toFixed(1)}%`,
  });
});

// Endpoint: Return posts feed
app.get('/api/posts', (req: Request, res: Response) => {
  res.json(posts);
});

// Endpoint: Add new post
app.post('/api/posts', (req: Request, res: Response) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(400).json({ message: 'Title and body are required' });
    return;
  }

  const newPost = {
    id: posts.length + 1,
    title: String(title),
    body: String(body)
  };

  posts = [newPost, ...posts];
  res.status(201).json(newPost);
});

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[Express Server] Running on http://localhost:${PORT}`);
  console.log(`[Express Server] API base path is http://localhost:${PORT}/api`);
});
