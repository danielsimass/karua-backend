import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostsService } from './hosts.service';
import { HostsController } from './hosts.controller';
import { HostsAdminController } from './hosts-admin.controller';
import { Host } from './entities/host.entity';
import { LegalRepresentative } from './entities/legal-representative.entity';
import { HostsRepository, LegalRepresentativesRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Host, LegalRepresentative])],
  controllers: [HostsController, HostsAdminController],
  providers: [HostsService, HostsRepository, LegalRepresentativesRepository],
  exports: [HostsService],
})
export class HostsModule {}
