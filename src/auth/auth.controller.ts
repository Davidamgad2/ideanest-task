import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { ApiBody, ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'create new user' })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'login user with email and password' })
  @ApiBody({ type: AuthDto })
  signIn(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string' },
      },
      example: {
        refreshToken: 'your-refresh-token-here',
      },
    },
  })
  @ApiOperation({ summary: 'revoke refresh token for user' })
  @ApiBearerAuth('jwt-auth')
  @Post('revoke-refresh-token')
  revokeRefreshToken(
    @Req() req: Request,
    @Body() body: { refreshToken: string },
  ) {
    const decodedToken: { id: string; email: string } = this.jwtService.decode(
      body.refreshToken,
    ) as {
      id: string;
      email: string;
    };
    this.authService.logout(decodedToken.id);
    return { message: 'Refresh token revoked successfully' };
  }

  @Post('refresh-token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string' },
      },
      example: {
        refreshToken: 'your-refresh-token-here',
      },
    },
  })
  @ApiOperation({ summary: 'renew refresh token for user' })
  refreshTokens(@Body() body: { refreshToken: string }) {
    const decodedToken = this.jwtService.decode(body.refreshToken) as {
      id: string;
      email: string;
    };
    const userId = decodedToken.id;
    return this.authService.refreshTokens(userId, body.refreshToken);
  }
}
