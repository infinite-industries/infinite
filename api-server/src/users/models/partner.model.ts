import {
  Column,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

const SAMPLE_DATE = new Date();

@Table({
  tableName: 'partners',
  indexes: [
    {
      unique: true,
      fields: ['name'],
      name: 'partners_name_lowercase_unique',
    },
  ],
})
export class PartnerModel extends Model<PartnerModel> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Column({ unique: true })
  name: string;

  @Column
  logo_url: string;

  @Column
  @ApiProperty({ example: SAMPLE_DATE })
  createdAt: Date;

  @Column
  @ApiProperty({ example: SAMPLE_DATE })
  updatedAt: Date;
}
