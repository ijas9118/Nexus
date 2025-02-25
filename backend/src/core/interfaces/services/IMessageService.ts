import { IMessage } from "../../../models/message.model";

export interface IMessageService {
  createNewMessage(data: {
    chatId: string;
    sender: string;
    text: string;
  }): Promise<IMessage>;

  getAllMessages(chatId: string): Promise<IMessage[]>;
}
