import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { Response } from 'express'

import { FilesService } from './files.service'
import { fileFilter, fileNamer } from './helpers'
import { ConfigService } from '@nestjs/config'

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fieldSize: 1000 }
    storage: diskStorage({
      filename: fileNamer,
      destination: './static/products',
    })
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Make sure thad file is an image')

    const secureURL = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

    return secureURL
  }

  @Get('product/:imageName')
  findProductImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticProductImage(imageName)
    res.sendFile(path)
  }
}