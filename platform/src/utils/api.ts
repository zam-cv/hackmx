import { University } from "lucide-react";
import { post, get, del, upload } from "./methods";

export interface UserInformation {
  username: string;
  email: string;
}

export interface Session {
  token: string;
  user_information: UserInformation;
}

export interface SimpleEvent {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  map_url: string;
}

export interface Event extends SimpleEvent {
  description: string;
  quota_per_team: number;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  date: string;
}

export interface Sponsor {
  id: number;
  name: string;
  image: string;
  description: string;
  email: string;
}

export interface University {
  id: number;
  name: string;
  image: string;
  description: string;
  email_extension: string;
}

export interface Award {
  id: number;
  title: string;
}

export interface Quota {
  quota: number;
}

export interface EventTask {
  id: number;
  title: string;
  description: string;
  date: string;
}

export interface Document {
  id: number;
  name: string;
}

export interface Image {
  id: number;
  name: string;
}

export interface Message {
  id: number;
  content: string;
  date: string;
}

export interface QuestionAndAnswer {
  id: number;
  question: string;
  answer: string;
}

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  personal_email: string;
  phone: string;
  semester: number;
  campus: string;
  major: string;
  email: string;
}

export interface EventParticipant {
  confirmed: boolean;
  with_bus: boolean;
}

export interface Participant extends User {
  confirmed: boolean;
  with_bus: boolean;
  team: string;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  code: number;
}

export interface Project {
  id: number;
  name: string;
  url: string;
  zip: string;
  description: string;
}

