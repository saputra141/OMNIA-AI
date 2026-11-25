import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
  API_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

// Health Check
app.get('/', (c) => c.json({ status: 'OMNIA AI Operational' }));

// Get All Tasks
app.get('/api/tasks', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM video_tasks ORDER BY created_at DESC'
  ).all();
  return c.json(results);
});

// Create Video Task
app.post('/api/tasks', async (c) => {
  const body = await c.req.json();
  const id = crypto.randomUUID();
  const { prompt, provider } = body;

  await c.env.DB.prepare(
    'INSERT INTO video_tasks (id, prompt, provider, status) VALUES (?, ?, ?, ?)'
  )
    .bind(id, prompt, provider, 'pending')
    .run();

  return c.json({ id, status: 'pending' }, 201);
});

// Update Task Status (Callback for AI Workers)
app.patch('/api/tasks/:id', async (c) => {
  const id = c.req.param('id');
  const { status, result_url } = await c.req.json();

  await c.env.DB.prepare(
    'UPDATE video_tasks SET status = ?, result_url = ? WHERE id = ?'
  )
    .bind(status, result_url, id)
    .run();

  return c.json({ success: true });
});

// Settings Management
app.get('/api/settings', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM settings').all();
  return c.json(results);
});

export default app;
