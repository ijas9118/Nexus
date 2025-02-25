import { IMessage } from "../../../models/message.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IMessageRepository extends BaseRepository<IMessage> {
  createNewMessage(data: {
    chatId: string;
    sender: string;
    text: string;
  }): Promise<IMessage>;

  getAllMessages(chatId: string): Promise<IMessage[]>;
}
