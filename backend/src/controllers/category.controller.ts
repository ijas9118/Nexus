import { Request, Response } from "express";
import { ICategoryController } from "../core/interfaces/controllers/ICategoryController";
import { CategoryService } from "../services/category.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";

@injectable()
export class CategoryController implements ICategoryController {
  constructor(@inject(TYPES.CategoryService) private categoryService: CategoryService) {}

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      const category = await this.categoryService.addCategory(name);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating category", error: error.message });
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, newName } = req.body;
      const updatedCategory = await this.categoryService.updateCategory(id, newName);
      if (updatedCategory) {
        res.status(200).json(updatedCategory);
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error updating category", error: error.message });
    }
  };

  toggleCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const toggledCategory = await this.categoryService.toggleCategory(id);
      if (toggledCategory) {
        res.status(200).json(toggledCategory);
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error toggling category", error: error.message });
    }
  };

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryService.getAllCategories();
      
      res.status(200).json(categories);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching categories", error: error.message });
    }
  };
}
