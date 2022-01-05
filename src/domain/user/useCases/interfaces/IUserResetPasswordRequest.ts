export interface IUserResetPasswordRequest {
  name: string;
  token: string;
  password: string;
  passwordRepeated: string;
}
