import {Column, DataType, IsUUID, Model, PrimaryKey, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

const SAMPLE_GUID = '166ab8f0-a067-11ea-aa51-cdc3fe7afefa'
const SAMPLE_DATE = new Date();

@Table({tableName: 'users'})
export class UserModel extends Model<UserModel> {
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    @Column
    name: string;

    @Column
    nickname: string;

    @Column
    picture: string;

    @Column
    identifier: string

    @Column(DataType.JSONB)
    settings: Record<string, unknown>

    @Column(DataType.JSONB)
    permissions_post_as_venues: Record<string, unknown>

    @Column(DataType.JSONB)
    permissions_edit_lists: Record<string, unknown>


    @Column
    @ApiProperty({example: SAMPLE_DATE})
    createdAt: Date;

    @Column
    @ApiProperty({example: SAMPLE_DATE})
    updatedAt: Date;
}