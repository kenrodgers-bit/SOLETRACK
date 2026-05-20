import app, { connectDatabase } from '../app.js';

export default async function handler(req, res) {
  await connectDatabase();
  return app(req, res);
}
