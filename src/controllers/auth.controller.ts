import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { validateEmail } from '../utils/validations';

// INITIALIZE USER SERVICE
const userService = new UserService();

// LOAD ENVIROMENT VARIABLES
const { JWT_SECRET } = process.env;

export const AuthController = {
  // SIGNUP
  async signup(req: Request, res: Response) {
    try {
      const { email, name, phone, password, role } = req.body;

      // CHECK IF REQUIRED FIELDS ARE PROVIDED
      if (!email || !name || !password) {
        return res
          .status(400)
          .json({ message: 'Email, name, and password are required' });
      }

      // VALIDATE EMAIL
      const { error } = validateEmail(email);
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      // CHECK IF USER EXISTS
      const userExists = await userService.findUserByEmail(email);

      if (userExists) {
        return res.status(409).json({
          message: 'User already exists',
          data: { id: userExists.id, email: userExists.email },
        });
      }

      // CREATE USER
      const newUser = await userService.signup({
        email,
        name,
        phone,
        password,
        role,
      });

      // CREATE TOKEN
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET!,
        {
          expiresIn: '1d',
        }
      );

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'You have signed up successfully!',
        data: {
          user: {
            ...newUser,
            password: undefined,
          },
          token,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  // LOGIN
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // CHECK IF REQUIRED FIELDS ARE PROVIDED
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // LOGIN
      const user = await userService.login({ email, password });

      // IF USER DOES NOT EXIST
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // CREATE TOKEN
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET!,
        {
          expiresIn: '1w',
        }
      );

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'You have logged in successfully!',
        data: {
          user: {
            ...user,
            password: undefined,
          },
          token,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};
