import {Column, IsUUID, Model, PrimaryKey, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

const EXAMPLE_STATE = new Date();

@Table({tableName: 'venues'})
export class VenueModel extends Model<VenueModel> {
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
    @ApiProperty({example: 32.7 })
    gps_lat: number

    @Column
    @ApiProperty({example: 76.3 })
    gps_long: number

    @Column
    @ApiProperty({example: 17.1 })
    gps_alt: number

    @Column
    @ApiProperty({example: '232 Paper St.'})
    street: string;

    @Column
    @ApiProperty({example: 'Scranton'})
    city: string;

    @Column
    @ApiProperty({example: 'Pennsylvania'})
    state: string;

    @Column
    @ApiProperty({example: '18503'})
    zip: string;

    @Column
    @ApiProperty({example: 'Downtown'})
    neighborhood: string;

    @Column
    @ApiProperty({ example: false })
    is_soft_deleted: boolean;

    @Column
    @ApiProperty({example: EXAMPLE_STATE})
    createdAt: Date;

    @Column
    @ApiProperty({example: EXAMPLE_STATE})
    updatedAt: Date;
}
