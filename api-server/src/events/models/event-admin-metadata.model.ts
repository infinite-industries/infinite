import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { EventModel } from './event.model';

@Table({ tableName: 'event_admin_metadata' })
export class EventAdminMetadataModel extends Model<EventAdminMetadataModel> {
  @PrimaryKey
  @Column
  @ForeignKey(() => EventModel)
  event_id: string;

  @Column
  is_problem: boolean;

  @BelongsTo(() => EventModel)
  event: EventModel;
}

export interface EventAdminMetadataFields {
  id?: string;
  event_id?: string;
  is_problem?: boolean;
}
