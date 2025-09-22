import {
  BelongsToMany,
  Column,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from './user.model';

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

  // Many-to-many association with users
  @BelongsToMany(() => UserModel, {
    through: 'users_partners_mappings',
    foreignKey: 'partner_id',
    otherKey: 'user_id',
    as: 'users',
  })
  users: UserModel[];
}
