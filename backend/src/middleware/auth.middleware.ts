import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Db from '../libs/db';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
    ) as JwtPayload;

    const user = await Db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized access',
    });
  }
};

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await Db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      res.status(403).json({
        message: 'You are not authorized to perform this action',
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Error checking admin role:', error);
    res.status(500).json({ message: 'Error checking admin role' });
  }
};
