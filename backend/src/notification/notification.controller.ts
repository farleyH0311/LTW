import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly service: NotificationService,
  ) {}

  @Post()
  create(@Body() dto: CreateNotificationDto) {
    return this.service.create(dto);
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.service.findAllByUser(
      Number(userId),
      Number(page) || 1,
      Number(pageSize) || 10,
    );
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNotificationDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  @Patch('user/:userId/read-all')
  markAllAsRead(@Param('userId') userId: string) {
    return this.service.markAllAsRead(+userId);
  }

}
