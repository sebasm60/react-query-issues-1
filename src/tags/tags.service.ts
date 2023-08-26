import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateTagDto, UpdateTagDto } from './dto'
import { PaginationDto } from 'src/common/dtos/pagination.dto'

import { Tag } from './entities/tag.entity'

import { handleDBExceptions } from 'src/common/helpers/handleDBExceptions'

@Injectable()
export class TagsService {
  constructor(

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>
  ) { }

  async create(createTagDto: CreateTagDto) {
    try {
      const tag = this.tagRepository.create(createTagDto)

      await this.tagRepository.save(tag)

      return tag
    } catch (error) {
      handleDBExceptions(error, 'TagsService')
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    return this.tagRepository
      .find({
        take: limit,
        skip: offset,
      })
  }

  async findOne(term: string) {
    let tag: Tag

    if (!isNaN(+term)) {
      tag = await this.tagRepository.findOneBy({ id: +term })
    } else {
      tag = await this.tagRepository.findOneBy({ name: term.toString() })
    }

    if (!tag) throw new NotFoundException(`Tag ${term} not found`)

    return tag
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.tagRepository.preload({
      id: +id,
      ...updateTagDto,
    })

    if (!tag) throw new NotFoundException(`Tag with id '${id}' not found`)

    try {
      await this.tagRepository.save(tag)

      return tag
    } catch (error) {
      handleDBExceptions(error, 'TagsService')
    }
  }

  async remove(id: string) {
    if (isNaN(+id)) throw new NotFoundException(`Tag with id '${id}' not found`)

    const tag = await this.findOne(id)

    await this.tagRepository.remove(tag)
  }
}
