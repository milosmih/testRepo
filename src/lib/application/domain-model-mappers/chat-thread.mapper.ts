import { DefaultClinicianPhotoUrl, DefaultFacilityPhotoUrl } from "../../domain/constants/avatar.constants";
import { ChatThread } from "../../domain/models/chat-thread";
import { ClinicianChatThreadDTO, FacilityUserChatThreadDTO } from "../../infrastructure/models/chat-thread.dto";

export class ChatThreadMapper {

  static fromFacilityUserDTO(dto: FacilityUserChatThreadDTO): ChatThread {
    return new ChatThread(
      dto.threadId,
      dto.lastMessage,
      dto.metadata,
      dto.clinician ? `${dto.clinician.firstName} ${dto.clinician.lastName}` : 'Unknown clinician',
      dto.clinician?.photoURL ? dto.clinician.photoURL : DefaultClinicianPhotoUrl
    )
  }

  static fromClinicianDTO(dto: ClinicianChatThreadDTO): ChatThread {
    return new ChatThread(
      dto.threadId,
      dto.lastMessage,
      dto.metadata,
      dto.facility ? dto.facility.name : 'Unknown facility',
      dto.facility?.photoURL ? dto.facility.photoURL : DefaultFacilityPhotoUrl
    )
  }
}
