import { ChatThreadClinicianDTO } from "./chat-thread-clinician.dto";
import { ChatThreadFacilityDTO } from "./chat-thread-facility.dto";

export interface ChatThreadDTO {
  readonly threadId: string;
  readonly lastMessage: any;
  readonly metadata: any;
}

export interface FacilityUserChatThreadDTO extends ChatThreadDTO {
  readonly clinician?: ChatThreadClinicianDTO;
}

export interface ClinicianChatThreadDTO extends ChatThreadDTO {
  readonly facility?: ChatThreadFacilityDTO;
}