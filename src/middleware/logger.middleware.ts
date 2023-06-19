import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(
    `Incomming -> Methood: [${req.method}] - Url[${req.url}] - IP:[${req.socket.remoteAddress}]`,
  );
  next();
}
