import { AxiosError } from "axios";

export const handleApi = async <T>(
  fn: () => Promise<{ data: T }>,
): Promise<T> => {
  try {
    const response = await fn();
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
};
