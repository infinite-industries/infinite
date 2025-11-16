import {
  BelongsToMany,
  Column,
  DataType,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { PartnerModel } from './partner.model';

const SAMPLE_DATE = new Date();

@Table({ tableName: 'users' })
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
  identifier: string;

  @Column(DataType.JSONB)
  settings: Record<string, unknown>;

  @Column(DataType.JSONB)
  permissions_post_as_venues: Record<string, unknown>;

  @Column(DataType.JSONB)
  permissions_edit_lists: Record<string, unknown>;

  @Column
  @ApiProperty({ example: SAMPLE_DATE })
  createdAt: Date;

  @Column
  @ApiProperty({ example: SAMPLE_DATE })
  updatedAt: Date;

  // Many-to-many association with partners
  @BelongsToMany(() => PartnerModel, {
    through: 'users_partners_mappings',
    foreignKey: 'user_id',
    otherKey: 'partner_id',
    as: 'partners',
  })
  partners: PartnerModel[];
}
