import { Body, Controller, Get, NotFoundException, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/types';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth('bearerAuth')
@Controller('users')
@Auth(AuthType.Bearer)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: CurrentUserData) {
    const found = await this.usersService.findOneById(user.id);
    if (!found) throw new NotFoundException('User not found');
    return { id: found.id, username: found.username, role: found.role, apiId: found.apiId, isPublic: found.isPublic };
  }

  @Patch()
  async patchMe(@CurrentUser() user: CurrentUserData, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.update(user.id, dto);
    return { id: updated.id, username: updated.username, role: updated.role, apiId: updated.apiId, isPublic: updated.isPublic };
  }
}
