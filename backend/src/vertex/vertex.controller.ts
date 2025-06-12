import { Controller, Post, Body } from '@nestjs/common';
import { VertexService } from './vertex.service';

@Controller('vertex')
export class VertexController {
  constructor(private readonly vertexService: VertexService) {}

  @Post('ask')
  async ask(@Body() body: { prompt: string }) {
    return this.vertexService.ask(body.prompt);
  }
}
