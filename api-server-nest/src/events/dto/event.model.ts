import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    IsUUID,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import {Venue} from "../../venues/dto/venue.model";
import {ApiProperty} from "@nestjs/swagger";
import {StartEndTimePairs} from "../../shared-types/start-end-time-pairs";

const EXAMPLE_DATE = new Date();
const EXAMPLE_START_DATE = new Date(new Date().setDate(new Date().getHours() + 1));
const EXAMPLE_END_DATE = new Date(new Date().setDate(new Date().getHours() + 2));

@Table({tableName: 'events'})
export class Event extends Model<Event> {
    @IsUUID(4)
    @PrimaryKey
    @Column
    @ApiProperty({example: '166ab8f0-a067-11ea-aa51-cdc3fe7afefa'})
    id: string;

    @Column
    @ApiProperty({example: 'f467e7a0-a066-11ea-aa51-cdc3fe7afefa'})
    @ForeignKey(() => Venue)
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
    @ApiProperty({example: '549 Gallery Dr'})
    address: string;

    @Column
    @ApiProperty({example: 'bob.vance@refridgeration.com'})
    organizer_contact: string;

    @Column
    @ApiProperty({example: 'https://www.google.com/maps/things/and/stuff'})
    map_link: string;

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

    @Column(DataType.JSONB)
    @ApiProperty({example: [{start_time: EXAMPLE_START_DATE, end_time: EXAMPLE_END_DATE}]})
    date_times: StartEndTimePairs[];

    @Column(DataType.ARRAY(DataType.STRING))

    @ApiProperty({example: ['remote']})
    tags: Array<string>;

    @Column(DataType.ARRAY(DataType.STRING))
    @ApiProperty({example: []})
    links: Array<string>;

    @BelongsTo(() => Venue)
    venue: Venue;
}
