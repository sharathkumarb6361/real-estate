const publicError = (error, fallback = 'Internal Server Error') => {
  if (error.status && error.status < 500) return error.message;
  if (error.name === 'ValidationError' || error.name === 'CastError' || error.code === 11000) {
    return error.message;
  }
  return process.env.NODE_ENV === 'development' ? error.message : fallback;
};

module.exports = { publicError };
