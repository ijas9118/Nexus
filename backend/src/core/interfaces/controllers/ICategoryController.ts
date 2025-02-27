import { RequestHandler } from "express";

export interface ICategoryController {
  createCategory: RequestHandler;
  updateCategory: RequestHandler;
  toggleCategory: RequestHandler;
}
