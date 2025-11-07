import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/schema/user.schema';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() userDto: any) {
        return this.authService.register(userDto);
    }

    @Post('login')
    async login(@Body() req: any) {
        return this.authService.login(req);
    }
}
