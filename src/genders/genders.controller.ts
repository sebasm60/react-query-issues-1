import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'

import { GendersService } from './genders.service'

import { CreateGenderDto, UpdateGenderDto } from './dto'
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('genders')
export class GendersController {
  constructor(private readonly gendersService: GendersService) { }

  @Post()
  create(@Body() createGenderDto: CreateGenderDto) {
    return this.gendersService.create(createGenderDto)
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.gendersService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.gendersService.findOne(term)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenderDto: UpdateGenderDto) {
    return this.gendersService.update(id, updateGenderDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gendersService.remove(id)
  }
}
