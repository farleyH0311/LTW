import { Module } from '@nestjs/common';
import { VertexService } from './vertex.service';
import { VertexController } from './vertex.controller';

@Module({
  controllers: [VertexController],
  providers: [VertexService],
  exports: [VertexService], // ✅ export để module khác dùng được
})
export class VertexModule {}
