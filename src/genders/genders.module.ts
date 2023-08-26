import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GendersController } from './genders.controller'
import { GendersService } from './genders.service'

import { Gender } from './entities/gender.entity'

@Module({
  controllers: [GendersController],
  providers: [GendersService],
  imports: [
    TypeOrmModule.forFeature([
      Gender
    ]),
  ]
})
export class GendersModule { }
