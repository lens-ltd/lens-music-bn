import db from '../../models';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import { validateEmail } from '../utils/validations';
import { comparePassword, hashPassword } from '../utils/passwords';

// LOAD MODELS
const { user } = db;

// CONFIGURE DOTENV
dotenv.config();

// LOAD ENV VARIABLES
const { JWT_SECRET } = process.env;

// CONTROLLER
class AuthController {
    // SIGNUP
    static async signup(req, res) {
        try {
            const { name, email, phone, role = 'user', password } = req.body;

            // CHECK IF REQUIRED FIELDS ARE EMPTY
            if (!name || !email) {
                return res.status(400).json({ message: 'Name and email are required' });
            }

            // VALIDATE EMAIL
            const emailIsValid = validateEmail(email);

            // RETURN ERROR IF EMAIL IS INVALID
            if (emailIsValid.error) {
                return res.status(400).json({ message: 'Invalid email address' });
            }

            // CHECK IF EMAIL ALREADY EXISTS
            const emailExists = await user.findOne({
                where: { email },
            });

            // RETURN ERROR IF USER EXISTS
            if (emailExists) {
                return res.status(409).json({ message: 'Email already exists' });
            }

            // CHECK IF PHONE NUMBER ALREADY EXISTS
            const phoneExists = await user.findOne({
                where: { phone },
            });

            // RETURN ERROR IF PHONE NUMBER EXISTS
            if (phoneExists) {
                return res.status(409).json({ message: 'Phone number already exists' });
            }

            // HASH PASSWORD
            const hashedPassword = await hashPassword(password);

            // CREATE NEW USER
            const newUser = await user.create({ name, email, phone, role, password: hashedPassword });

            // GENERATE TOKEN\
            const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
                expiresIn: '1w',
            });

            // RETURN NEW USER
            return res.status(201).json({
                message: 'User created successfully',
                data: {
                    user: {
                        ...newUser.dataValues,
                        password: undefined,
                    },
                    token
                },
            });

            // CATCH ANY ERRORS
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // LOGIN
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // CHECK IF REQUIRED FIELDS ARE EMPTY
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            // FIND USER
            const userExists = await user.findOne({ where: { email } });

            // RETURN ERROR IF USER DOES NOT EXIST
            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            }

            // COMPARE PASSWORDS
            const passwordMatch = await comparePassword(password, userExists.password);

            // RETURN ERROR IF PASSWORDS DO NOT MATCH
            if (!passwordMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // GENERATE TOKEN
            const token = jwt.sign({ id: userExists.id, email: userExists.email, role: userExists.role }, JWT_SECRET, {
                expiresIn: '1w',
            });

            // RETURN USER
            return res.status(200).json({
                message: 'User logged in successfully',
                data: {
                    user: {
                        ...userExists.dataValues,
                        password: undefined,
                    },
                    token
                },
            });

            // CATCH ANY ERRORS
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default AuthController;
