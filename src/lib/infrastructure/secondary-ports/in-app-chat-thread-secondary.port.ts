import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";
import { ClinicianChatThreadDTO, FacilityUserChatThreadDTO } from "../models/chat-thread.dto";

export const IN_APP_CHAT_THREAD_SECONDARY_PORT: InjectionToken<InAppChatThreadSecondaryPort> = new InjectionToken(
  'IN_APP_CHAT_THREAD_SECONDARY_PORT'
);

export interface InAppChatThreadSecondaryPort {
  getClinicianChatThreads(): Observable<ClinicianChatThreadDTO[]>;

  getFacilityUserChatThreads(): Observable<FacilityUserChatThreadDTO[]>;

  getChatThreadId(clinicianId: string, facilityId: string): Observable<{ threadId: string }>;

  createChatThread(clinicianId: string, facilityId: string): Observable<{ threadId: string }>;

}
