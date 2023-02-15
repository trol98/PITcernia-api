import { UserService } from 'src/user/services/user.service';
import { Controller } from '@nestjs/common';
import { Body, Put, Req, UseGuards } from '@nestjs/common/decorators';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { UserUpdateDto } from './utils/UserUpdate.dto';
import RequestWithUser from 'src/auth/requestWithUser.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Put('update')
  async updateUser(
    @Req() request: RequestWithUser,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    const { user } = request;
    return this.userService.updateUser(
      user.id,
      userUpdateDto.newLogin,
      userUpdateDto.newEmail,
    );
  }
}
