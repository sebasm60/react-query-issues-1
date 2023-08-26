import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TagsController } from './tags.controller'
import { TagsService } from './tags.service'

import { Tag } from './entities/tag.entity'

@Module({
  controllers: [TagsController],
  providers: [TagsService, Tag],
  exports: [TypeOrmModule, Tag],
  imports: [
    TypeOrmModule.forFeature([
      Tag
    ]),
  ],
})
export class TagsModule { }
