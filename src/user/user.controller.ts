import { UserService } from 'src/user/services/user.service';
import { Controller } from '@nestjs/common';
import { Body, Put, Req, UseGuards } from '@nestjs/common/decorators';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';
import { UserUpdateDto } from './utils/UserUpdate.dto';
import RequestWithUser from 'src/auth/dto/requestWithUser.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Put('update')
  updateUser(
    @Req() request: RequestWithUser,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    const { user } = request;
    return this.userService.updateUser(
      user.id,
      userUpdateDto.newLogin,
      userUpdateDto.newEmail,
      userUpdateDto.shipping_address,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put('delete')
  deleteUser(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.userService.deleteUser(user.id);
  }
}
