import {
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    HasOne,
    IsUUID,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {VenueModel} from "../../venues/models/venue.model";
import {ApiProperty} from "@nestjs/swagger";
import { DatetimeVenueModel } from './datetime-venue.model';
import {EventAdminMetadataModel} from "./event-admin-metadata.model";

const EXAMPLE_DATE = new Date();

@Table({tableName: 'events'})
export class EventModel extends Model<EventModel> {
    @IsUUID(4)
    @PrimaryKey
    @Column
    @ApiProperty({example: '166ab8f0-a067-11ea-aa51-cdc3fe7afefa'})
    id: string;

    @Column
    @ApiProperty({example: 'f467e7a0-a066-11ea-aa51-cdc3fe7afefa'})
    @ForeignKey(() => VenueModel)
    venue_id: string;

    @Column
    @ApiProperty({example: 'Infinite Gallery Opening'})
    title: string;

    @Column
    @ApiProperty({example: 'infinite-gallery-opening'})
    slug: string;

    @Column
    @ApiProperty({example: false})
    multi_day: boolean;

    @Column
    @ApiProperty({example: 'f467e7a0-a066-11ea-aa51-cdc3fe7afefa'})
    image: string;

    @Column
    @ApiProperty({example: 'https://s3-us-west-2.amazonaws.com/infinite-industries-event-images/uploads/a4da445e-a656-461c-8bcf-4ea8af626e81.jpg'})
    social_image: string;

    @Column
    @ApiProperty({example: '5'})
    admission_fee: string;

    @Column
    @ApiProperty({example: 'bob.vance@refridgeration.com'})
    organizer_contact: string;

    @Column
    @ApiProperty({example: 'The gallery is open'})
    brief_description: string;

    @Column
    @ApiProperty({example: '<h2>The Gallery Is Open</h2><p>Some details</p>'})
    description: string;

    @Column
    @ApiProperty({example: 'https://www.wegotrats.com'})
    website_link: string;

    @Column
    @ApiProperty({example: 'https://www.wegotussometickets.com'})
    ticket_link: string;

    @Column
    @ApiProperty({example: 'https://thebookwhoshallnotbenames.com/foobar'})
    fb_event_link: string;

    @Column
    @ApiProperty({example: 'https://eventbrite.com/foobar'})
    eventbrite_link: string;

    @Column
    @ApiProperty({example: 'https://bitly.com/foobar'})
    bitly_link: string;

    @Column
    @ApiProperty({example: true})
    verified: boolean;

    @Column
    @ApiProperty({example: EXAMPLE_DATE})
    createdAt: Date;

    @Column
    @ApiProperty({example: EXAMPLE_DATE})
    updatedAt: Date;

    @Column
    @ApiProperty({example: 'radio-mc-radio-station'})
    reviewed_by_org: boolean;

    @Column(DataType.ARRAY(DataType.STRING))
    @ApiProperty({example: ['mode:online', 'category:single-day-event', 'music']})
    tags: Array<string>;

    @Column(DataType.ARRAY(DataType.STRING))
    @ApiProperty({example: []})
    links: Array<string>;

    @HasMany(() => DatetimeVenueModel)
    date_times?: DatetimeVenueModel []

    @BelongsToMany(() => VenueModel, () => DatetimeVenueModel)
    venues: VenueModel[]

    @HasOne(() => EventAdminMetadataModel)
    event_admin_meta_data?: EventAdminMetadataModel
}
