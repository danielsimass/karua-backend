import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';

export class CreateAccommodationTypeDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsInt()
  @Min(1)
  rooms: number;

  @IsInt()
  @Min(0)
  bathrooms: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  minOccupants?: number;

  @IsInt()
  @Min(1)
  maxOccupants: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
