export class ApiEndPoints {
  static readonly BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ;
  
  
  static AUTH = {
    CURRENT_USER : '/api/v1/users/current-user',
    LOGIN : '/api/v1/users/login',
    REGISTER : '/api/v1/users/register',
    LOGOUT : '/api/v1/users/logout',
    GOOGLE_LOGIN : '/api/v1/users/google',
    GOOGLE_LOGIN_CALLBACK : '/api/v1/users/google/callback',
    GIT_LOGIN : '/api/v1/users/github',
    GIT_LOGIN_CALLBACK : '/api/v1/users/github/callback',
    REFRESH_TOKEN : '/api/v1/users/refresh-token',
    FORGOT_PASSWORD : '/api/v1/users/forgot-password',
    RESET_PASSWORD : '/api/v1/users/change-password',
  } 

  static PROFILE = {
    UPLOAD_AVATAR : '/api/v1/users/avatar',
  }

}