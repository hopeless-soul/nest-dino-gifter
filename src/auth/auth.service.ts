import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HashingService } from '../common/hashing/common/hashing.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  AccessTokenPayload,
  CurrentUserData,
  toCurrentUserData,
  Tokens,
} from './types';
import { CreateLocalUserDto } from '../users/dto/create-local-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly hashingService: HashingService,
  ) {}

  async validateLocalUser(
    username: string,
    password: string,
  ): Promise<CurrentUserData> {
    const user = await this.usersService.findOneByUsername(username, {
      select: {
        id: true,
        username: true,
        password: true,
        deletedAt: true,
        role: true,
        tokenVersion: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (user.deletedAt !== null) {
      throw new UnauthorizedException('Account is inactive');
    }

    const isPasswordValid = await this.hashingService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Return user — passport attaches it to req.user
    return toCurrentUserData(user);
  }

  async localRegister(dto: CreateLocalUserDto) {
    return this.usersService.createFromLocal(dto);
  }

  async logout(id: string): Promise<void> {
    await this.usersService.incrementTokenVersion(id);
  }

  /**
   * NOTE: refresh token functionality is not implemented yet, but this method could be designed to support it in the future.
   * 
   * Issues a new access/refresh token pair for the given user.
   *
   * Fetches the current tokenVersion from the DB to embed in the access token,
   * allowing invalidation of all tokens on logout or password change.
   *
   * Generates a unique refresh token ID (rtId) stored server-side,
   * enabling refresh token rotation and reuse detection.
   *
   * @param user - Authenticated user identity from req.user
   * @returns Signed access and refresh token pair
   * @throws NotFoundException if the user no longer exists in the DB
   */
  async issueTokens(user: CurrentUserData): Promise<Tokens> {
    const { id, ...rest } = user;
    const currentData = await this.usersService.findOneById(user.id, {
      select: { tokenVersion: true },
    });

    if (!currentData) {
      throw new NotFoundException('Current user is not found');
    }

    const at = await this.signToken<Partial<AccessTokenPayload>>(
      user.id,
      this.configService.getOrThrow<string>('JWT_SECRET'),
      parseInt(this.configService.getOrThrow('JWT_ACCESS_TOKEN_TTL')),
      { ...rest, tokenVersion: currentData.tokenVersion },
    );

    return {
      access_token: at,
    };
  }

  /**
   * Sign a JWT token with standard claims and optional payload data.
   *
   * The token always includes the user's ID as the `sub` claim, and it uses
   * shared JWT configuration from the application settings.
   */
  private async signToken<T>(
    userId: string,
    secret: string,
    expiresIn: number,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        // audience:
        // issuer:
        secret,
        expiresIn,
      },
    );
  }
}
