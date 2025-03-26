import { storage } from "./localStorage";

export const enum AUTH_SERVICE_KEY {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
}
class LocalStorageAuthService {
  setAccessToken(token: string): void {
    storage.setLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN, token);
  }
  getAccessToken(): string {
    return storage.getLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN);
  }

  removeAccessToken(): void {
    storage.setLocalStorage(AUTH_SERVICE_KEY.ACCESS_TOKEN, "");
  }

  getRefreshToken(): string {
    return storage.getLocalStorage(AUTH_SERVICE_KEY.REFRESH_TOKEN);
  }
}

export const localStorageAuthService = new LocalStorageAuthService();
