import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { AuthenticatedRequest } from '../types/auth.type';

export interface AuthenticationRequest extends Request {
  user: User | JwtPayload | undefined;
}

export const authenticatedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers?.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    (req as AuthenticationRequest).user = decoded as
      | User
      | JwtPayload
      | undefined;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Invalid token' });
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as AuthenticationRequest).user?.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  next();
};
