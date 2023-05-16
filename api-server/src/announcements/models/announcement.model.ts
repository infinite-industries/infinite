import { Column, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'announcements' })
export class AnnouncementModel extends Model<AnnouncementModel> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  @ApiProperty({ example: '166ab8f0-a067-11ea-aa51-cdc3fe7afefa' })
  id: string;

  @Column
  @ApiProperty({
    example:
      "Don't go near that elevator - that's just what they want us to do...",
  })
  message: string;
}
