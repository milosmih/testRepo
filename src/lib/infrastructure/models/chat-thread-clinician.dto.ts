import { UserLevels } from 'src/app/models/user-models/user-levels.enum';

export interface ChatThreadClinicianDTO {
  id: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  role: UserLevels;
}