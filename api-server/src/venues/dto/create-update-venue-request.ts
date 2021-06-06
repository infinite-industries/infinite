import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateVenueRequest {
    @ApiProperty({example: 'Bob Vance\'s Chill Bar'})
    @IsNotEmpty()
    name: string;

    @ApiProperty({example: '232 Paper St. Scranton, 18503'})
    @IsOptional()
    address?: string;

    @ApiProperty({example: 'https://maps.google.com/maps/foo/bar'})
    @IsOptional()
    g_map_link?: string;
}

export class UpdateVenueRequest {
    @ApiProperty({example: 'Bob Vance\'s Chill Bar'})
    @IsOptional()
    name?: string;

    @ApiProperty({example: '232 Paper St. Scranton, 18503'})
    @IsOptional()
    address?: string;

    @ApiProperty({example: 'https://maps.google.com/maps/foo/bar'})
    @IsOptional()
    g_map_link?: string;
}
