import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'

import { Product, ProductImage } from './entities'

import { SizesModule } from 'src/sizes/sizes.module'
import { TagsModule } from 'src/tags/tags.module'

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage,]),
    SizesModule, TagsModule
  ],

})

export class ProductsModule { }
