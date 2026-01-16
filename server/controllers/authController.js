import UserModel from "../models/userModel.js";
import { generateToken } from "../utils/jwtUtil.js";

const authController = {
    async register(req, res) {
        try {
            const {email, password, username} = req.body
            if(!email || !password || !username) {
                return res.status(400).json({
                    isError: true,
                    error: "Entering all fields is required"

                });
            }
            if(password.length < 10) {
                return res.status(400).json({
                    isError: true,
                    error: "Password must be at least 10 characters long"
                });
            }
            if(await UserModel.getUserByEmail(email)) {
                return  res.status(400).json({
                    isError: true,
                    error: "User with this email already exists"
                });
            }
            if(await UserModel.getUserByUsername(username)) {
                return  res.status(400).json({
                    isError: true,
                    error: "Username is already taken"
                });
            }


            else {
                const userCreated = await UserModel.createUser(email, password, username);
                res.status(201).json({
                    isError: false,
                    message: "User created successfully",
                    user: {
                        email: userCreated.email,
                        username: userCreated.username
                    }
            });
            console.log("User created: ", userCreated);
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({
                isError: true,
                error: "Internal server error"
            });

        }
    },

    async login(req, res) {
        try {
            const {email, password} = req.body;

            if(!email || !password) {
                return res.status(400).json({
                    isError: true,
                    error: "Email and password are required"
                });
            }

            const user = await UserModel.getUserByEmail(email);

            if(!user) {
                return res.status(401).json({
                    isError: true,
                    error: "Invalid email or password"
                });
            }

            const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);

            if(!isValidPassword) {
                return res.status(401).json({
                    isError: true,
                    error: "Invalid email or password"
                });
            }

            const token = generateToken({
                id: user.id,
                email: user.email,
                username: user.username
            });

            res.cookie('token', token, {
                httpOnly: true,
                //secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 10800000 // 3 hours
            });

            res.status(200).json({
                isError: false,
                message: "Login successful",
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username
                }
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                isError: true,
                error: "Internal server error"
            });
        }
    },

    async logout(req, res) {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                //secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            res.status(200).json({
                isError: false,
                message: "Logout successful"
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                isError: true,
                error: "Internal server error"
            });
        }
    },

    async me(req, res) {
        try {
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).json({
                    isError: true,
                    error: "No session"
                });
            }

            const { verifyToken } = await import('../utils/jwtUtil.js');
            const decoded = verifyToken(token);

            if (!decoded) {
                return res.status(401).json({
                    isError: true,
                    error: "Invalid or expired session"
                });
            }

            res.status(200).json({
                isError: false,
                user: {
                    id: decoded.id,
                    email: decoded.email,
                    username: decoded.username
                }
            });
        } catch (error) {
            console.log(error);
            res.status(401).json({
                isError: true,
                error: "Invalid or expired session"
            });
        }
    }
}
export default authController;