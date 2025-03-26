import { storage } from "./localStorage";
export const enum GOOGLE_AUTH_SERVICE_KEY {
  GOOGLE_LOGIN_CODE = "GOOGLE_LOGIN_CODE",
  GOOGLE_LOGIN_EMAIL = "GOOGLE_LOGIN_EMAIL",
}

class LocalStorageGoogleAuthService {
  setGoogleLoginCode(code: string): void {
    storage.setLocalStorage(GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_CODE, code);
  }

  getGoogleLoginCode(): string {
    return storage.getLocalStorage(GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_CODE);
  }

  resetGoogleLoginCode(): void {
    storage.setLocalStorage(GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_CODE, "");
  }

  setGoogleLoginEmail(email: string): void {
    storage.setLocalStorage(GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_EMAIL, email);
  }

  getGoogleLoginEmail(): string {
    return storage.getLocalStorage(GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_EMAIL);
  }

  resetGoogleLoginEmail(): void {
    storage.setLocalStorage(GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_EMAIL, "");
  }
  resetAll(): void {
    this.resetGoogleLoginCode();
    this.resetGoogleLoginEmail();
  }
}
export const localStorageGoogleAuthService =
  new LocalStorageGoogleAuthService();
