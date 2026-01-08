// Version testable de l'application Express (sans dépendances Angular SSR)
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Configuration CORS
app.use(cors({
  origin: process.env['APP_URL'] || '*',
  credentials: true
}));

// Rate limiting pour l'API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const uptime = Math.floor(process.uptime());
  res.json({
    status: 'healthy',
    uptime: uptime,
    ai_connection: 'ok'
  });
});

// API endpoint pour générer du contenu
app.post('/api/generate', apiLimiter, async (req, res) => {
  try {
    const { prompt, length = 'medium' } = req.body;

    // Validation du prompt
    if (!prompt || prompt.trim() === '') {
      res.status(400).json({
        error: 'Le prompt est requis'
      });
      return;
    }

    // Génération de contenu basée sur la longueur
    const lengthMap: Record<string, number> = {
      'short': 50,
      'medium': 100,
      'long': 200
    };

    const contentLength = lengthMap[length] || 100;
    const content = `Generated content about ${prompt}. `.repeat(Math.ceil(contentLength / 30));

    res.json({
      content: content.substring(0, contentLength)
    });

  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
});

export default app;
