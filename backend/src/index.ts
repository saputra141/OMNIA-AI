import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
  REPLICATE_API_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

// Helper untuk memanggil Replicate
async function startVideoGen(prompt: string, token: string) {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: "3f0c2727190998f46f3322046200678d45ec19e7a77e8a9f0296726207851e3c", // SVD model
      input: { prompt: prompt }
    }),
  });
  return await response.json();
}

// Endpoint untuk request video baru
app.post('/api/video/generate', async (c) => {
  const { prompt } = await c.req.json();
  const token = c.env.REPLICATE_API_TOKEN;

  if (!token) return c.json({ error: 'Replicate token not configured' }, 500);

  try {
    const prediction = await startVideoGen(prompt, token);
    const taskId = prediction.id;

    await c.env.DB.prepare(
      'INSERT INTO video_tasks (id, prompt, provider, status) VALUES (?, ?, ?, ?)'
    ).bind(taskId, prompt, 'replicate', 'processing').run();

    return c.json({ taskId, status: 'processing' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Endpoint untuk cek status video
app.get('/api/video/status/:id', async (c) => {
  const id = c.req.param('id');
  const token = c.env.REPLICATE_API_TOKEN;

  const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
    headers: { 'Authorization': `Token ${token}` }
  });
  
  const data: any = await res.json();
  let status = data.status; // starting, processing, succeeded, failed
  let resultUrl = data.output ? data.output[0] : null;

  if (status === 'succeeded') {
    await c.env.DB.prepare(
      'UPDATE video_tasks SET status = "completed", result_url = ? WHERE id = ?'
    ).bind(resultUrl, id).run();
  }

  return c.json({ id, status, resultUrl });
});

// List video history
app.get('/api/video/history', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM video_tasks ORDER BY created_at DESC LIMIT 20'
  ).all();
  return c.json(results);
});

export default app;
