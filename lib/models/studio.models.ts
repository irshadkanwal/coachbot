import { Chat } from "./data.models";

export interface StudioSignup {
  firstName: string;
  lastName: string;
  email: string
  primaryProfession: string;
  areaOfFocus?: string;
  yearsOfExperience: string;
  ageGroup: string;
  activeClients: string;
  marketingAgreement: boolean;
  mostInterestedIn: string[];
  currentOperate: string[];
  challenge?: string;
  linkedin?: string;
  otherProfiles?: string;
  monthlyRevenue?: string;
}

export interface AssistantUser {
  id: string;
  name: string;
  email: string;
  session: {
    firstDate: Date | string | number | null;
    lastDate: Date | string | number | null;
    total: number;
  };
}
export interface AssistantUserData {
  userName: string;
  userEmail: string;
}

export type AssistantChat = Chat & AssistantUserData;