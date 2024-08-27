import { post, get } from "./methods";

export interface User {
  username: string;
  firstname: string;
  lastname: string;
  personal_email: string;
  phone: string;
  semester: number;
  campus?: string;
  major?: string;
  email: string;
  password: string;
}

export interface UserInformation {
  username: string;
  email: string;
}

export interface Session {
  token: string;
  user_information: UserInformation;
}

export interface Sponsor {
  id: number;
  name: string;
  image: string;
  description: string;
  email: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  quota_per_team: number;
  start_date: string;
  end_date: string;
  location: string;
  map_url: string;
}

export interface EventTask {
  id: number;
  title: string;
  description: string;
  date: string;
}

export interface QuestionAndAnswer {
  id: number;
  question: string;
  answer: string;
}

export interface RegistrationDetails {
  user_in_event: boolean,
  quota_available: boolean,
}

export interface Team {
  id: number;
  name: string;
  description: string;
  user_id: number;
}

export interface InfoTeam {
  id: number;
  name: string;
  isPrivate: boolean;
  members: number;
}

export interface ParticipantDetails {
  has_team: boolean;
  is_leader: boolean;
  team_id: number | null;
}

export interface Document {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  date: string;
}

export interface Message {
  content: string;
}

export default {
  auth: {
    register: (user: User): Promise<void> => {
      return post("/auth/user/register", user, false);
    },
    signin: (email: string, password: string): Promise<Session> => {
      return post("/auth/user/signin", { email, password });
    },
    logout: (): Promise<void> => {
      return get("/auth/user/logout");
    },
    verify: (): Promise<UserInformation> => {
      return get("/auth/user/verify");
    }
  },
  sponsors: {
    list: (): Promise<Sponsor[]> => {
      return get(`/sponsor/all`, false);
    }
  },
  tec: {
    majors: (): Promise<string[]> => {
      return get("/tec/majors", false);
    },
    campus: (): Promise<string[]> => {
      return get("/tec/campus_list", false);
    }
  },
  events: {
    list: (): Promise<Event[]> => {
      return get("/event/all");
    },
    get: (id: number): Promise<Event> => {
      return get(`/event/${id}`);
    },
    getSponsors: (event_id: number): Promise<[number, string, string][]> => {
      return get(`/event/${event_id}/sponsors`);
    },
    getParticipantsCount: (event_id: number): Promise<number> => {
      return get(`/event/${event_id}/participants/count`);
    },
    getQuota: (event_id: number): Promise<number> => {
      return get(`/event/${event_id}/universities/quota`);
    },
    getTasks: (event_id: number): Promise<EventTask[]> => {
      return get(`/event/${event_id}/tasks`);
    },
    getFQAs: (event_id: number): Promise<QuestionAndAnswer[]> => {
      return get(`/event/${event_id}/fqa`);
    },
    registerToEvent: (event_id: number, with_bus: boolean): Promise<void> => {
      return post(`/event/${event_id}/register`, { with_bus });
    },
    getRegistrationDetails: (event_id: number): Promise<RegistrationDetails> => {
      return get(`/event/${event_id}/registration-details`);
    },
    createTeam: (event_id: number): Promise<Team> => {
      return post(`/event/team/${event_id}`, {});
    },
    getTeam: async (team_id: number): Promise<Team> => {
      return get(`/event/team-info/${team_id}`);
    },
    getTeams: async (event_id: number): Promise<InfoTeam[]> => {
      return get(`/event/teams/${event_id}`).then((info: any) => {
        return info.map(
          ([id, name, isPrivate, members]: [number, string, boolean, number]) => {
            return {
              id,
              name,
              isPrivate,
              members
            }
          }
        )
      })
    },
    getCode: (event_id: number): Promise<string> => {
      return get(`/event/team/${event_id}/code`);
    },
    getParticipantDetails: (event_id: number): Promise<ParticipantDetails> => {
      return get(`/event/team/${event_id}/participant`);
    },
    getQuotaTeam: (event_id: number): Promise<number> => {
      return get(`/event/team-quota/${event_id}`);
    },
    deleteTeam: (event_id: number, team_id: number): Promise<void> => {
      return post(`/event/team/${event_id}/edit/${team_id}/delete-team`, {});
    },
    joinTeam: (event_id: number, team_id: number, code: string): Promise<void> => {
      return post(`/event/team/${event_id}/edit/${team_id}/join-team`, code as any);
    },
    getMembersWithLeader: (team_id: number): Promise<[[number, string], [number, string][]]> => {
      return get(`/event/members/team/${team_id}`);
    },
    leaveTeam: (event_id: number, team_id: number): Promise<void> => {
      return post(`/event/team/${event_id}/edit/${team_id}/leave-team`, {});
    },
    updateTeamName: (event_id: number, name: string): Promise<void> => {
      return post(`/event/update-team/${event_id}/name`, name as any);
    },
    updateTeamDescription: (event_id: number, description: string): Promise<void> => {
      return post(`/event/update-team/${event_id}/description`, description as any);
    },
    updateTeamCode: (event_id: number, code: string): Promise<void> => {
      return post(`/event/update-team/${event_id}/code`, code as any);
    },
    deleteMember: (event_id: number, member_id: number): Promise<void> => {
      return post(`/event/update-team/${event_id}/delete-member/${member_id}`, {});
    },
    getDocuments: (event_id: number): Promise<Document[]> => {
      return get(`/event/documents/${event_id}`);
    },
    getPosts: (event_id: number): Promise<Post[]> => {
      return get(`/event/posts/${event_id}`);
    },
    sendMessage: (event_id: number, content: string): Promise<void> => {
      return post(`/event/send-message/${event_id}`, { content } as Message);
    },
    getSponsorsNames: (event_id: number): Promise<string[]> => {
      return get(`/event/sponsor-names/${event_id}`);
    }
  },
  user: {
    get: (): Promise<User> => {
      return get(`/user`);
    },
    update: (user: User): Promise<void> => {
      return post(`/user/update`, user);
    },
    info: (): Promise<[number, string]> => {
      return get(`/user/info`);
    }
  }
};
