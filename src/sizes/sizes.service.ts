import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'

import { CreateSizeDto, UpdateSizeDto } from './dto'

import { Size } from './entities/size.entity'
import { handleDBExceptions } from 'src/common/helpers/handleDBExceptions'
import { PaginationDto } from 'src/common/dtos/pagination.dto'

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(Size)
    private readonly sizeRespository: Repository<Size>
  ) { }

  async create(createSizeDto: CreateSizeDto) {
    try {
      const size = this.sizeRespository.create(createSizeDto)

      await this.sizeRespository.save(size)

      return size
    } catch (error) {
      handleDBExceptions(error, 'SizesService')
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    return this.sizeRespository
      .find({
        take: limit,
        skip: offset,
      })
  }

  async findOne(term: string) {
    let size: Size

    if (!isNaN(+term)) {
      size = await this.sizeRespository.findOneBy({ id: +term })
    } else {
      size = await this.sizeRespository.findOneBy({ name: term.toString() })
    }

    if (!size) throw new NotFoundException(`Size ${term} not found`)

    return size
  }

  async update(id: string, updateSizeDto: UpdateSizeDto) {
    const size = await this.sizeRespository.preload({
      id: +id,
      ...updateSizeDto,
    })

    if (!size) throw new NotFoundException(`Size with id '${id}' not found`)

    try {
      await this.sizeRespository.save(size)

      return size
    } catch (error) {
      handleDBExceptions(error, 'SizesService')
    }
  }

  async remove(id: string) {
    if (isNaN(+id)) throw new NotFoundException(`Size with id '${id}' not found`)

    const size = await this.findOne(id)

    await this.sizeRespository.remove(size)
  }
}
