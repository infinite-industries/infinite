// event_id UUID NOT NULL
// CONSTRAINT datetime_venue_event_id REFERENCES events,
//     venue_id UUID
// CONSTRAINT datetime_venue_venue_id REFERENCES venues,
//     start_time timestamp with time zone NOT NULL,
//     end_time timestamp with time zone NOT NULL,
//     title VARCHAR(255)

import { Column, ForeignKey, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
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
  title: string;
}
