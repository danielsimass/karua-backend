import { PartialType } from '@nestjs/swagger';
import { CreateAccommodationTypeDto } from './create-accommodation-type.dto';

export class UpdateAccommodationTypeDto extends PartialType(CreateAccommodationTypeDto) {}
