import {
  BelongsTo,
  Column,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import { VenueModel } from '../../venues/models/venue.model';
import { EventModel } from './event.model';

@Table({tableName: 'datetime_venue'})
export class DatetimeVenueModel extends Model<DatetimeVenueModel> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Column
  @ForeignKey(() => EventModel)
  event_id: string;

  @Column
  @ForeignKey(() => VenueModel)
  venue_id: string;

  @Column
  start_time: Date

  @Column
  end_time: Date;

  @Column
  optional_title: string;

  @Column
  timezone: string;

  @BelongsTo(() => EventModel)
  event: EventModel

  @BelongsTo(() => VenueModel)
  venue: VenueModel
}

export interface DateTimeVenueFields  {
  id?: string
  event_id?: string
  venue_id?: string
  start_time?: Date
  end_time?: Date
  optional_title?: string
  timezone?: string
}
