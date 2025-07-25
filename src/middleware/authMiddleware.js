import dotenv from 'dotenv';
dotenv.config();

export const verifyAdminToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: '❌ No token provided' });
        }

        const token = authHeader.split(' ')[1];

        if (token !== process.env.ADMIN_TOKEN) {
            return res.status(403).json({ message: '❌ Invalid token' });
        }

        // ✅ Token is valid
        next();

    } catch (error) {
        res.status(500).json({ message: '❌ Authentication error', error: error.message });
    }
};


export const verifyAppToken = (req, res, next) => {
  try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: '❌ No token provided' });
      }

      const token = authHeader.split(' ')[1];

      if (token !== process.env.APP_TOKEN) {
          return res.status(403).json({ message: '❌ Invalid token' });
      }

      // ✅ Token is valid
      next();

  } catch (error) {
      res.status(500).json({ message: '❌ Authentication error', error: error.message });
  }
};

