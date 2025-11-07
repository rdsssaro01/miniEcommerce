import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/products')
export class ProductsController {

    constructor(private productsService: ProductsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getProducts(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('search') search?: string,
    ) {
        return this.productsService.findAll(Number(page) || 1, Number(limit) || 10, search);
    }


    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

}
