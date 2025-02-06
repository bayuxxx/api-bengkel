const apiKeys = ['ubay12345', 'your-api-key-2'];

const secure = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || !apiKeys.includes(apiKey)) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Invalid API key',
    });
  }
  
  next();
};

module.exports = secure;
