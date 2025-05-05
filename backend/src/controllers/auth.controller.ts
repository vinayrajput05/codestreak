import ApiError from '../utils/api-error';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Db from '../libs/db';
import ApiResponse from '../utils/api-response';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body; // Extract user details from request body

  try {
    // Check if a user with the given email already exists
    const existingUser = await Db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(400, 'User already exists');
    }

    // Hash the user's password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await Db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER', // Default role as USER
      },
    });

    // Generate a JWT access token
    const token = jwt.sign(
      { id: newUser.id }, // Payload
      process.env.JWT_ACCESS_TOKEN_SECRET as string, // Secret key
      { expiresIn: '7d' }, // Token expiry
    );

    // Set the JWT token in an HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // Respond with the new user’s data (excluding the password)
    res.status(200).json(
      new ApiResponse(
        200,
        {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          image: newUser.image, // Optional if image exists
        },
        'User created successfully',
      ),
    );
  } catch (error) {
    console.log('controller register', error);
    throw new ApiError(500, 'Something went wrong');
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await Db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(400, 'User not found');
    }

    // Compare the provided password with the hashed one in DB
    const isPasswordValid = bcrypt.compare(password, user.password as string);

    if (!isPasswordValid) {
      throw new ApiError(400, 'Invalid credentials');
    }

    // Create a new JWT token for the logged-in user
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      { expiresIn: '7d' },
    );

    // Set the token in a secure cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // Send a success response with user data (excluding password)
    res.status(200).json(
      new ApiResponse(
        200,
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
        'User logged in successfully',
      ),
    );
  } catch (error) {
    console.log('controller login', error);
    throw new ApiError(500, 'Something went wrong');
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the JWT cookie to log the user out
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 0, // Clear cookie immediately
    });
    res
      .status(200)
      .json(new ApiResponse(200, '', 'User logged out successfully'));
  } catch (error) {
    console.log('controller logout', error);
    throw new ApiError(500, 'Something went wrong');
  }
};

export const check = async (req: Request, res: Response) => {
  try {
    // If middleware has set req.user, the user is authenticated
    res
      .status(200)
      .json(new ApiResponse(200, req.user, 'User is authenticated'));
  } catch (error) {
    console.log('controller check', error);
    throw new ApiError(500, 'Something went wrong');
  }
};
