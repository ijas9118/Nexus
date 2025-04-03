import { inject, injectable } from 'inversify';
import { BaseService } from '../core/abstracts/base.service';
import { TYPES } from '../di/types';
import { IMessage } from '../models/message.model';
import { IMessageRepository } from '../core/interfaces/repositories/IMessageRepository';
import { IMessageService } from '../core/interfaces/services/IMessageService';
import { Express } from 'express';
import { uploadToCloudinary } from '@/utils/cloudinaryUtils';
import { mimeToResourceType, ResourceType, subFolderMap } from '@/core/types/service/cloudinary';

@injectable()
export class MessageService extends BaseService<IMessage> implements IMessageService {
  constructor(@inject(TYPES.MessageRepository) private messageRepository: IMessageRepository) {
    super(messageRepository);
  }

  createMessage = async (message: Partial<IMessage>): Promise<IMessage> => {
    return await this.messageRepository.create(message);
  };

  getMessageById = async (messageId: string, isGroup: boolean): Promise<IMessage | null> => {
    return await this.messageRepository.getMessageById(messageId, isGroup);
  };

  getAllMessages = async (user1: string, user2: string): Promise<IMessage[]> => {
    return await this.messageRepository.getAllMessages(user1, user2);
  };

  getUsersWithChats = async (userId: string): Promise<any[]> => {
    return await this.messageRepository.getUsersWithChats(userId);
  };

  uploadFile = async (file: Express.Multer.File): Promise<{ url: string; publicId: string }> => {
    const resourceType: ResourceType =
      (mimeToResourceType[file.mimetype as keyof typeof mimeToResourceType] as ResourceType) ||
      'raw';

    const subFolder = subFolderMap[resourceType as keyof typeof subFolderMap] || 'chat';

    const { url, publicId } = await uploadToCloudinary(file, {
      baseFolder: 'chat',
      subFolder,
      resourceType,
    });

    return { url, publicId };
  };
}
