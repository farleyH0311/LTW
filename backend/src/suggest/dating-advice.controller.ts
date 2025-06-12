import { Controller, Post, Body } from '@nestjs/common';
import { DatingAdviceService } from './dating-advice.service';

@Controller('dating-advice')
export class DatingAdviceController {
  constructor(private readonly service: DatingAdviceService) {}

 @Post()
async getAdvice(
  @Body() body: { userId: number; partnerId: number; question?: string }
) {
  if (body.question) {
    return {
      result: await this.service.generateAdviceWithPrompt(body.userId, body.partnerId, body.question),
    };
  }
  
}

}
