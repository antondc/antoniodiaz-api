export interface IUserResetPasswordRequest {
  name: string;
  token: string;
  newPassword: string;
}
