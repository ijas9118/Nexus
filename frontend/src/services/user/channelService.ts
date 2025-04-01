import { CHANNEL_ROUTES } from "@/utils/constants";
import api from "../api";
import { AxiosError } from "axios";

export const ChannelService = {
  createChannel: async (data: any) => {
    try {
      const response = await api.post(CHANNEL_ROUTES.CREATE_CHANNEL, {
        ...data,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw error.response?.data || error.message;
      } else if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    }
  },

  getUserChannels: async () => {
    try {
      const response = await api.get(CHANNEL_ROUTES.GET_USER_CHANNELS);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw error.response?.data || error.message;
      } else if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    }
  },

  getChannelMessages: async (channelId: string) => {
    try {
      const response = await api.get(
        `${CHANNEL_ROUTES.GET_CHANNEL_MESSAGES}/${channelId}`,
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw error.response?.data || error.message;
      } else if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    }
  },
};
