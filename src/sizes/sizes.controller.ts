import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'

import { SizesService } from './sizes.service'

import { CreateSizeDto, UpdateSizeDto } from './dto'
import { PaginationDto } from 'src/common/dtos/pagination.dto'

@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) { }

  @Post()
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizesService.create(createSizeDto)
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.sizesService.findAll(paginationDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sizesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizesService.update(id, updateSizeDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sizesService.remove(id)
  }
}
