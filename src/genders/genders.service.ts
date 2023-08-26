import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'

import { CreateGenderDto, UpdateGenderDto } from './dto'
import { Gender } from './entities/gender.entity'
import { PaginationDto } from 'src/common/dtos/pagination.dto'

import { handleDBExceptions } from 'src/common/helpers/handleDBExceptions'

@Injectable()
export class GendersService {
  constructor(
    @InjectRepository(Gender)
    private readonly genderRespository: Repository<Gender>
  ) { }

  async create(createGenderDto: CreateGenderDto) {
    try {
      const gender = this.genderRespository.create(createGenderDto)

      await this.genderRespository.save(gender)

      return gender
    } catch (error) {
      handleDBExceptions(error, 'GendersService')
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    return this.genderRespository
      .find({
        take: limit,
        skip: offset,
      })
  }

  async findOne(term: string) {
    let gender: Gender

    if (!isNaN(+term)) {
      gender = await this.genderRespository.findOneBy({ id: +term })
    } else {
      gender = await this.genderRespository.findOneBy({ name: term.toString() })
    }

    if (!gender) throw new NotFoundException(`Gender ${term} not found`)

    return gender
  }

  async update(id: string, updateGenderDto: UpdateGenderDto) {
    const gender = await this.genderRespository.preload({
      id: +id,
      ...updateGenderDto,
    })

    if (!gender) throw new NotFoundException(`Gender with id '${id}' not found`)

    try {
      await this.genderRespository.save(gender)

      return gender
    } catch (error) {
      handleDBExceptions(error, 'GendersService')
    }
  }

  async remove(id: string) {
    if (isNaN(+id)) throw new NotFoundException(`Gender with id '${id}' not found`)

    const gender = await this.findOne(id)

    await this.genderRespository.remove(gender)
  }
}
