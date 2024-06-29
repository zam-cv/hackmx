import { post, get } from "./methods";

export interface UserInformation {
  username: string;
  email: string;
}

export interface Session {
  token: string;
  user_information: UserInformation;
}

export default {
  auth: {
    register: (username: string, email: string, password: string): Promise<void> => {
      return post("/auth/user/register", { username, email, password }, false);
    },
    signin: (email: string, password: string): Promise<Session> => {
      return post("/auth/user/signin", { email, password }, false);
    },
    verify: (): Promise<UserInformation> => {
      return get("/auth/user/verify");
    }
  }
};
