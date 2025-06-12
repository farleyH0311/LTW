import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Headers,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { profile, users } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { AccessTokenGuard } from '../auth/guard/access-token.guard';
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post(':id/profile')
  async createProfile(
    @Param('id', ParseIntPipe) userId: number,
    @Body() createProfileDto: CreateUserDto,
  ): Promise<profile> {
    return this.userService.createProfile(userId, createProfileDto);
  }
  @Get(':id/profile')
  getProfile(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authHeader: string,
  ): Promise<profile> {
    // console.log('Authorization header:', authHeader);
    return this.userService.getProfile(id);
  }
  @Get(':id')
  getProfileByIdProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<profile> {
    //console.log('get profile api=> ', id);
    return this.userService.getProfileByIdProfile(id);
  }
  @Get(':id/friends')
  async getFriends(@Param('id', ParseIntPipe) userId: number) {
  const friends = await this.userService.getFriends(userId);
  return friends; // Trả về array JSON an toàn
}


  @Put(':id/profile')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<profile> {
    //console.log('update profile api=> ', id);

    if (data.age && typeof data.age === 'string') {
      data.age = parseInt(data.age, 10);
    }

    return this.userService.updateProfile(id, data);
  }
  @Get()
  getAllUsers(): Promise<profile[]> {
    //console.log('get all users api');
    return this.userService.getAllUsers();
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user ID');
    return this.userService.deleteUser(userId);
  }
  @Get('userId/:profileId')
  async getUserIdByProfileId(@Param('profileId') profileId: string) {
    const id = parseInt(profileId, 10);
    return this.userService.getUserIdByProfileId(id);
  }
}
