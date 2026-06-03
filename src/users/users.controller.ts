import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Auth } from '../auth/decorators/auth.decorator';

@ApiTags('users')
@ApiBearerAuth('bearerAuth')
@Controller('users')
@Auth(AuthType.Bearer)
export class UsersController {}
