import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Column } from 'sequelize-typescript';

export class CreateVenueRequest {
  @ApiProperty({ example: "Bob Vance's Chill Bar" })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '232 Paper St. Scranton, 18503' })
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'https://maps.google.com/maps/foo/bar' })
  @IsOptional()
  g_map_link?: string;

  @Column
  @ApiProperty({ example: 32.7 })
  @IsOptional()
  gps_lat?: number;

  @Column
  @ApiProperty({ example: 76.3 })
  @IsOptional()
  gps_long?: number;

  @Column
  @ApiProperty({ example: 17.1 })
  @IsOptional()
  gps_alt?: number;

  @ApiProperty({ example: '232 Paper St.' })
  @IsOptional()
  street?: string;

  @ApiProperty({ example: 'Scranton' })
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'Pennsylvania' })
  @IsOptional()
  state?: string;

  @ApiProperty({ example: '18503' })
  @IsOptional()
  zip?: string;

  @ApiProperty({ example: 'Downtown' })
  @IsOptional()
  neighborhood?: string;
}

export class UpdateVenueRequest {
  @ApiProperty({ example: "Bob Vance's Chill Bar" })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: '232 Paper St., Scranton, Pennsylvania, 18503, Downtown',
  })
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '232 Paper St.' })
  @IsOptional()
  street?: string;

  @ApiProperty({ example: 'Scranton' })
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'Pennsylvania' })
  @IsOptional()
  state?: string;

  @ApiProperty({ example: '18503' })
  @IsOptional()
  zip?: string;

  @ApiProperty({ example: 'Downtown' })
  @IsOptional()
  neighborhood?: string;

  @ApiProperty({ example: 'https://maps.google.com/maps/foo/bar' })
  @IsOptional()
  g_map_link?: string;

  @Column
  @ApiProperty({ example: 32.7 })
  @IsOptional()
  gps_lat?: number;

  @Column
  @ApiProperty({ example: 76.3 })
  @IsOptional()
  gps_long?: number;

  @Column
  @ApiProperty({ example: 17.1 })
  @IsOptional()
  gps_alt?: number;
}
