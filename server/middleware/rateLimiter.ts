import rateLimit from 'express-rate-limit';

export const chatRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 40, // Limit each IP to 40 chat requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many chat requests from this IP, please try again after 15 minutes.',
  },
});
