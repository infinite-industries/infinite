import { BelongsTo, Column, ForeignKey, HasMany, HasOne, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { VenueModel } from '../../venues/models/venue.model';
import { Event } from './event.model';

@Table({tableName: 'datetime_venue'})
export class DatetimeVenueModel extends Model<DatetimeVenueModel> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Column
  @ForeignKey(() => Event)
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

  @BelongsTo(() => Event)
  event: Event

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
}
