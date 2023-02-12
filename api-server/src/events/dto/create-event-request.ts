import {ApiProperty} from "@nestjs/swagger";
import {StartEndTimePairs} from "../../shared-types/start-end-time-pairs";
import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";
import cloneAttributes from "../../utils/clone-attributes";
import {
    IsNotEmpty,
    IsOptional
} from "class-validator";
import {Exclude} from "class-transformer";

const EXAMPLE_START_DATE = new Date(new Date().setDate(new Date().getHours() + 1));
const EXAMPLE_END_DATE = new Date(new Date().setDate(new Date().getHours() + 2));

export class CreateEventRequest {
    constructor(copy?: CreateEventRequest) {
        if (isNotNullOrUndefined(copy)) {
            cloneAttributes<CreateEventRequest>(copy, this)
        }
    }

    @Exclude()
    id?: string

    @ApiProperty({example: 'f467e7a0-a066-11ea-aa51-cdc3fe7afefa'})
    @IsOptional()
    venue_id?: string;

    @ApiProperty({example: 'Infinite Gallery Opening'})
    @IsNotEmpty()
    title: string;

    @ApiProperty({example: 'infinite-gallery-opening'})
    @IsOptional()
    slug: string;

    @ApiProperty({example: false})
    @IsOptional()
    multi_day: boolean;

    @ApiProperty({example: 'https://i.picsum.photos/id/258/536/354.jpg?hmac=FJZvafgClrsfFxn1Ce6YeBIo2958pGQCb4jCbEc3SRA'})
    @IsNotEmpty()
    image: string;

    @ApiProperty({example: 'https://picsum.photos/536/354'})
    @IsOptional()
    social_image: string;

    @ApiProperty({example: '5'})
    @IsOptional()
    admission_fee: string;

    @ApiProperty({example: 'bob.vance@refridgeration.com'})
    @IsNotEmpty()
    organizer_contact: string;

    @ApiProperty({example: 'The gallery is open'})
    @IsNotEmpty()
    brief_description: string;

    @ApiProperty({example: '<h2>The Gallery Is Open</h2><p>Some details</p>'})
    @IsOptional()
    description: string;

    @ApiProperty({example: 'https://www.wegotrats.com'})
    @IsOptional()
    website_link: string;

    @ApiProperty({example: 'https://www.wegotussometickets.com'})
    @IsOptional()
    ticket_link: string;

    @ApiProperty({example: 'https://thebookwhoshallnotbenames.com/foobar'})
    @IsOptional()
    fb_event_link: string;

    @ApiProperty({example: 'https://eventbrite.com/foobar'})
    @IsOptional()
    eventbrite_link: string;

    @ApiProperty({example: 'https://bitly.com/foobar'})
    @IsOptional()
    bitly_link: string;

    @ApiProperty({example: 'radio-mc-radio-station'})
    @IsOptional()
    reviewed_by_org: boolean;

    @ApiProperty({example: [{start_time: EXAMPLE_START_DATE, end_time: EXAMPLE_END_DATE}]})
    @IsNotEmpty()
    date_times: StartEndTimePairs[];

    @ApiProperty({example: ['mode:onine']})
    @IsOptional()
    tags: Array<string>;

    @ApiProperty({example: []})
    @IsOptional()
    links: Array<string>;
}
