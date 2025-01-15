import { RequestHandler } from "express";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/Users/UserRepository";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const signUp: RequestHandler = async (req, res) => {
  try {
    const user = await userService.signUp(req.body);
    res.status(201).json({ message: "Registerd successfully", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    res.status(200).json({ message: "Login successfull", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
