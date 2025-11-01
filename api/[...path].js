// Catch-all API route that forwards to the Express app
export default async function handler(req, res) {
  // Import the Express app
  const { default: app } = await import('../server/index.js');
  
  // Let Express handle the request
  // Express apps work as middleware functions in serverless
  return app(req, res);
}
