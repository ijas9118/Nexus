import { IMentorMetadataController } from '@/core/interfaces/controllers/IMentorMetadataController';
import { IMentorMetadataService } from '@/core/interfaces/services/IMentorMetadataService';
import { TYPES } from '@/di/types';
import { IMentorMetadata } from '@/models/mentor-metadata.model';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { injectable, inject } from 'inversify';

@injectable()
export class MentorMetadataController implements IMentorMetadataController {
  constructor(@inject(TYPES.MentorMetadataService) private service: IMentorMetadataService) {}

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const data: Partial<IMentorMetadata> = req.body;
      const metadata = await this.service.create(data);
      res.status(201).json(metadata);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  findById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const metadata = await this.service.findById(req.params.id);
      if (!metadata) {
        res.status(404).json({ message: 'Metadata not found' });
        return;
      }
      res.json(metadata);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  findAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const isAdmin = req.user?.role === 'admin';
    const includeAll = isAdmin && req.query.all === 'true';

    try {
      const query = includeAll ? {} : { isActive: true };
      const metadata = await this.service.find(query);
      res.json(metadata);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  findByType = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.params;
      const isActive = req.query.isActive !== 'false';
      const metadata = await this.service.findByType(type, isActive);
      res.json(metadata);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const metadata = await this.service.update(req.params.id, req.body);
      if (!metadata) {
        res.status(404).json({ message: 'Metadata not found' });
        return;
      }
      res.json(metadata);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  softDelete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const metadata = await this.service.softDelete(req.params.id);
      if (!metadata) {
        res.status(404).json({ message: 'Metadata not found' });
        return;
      }
      res.json(metadata);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const metadata = await this.service.restore(req.params.id);
      if (!metadata) {
        res.status(404).json({ message: 'Metadata not found' });
        return;
      }
      res.json(metadata);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
}
