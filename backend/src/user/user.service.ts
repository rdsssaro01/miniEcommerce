import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async createUser(data: Partial<User>) {
        try {

            const exist = await this.findByEmail(data.email!);
            if (exist) {
                return new ConflictException('User already exists');

            }
            const user = new this.userModel(data);
            await user.save();
            return { message: 'User created successfully' };


        } catch (error) {
            throw new InternalServerErrorException('Could not create user');
        }

    }

    findByEmail(email: string) {
        return this.userModel.findOne({ email }).exec();
    }
}
