import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {

            return user;
        }
        return null;
    }

    async hashPassword(password: string): Promise<string> {
        const hashPass = await bcrypt.hash(password, 10);
        return hashPass;
    }

    async login(user: Partial<User>) {

        const userExisst = await this.validateUser(user.email!, user.password!);
        if (!userExisst) {
            return {
                statuscode: HttpStatus.UNAUTHORIZED,
                message: "Invalid Credentials"
            };
        }
        const payload = { email: userExisst.email, sub: userExisst._id };
        const token = this.jwtService.sign(payload);
        return { statusCode: HttpStatus.OK, message: "Login Successfully", access_token: token };
    }

    async register(userData: Partial<User>) {
        const hashPassword = await this.hashPassword(userData.password!);
        return this.usersService.createUser({ ...userData, password: hashPassword });
    }

}
