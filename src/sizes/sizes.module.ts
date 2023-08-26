import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SizesController } from './sizes.controller'
import { SizesService } from './sizes.service'

import { Size } from './entities/size.entity'

@Module({
  controllers: [SizesController],
  providers: [SizesService, Size],
  exports: [TypeOrmModule, Size],
  imports: [
    TypeOrmModule.forFeature([
      Size
    ])
  ],
})
export class SizesModule { }
