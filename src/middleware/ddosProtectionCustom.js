const rateLimitWindowMs = process.env.rateLimitWindowMs || 60 * 1000; // 1 minute
const maxRequests = process.env.maxRequestsPerWindow || 100;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const ipStore = new Map();

// 🧹 Background cleanup (runs every hour)
setInterval(() => {
  const now = Date.now();

  for (const [ip, data] of ipStore.entries()) {
    if (now - data.startTime > ONE_DAY_MS) {
      ipStore.delete(ip);
    }
  }
}, 60 * 60 * 1000); // every 1 hour

function ddosProtection(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const currentTime = Date.now();

  // Lazy eviction (in case interval hasn't run yet)
  if (ipStore.has(ip)) {
    const existing = ipStore.get(ip);
    if (currentTime - existing.startTime > ONE_DAY_MS) {
      ipStore.delete(ip);
    }
  }

  if (!ipStore.has(ip)) {
    ipStore.set(ip, {
      count: 1,
      startTime: currentTime,
    });
    return next();
  }

  const data = ipStore.get(ip);

  // Reset rate-limit window
  if (currentTime - data.startTime > rateLimitWindowMs) {
    data.count = 1;
    data.startTime = currentTime;
    return next();
  }

  data.count++;

  if (data.count > maxRequests) {
    return res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  }

  next();
}

module.exports = ddosProtection;