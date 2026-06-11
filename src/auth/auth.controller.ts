import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { ConfigService } from '@nestjs/config';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { CurrentUser } from './decorators/current-user.decorator';
import type { CurrentUserData, Tokens } from './types';
import type { Request, Response } from 'express';
import { CreateLocalUserDto } from '../users/dto/create-local-user.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @Auth(AuthType.Local)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: TokensResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async localLogin(
    @CurrentUser() user: CurrentUserData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Tokens> {
    const tokens = await this.authService.issueTokens(user);

    this.setTokenCookies(response, tokens);
    return tokens;
  }

  @Post('register')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Username already taken' })
  async localRegister(@Body() dto: CreateLocalUserDto): Promise<void> {
    await this.authService.localRegister(dto);
  }

  @Post('logout')
  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access_token')
  @ApiResponse({ status: 204, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @CurrentUser() user: CurrentUserData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(user.id);
    response.clearCookie('access_token');
    // Note: if refresh token functionality is implemented in the future, also clear the refresh token cookie here.
    // response.clearCookie('refresh_token');
  }

  // -- Helpers --
  private setTokenCookies(response: Response, tokens: Tokens): void {
    const now = new Date();

    if (tokens.access_token) {
      response.cookie('access_token', tokens.access_token, {
        httpOnly: true, // prevents JavaScript access to the cookie
        secure: this.configService.get('NODE_ENV') === 'production', // set to true in production (requires HTTPS)
        sameSite: 'lax', // restricts cookie to same site (CSRF protection)
        expires: new Date(
          now.getTime() +
            parseInt(this.configService.getOrThrow('JWT_ACCESS_TOKEN_TTL')) *
              1000,
        ),
      });
    }

    // if (tokens.refresh_token) {
    //   response.cookie('refresh_token', tokens.refresh_token, {
    //     httpOnly: true,
    //     secure: this.configService.get('NODE_ENV') === 'production',
    //     sameSite: 'lax',
    //     path: '/auth/refresh',
    //     expires: new Date(
    //       now.getTime() +
    //         parseInt(this.configService.getOrThrow('JWT_REFRESH_TOKEN_TTL')) *
    //           1000,
    //     ),
    //   });
    // }
  }
}