export default {
  auth: {
    register: (
      username: string,
      email: string,
      password: string
    ): Promise<void> => {
      return post("/auth/admin/register", { username, email, password }, false);
    },
    signin: (email: string, password: string): Promise<Session> => {
      return post("/auth/admin/signin", { email, password }, false);
    },
    logout: (): Promise<void> => {
      return get("/auth/admin/logout");
    },
    verify: (): Promise<UserInformation> => {
      return get("/auth/admin/verify");
    },
  },
  events: {
    get: (id: number): Promise<Event> => {
      return get(`/admin/event/all/${id}`);
    },
    create: (): Promise<Event> => {
      return post("/admin/event/create", {});
    },
    list: async (): Promise<SimpleEvent[]> => {
      return get("/admin/event/all").then((events: any) => {
        return events.map(
          ([id, title, start_date, end_date, location]: [
            number,
            string,
            string,
            string,
            string
          ]) => {
            return { id, title, start_date, end_date, location } as SimpleEvent;
          }
        );
      });
    },
    update: (event: Event): Promise<void> => {
      return post(`/admin/event/${event.id}/update`, event);
    },
    delete: (id: number): Promise<void> => {
      return del(`/admin/event/${id}`);
    },
    getParticipantsCount: (event_id: number): Promise<number> => {
      return get(`/admin/event/participants/count/${event_id}`);
    },
    getTasksCount: (event_id: number): Promise<number> => {
      return get(`/admin/event/tasks/count/${event_id}`);
    },
    getSponsorsCount: (event_id: number): Promise<number> => {
      return get(`/admin/event/sponsors/count/${event_id}`);
    },
    getTeamsCount: (event_id: number): Promise<number> => {
      return get(`/admin/event/teams/count/${event_id}`);
    },
    getDocumentsCount: (event_id: number): Promise<number> => {
      return get(`/admin/event/documents/count/${event_id}`);
    },
    getPublicationsCount: (event_id: number): Promise<number> => {
      return get(`/admin/event/publications/count/${event_id}`);
    },
    getParticipants: async (event_id: number): Promise<Participant[]> => {
      return get(`/admin/event/participants/${event_id}`).then(
        (participants: [User, EventParticipant, string][]) => {
          return participants.map(([user, participant, team]) => {
            return { ...user, ...participant, team } as Participant;
          });
        }
      );
    },
    getTeamsNames: (event_id: number): Promise<string[]> => {
      return get(`/admin/event/teams/${event_id}`);
    }
  },
  posts: {
    list: async (event_id: number): Promise<Post[]> => {
      return get(`/admin/post/all/${event_id}`)
    },
    create: (
      event_id: number,
      title: string,
      description: string
    ): Promise<number> => {
      return post(`/admin/post/create/${event_id}`, { title, description });
    },
    delete: (id: number): Promise<void> => {
      return del(`/admin/post/${id}`);
    },
  },
  storage: {
    createSponsor: (): Promise<Sponsor> => {
      return post("/admin/storage/sponsor/create", {});
    },
    listSponsors: (): Promise<Sponsor[]> => {
      return get("/admin/storage/sponsor/all");
    },
    updateSponsor: (sponsor: Sponsor): Promise<Sponsor> => {
      return post(`/admin/storage/sponsor/${sponsor.id}/update`, sponsor);
    },
    uploadSponsorImage: (
      id: number,
      file: File,
      metadata: Object
    ): Promise<Sponsor> => {
      return upload(
        `/admin/storage/sponsor/update/image/${id}`,
        file,
        metadata
      );
    },
    deleteSponsorImage: (id: number): Promise<void> => {
      return del(`/admin/storage/sponsor/delete/image/${id}`);
    },
    uploadUniversityImage: (
      id: number,
      file: File,
      metadata: Object
    ): Promise<University> => {
      return upload(
        `/admin/storage/university/update/image/${id}`,
        file,
        metadata
      );
    },
    deleteUniversityImage: (id: number): Promise<void> => {
      return del(`/admin/storage/university/delete/image/${id}`);
    },
    deleteSponsor: (id: number): Promise<void> => {
      return del(`/admin/storage/sponsor/${id}`);
    },
    createUniversity: (): Promise<University> => {
      return post("/admin/storage/university/create", {});
    },
    listUniversities: (): Promise<University[]> => {
      return get("/admin/storage/university/all");
    },
    updateUniversity: (university: University): Promise<void> => {
      return post(
        `/admin/storage/university/${university.id}/update`,
        university
      );
    },
    deleteUniversity: (id: number): Promise<void> => {
      return del(`/admin/storage/university/${id}`);
    },
  },
  sponsors: {
    add: (event_id: number, sponsor_id: number): Promise<Sponsor> => {
      return post(`/admin/sponsor/add/${event_id}/${sponsor_id}`, {});
    },
    delete: (event_id: number, sponsor_id: number): Promise<void> => {
      return del(`/admin/sponsor/delete/${event_id}/${sponsor_id}`);
    },
    deleteAward: (award_id: number): Promise<void> => {
      return del(`/admin/sponsor/delete_award/${award_id}`);
    },
    addAward: (
      event_id: number,
      sponsor_id: number,
      award: string
    ): Promise<number> => {
      return post(`/admin/sponsor/add_award/${event_id}/${sponsor_id}`, {
        title: award,
      });
    },
    getSponsorsNotInEvent: (event_id: number): Promise<Sponsor[]> => {
      return get(`/admin/sponsor/not_in_event/${event_id}`);
    },
    getSponsorsInEvent: (event_id: number): Promise<[Sponsor, Award[]][]> => {
      return get(`/admin/sponsor/event/${event_id}`);
    },
  },
  university: {
    list: (event_id: number): Promise<[University, Quota | null][]> => {
      return get(`/admin/university/all/${event_id}`);
    },
    addQuota: (
      event_id: number,
      university_id: number,
      quota: number
    ): Promise<void> => {
      return post(
        `/admin/university/add_quota/${event_id}/${university_id}`,
        quota
      );
    },
  },
  tasks: {
    list: async (event_id: number): Promise<EventTask[]> => {
      return get(`/admin/event/all_tasks/${event_id}`);
    },
    create: (event_id: number, task: EventTask): Promise<number> => {
      return post(`/admin/event/add_task/${event_id}`, task);
    },
    delete: (id: number): Promise<void> => {
      return del(`/admin/event/delete_task/${id}`);
    },
  },
  documents: {
    upload: (
      event_id: number,
      file: File,
      metadata: Object
    ): Promise<Document> => {
      return upload(`/admin/document/upload/${event_id}`, file, metadata);
    },
    delete: (document_id: number): Promise<void> => {
      return del(`/admin/document/delete/${document_id}`);
    },
    list: (event_id: number): Promise<Document[]> => {
      return get(`/admin/document/all/${event_id}`);
    },
  },
  gallery: {
    upload: (
      event_id: number,
      file: File,
      metadata: Object
    ): Promise<Image> => {
      return upload(`/admin/gallery/upload/${event_id}`, file, metadata);
    },
    delete: (image_id: number): Promise<void> => {
      return del(`/admin/gallery/delete/${image_id}`);
    },
    list: (event_id: number): Promise<Image[]> => {
      return get(`/admin/gallery/all/${event_id}`);
    },
  },
  messages: {
    list: (event_id: number): Promise<[Message, string, string | null][]> => {
      return get(`/admin/message/all/${event_id}`);
    },
  },
  fqa: {
    list: async (event_id: number): Promise<QuestionAndAnswer[]> => {
      return get(`/admin/fqa/all/${event_id}`);
    },
    create: (
      event_id: number,
      question: string,
      answer: string
    ): Promise<number> => {
      return post(`/admin/fqa/create/${event_id}`, { question, answer });
    },
    delete: (id: number): Promise<void> => {
      return del(`/admin/fqa/${id}`);
    },
  },
  participant: {
    updateConfirmation: (event_id: number, user_id: number, value: string): Promise<void> => {
      return post(`/admin/participant/update-confirmed/${event_id}/${user_id}`, value as any);
    }
  },
  tec: {
    getCampus: (): Promise<string[]> => {
      return get("/admin/tec/campus_list");
    }
  },
  teams: {
    getTeams: (event_id: number): Promise<[Team, [Project, string] | null, [string, string][]][]> => {
      return get(`/admin/teams/${event_id}`);
    }
  }
};
