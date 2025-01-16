import { RequestHandler } from "express";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/Users/UserRepository";
import { isValidEmail } from "../utils/validation";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const signUp: RequestHandler = async (req, res) => {
  try {
    if (!isValidEmail(req.body.email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }
    const user = await userService.signUp(req.body);
    res.status(201).json({ message: "Registerd successfully", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    if (!isValidEmail(req.body.email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    res.status(200).json({ message: "Login successfull", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
