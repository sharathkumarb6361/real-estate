const attempts = new Map();

const authRateLimit = (req, res, next) => {
  const now = Date.now();
  const key = `${req.ip}:${req.path}`;
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 10;
  const recent = (attempts.get(key) || []).filter(timestamp => now - timestamp < windowMs);

  if (recent.length >= maxAttempts) {
    res.setHeader('Retry-After', '900');
    return res.status(429).json({ message: 'Too many authentication attempts. Try again later.' });
  }

  recent.push(now);
  attempts.set(key, recent);
  next();
};

setInterval(() => {
  const cutoff = Date.now() - 15 * 60 * 1000;
  for (const [key, timestamps] of attempts.entries()) {
    const recent = timestamps.filter(timestamp => timestamp > cutoff);
    if (recent.length === 0) attempts.delete(key);
    else attempts.set(key, recent);
  }
}, 15 * 60 * 1000).unref();

module.exports = { authRateLimit };
