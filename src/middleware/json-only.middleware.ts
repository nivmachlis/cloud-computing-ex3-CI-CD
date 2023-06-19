import { Request, Response, NextFunction } from 'express';
import { JsonParseException } from 'src/exception/custom-exceptions/expection-types';

export function jsonMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (
    req.method === 'POST' &&
    req.headers['content-type'] !== 'application/json'
  ) {
    throw new JsonParseException();
  }
  next();
}
