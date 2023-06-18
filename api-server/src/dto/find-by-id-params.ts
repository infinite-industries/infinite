import { IsUUID } from 'class-validator';

export default class FindByIdParams {
  @IsUUID()
  id: string;
}
