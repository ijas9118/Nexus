export interface LoginResponseDto {
  name: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
}
