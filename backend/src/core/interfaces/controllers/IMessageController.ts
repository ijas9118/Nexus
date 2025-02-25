export interface IMessageController {
  createNewMessage(req: any, res: any): Promise<void>;
  getAllMessages(req: any, res: any): Promise<void>;
}
