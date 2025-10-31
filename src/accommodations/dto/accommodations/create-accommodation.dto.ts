import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';

export class CreateAccommodationDto {
  @IsUUID()
  accommodationTypeId: string;

  @IsString()
  @Length(1, 50)
  identifier: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  floor?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
