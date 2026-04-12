const { v4: uuidv4 } = require("uuid");

const logger = (req, res, next) => {
  const start = Date.now();
  const requestId = uuidv4();
  req.requestId = requestId;

  let responseBody;

  // Intercept res.send
  const originalSend = res.send;
  res.send = function (body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  // Intercept res.json
  const originalJson = res.json;
  res.json = function (body) {
    responseBody = body;
    return originalJson.call(this, body);
  };

  const reqlog = {
    requestId,
    logType: "request",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.headers["x-forwarded-for"] || req.ip,
    origin: req.headers.origin || null,
    body: req.body,
  };

  console.log(JSON.stringify(reqlog, null, 2));

  res.on("finish", () => {
    const duration = Date.now() - start;

    const resplog = {
      requestId,
      logType: "response",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      resBody: responseBody || null,
      responseTime: `${duration}ms`,
    };

    console.log(JSON.stringify(resplog, null, 2));
  });

  res.on("error", (err) => {
    const errorLog = {
      requestId,
      logType: "error",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      message: err.message,
      stack: err.stack,
    };

    console.error(JSON.stringify(errorLog, null, 2));
  });

  next();
};

module.exports = logger;