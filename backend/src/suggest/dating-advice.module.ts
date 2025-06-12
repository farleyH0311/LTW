// ✅ File: dating-advice.module.ts
import { Module } from '@nestjs/common';
import { DatingAdviceController } from './dating-advice.controller';
import { DatingAdviceService } from './dating-advice.service';
import { PrismaService } from '../prisma.service';
import { VertexService } from '../vertex/vertex.service';
import { VertexModule } from '../vertex/vertex.module';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule, VertexModule],
  controllers: [DatingAdviceController],
  providers: [DatingAdviceService, VertexService, PrismaService],
})
export class DatingAdviceModule {}
