import { Controller } from '@nestjs/common';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Auth } from '../auth/decorators/auth.decorator';


@Controller('users')
@Auth(AuthType.Bearer)
export class UsersController {}
