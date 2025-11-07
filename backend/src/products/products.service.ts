import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/products.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

    async findAll(page = 1, limit = 10, search?: string,) {
        const skip = (page - 1) * limit;
        const filter: any = {};

        if (search) {

            filter.name = { $regex: search, $options: 'i' };
        }
        const products = await this.productModel
            .find(filter)
            .skip(skip)
            .limit(limit)
            .exec();

        const total = await this.productModel.countDocuments(filter);

        return {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            products,
        };
    }

    async findOne(id: string) {
        const product = await this.productModel.findById(id).exec();
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }
}
