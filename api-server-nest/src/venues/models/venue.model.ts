import {Column, IsUUID, Model, PrimaryKey, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

const EXAMPLE_STATE = new Date();

@Table({tableName: 'venues'})
export class Venue extends Model<Venue> {
    @PrimaryKey
    @IsUUID(4)
    @Column
    id: string;

    @Column
    @ApiProperty({example: 'Bob Vance\'s Chill Bar'})
    name: string;

    @Column
    @ApiProperty({example: 'chill-bar'})
    slug: string;

    @Column
    @ApiProperty({example: '232 Paper St. Scranton, Pennsylvania'})
    address: string;

    @Column
    @ApiProperty({example: 'https://maps.google.com/maps/foo/bar'})
    g_map_link: string;

    @Column
    @ApiProperty({example: EXAMPLE_STATE})
    createdAt: Date;

    @Column
    @ApiProperty({example: EXAMPLE_STATE})
    updatedAt: Date;
}
