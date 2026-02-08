import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import type { IMentorMetadataController } from "@/core/interfaces/controllers/i-mentor-metadata-controller";
import type { IMentorMetadataService } from "@/core/interfaces/services/i-mentor-metadata-service";
import type { IMentorMetadata } from "@/models/mentor-metadata.model";

import { TYPES } from "@/di/types";

@injectable()
export class MentorMetadataController implements IMentorMetadataController {
  constructor(@inject(TYPES.MentorMetadataService) private _service: IMentorMetadataService) {}

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const data: Partial<IMentorMetadata> = req.body;
      const metadata = await this._service.create(data);
      res.status(201).json(metadata);
    }
    catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  findById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const metadata = await this._service.findById(req.params.id as string);
      if (!metadata) {
        res.status(404).json({ message: "Metadata not found" });
        return;
      }
      res.json(metadata);
    }
    catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  findAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const isAdmin = req.user?.role === "admin";
    const includeAll = isAdmin && req.query.all === "true";

    try {
      const query = includeAll ? {} : { isActive: true };
      const metadata = await this._service.find(query);
      res.json(metadata);
    }
    catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  findByType = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.params;
      const isActive = req.query.isActive !== "false";
      const metadata = await this._service.findByType(type as string, isActive);
      res.json(metadata);
    }
    catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const metadata = await this._service.update(req.params.id as string, req.body);
      if (!metadata) {
        res.status(404).json({ message: "Metadata not found" });
        return;
      }
      res.json(metadata);
    }
    catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  softDelete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const metadata = await this._service.softDelete(req.params.id as string);
      if (!metadata) {
        res.status(404).json({ message: "Metadata not found" });
        return;
      }
      res.json(metadata);
    }
    catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const metadata = await this._service.restore(req.params.id as string);
      if (!metadata) {
        res.status(404).json({ message: "Metadata not found" });
        return;
      }
      res.json(metadata);
    }
    catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
}
