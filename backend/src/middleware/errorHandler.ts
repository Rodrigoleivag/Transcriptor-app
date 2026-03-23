import { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);

  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Errores específicos de multer
  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = 'File too large. Maximum size is 100MB.';
  } else if (err.code === 'LIMIT_PART_COUNT') {
    status = 400;
    message = 'Too many parts in request.';
  } else if (err.message && err.message.includes('Invalid file type')) {
    status = 400;
    message = 'Invalid file type. Only audio files are allowed.';
  }

  // Errores de OpenAI
  if (err.message && err.message.includes('API key')) {
    status = 401;
    message = 'OpenAI API key is not configured or invalid. Please check your OPENAI_API_KEY environment variable.';
  } else if (err.message && err.message.includes('invalid_request_error')) {
    status = 400;
    message = 'Invalid request to OpenAI API. Please check your audio file format.';
  } else if (err.message && err.message.includes('rate_limit_exceeded')) {
    status = 429;
    message = 'OpenAI API rate limit exceeded. Please try again later.';
  }

  console.error(`📌 Status: ${status}, Message: ${message}`);

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      details: err.message,
      stack: err.stack 
    }),
  });
};
