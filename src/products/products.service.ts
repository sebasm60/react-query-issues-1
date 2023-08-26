import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { DataSource, In, Repository } from 'typeorm'
import { validate as isUUID } from 'uuid'

import { CreateProductDto, UpdateProductDto } from './dto'
import { PaginationDto } from '../common/dtos/pagination.dto';

import { Product, ProductImage } from './entities'
import { handleDBExceptions } from 'src/common/helpers/handleDBExceptions'
import { Size } from 'src/sizes/entities/size.entity'
import { Tag } from 'src/tags/entities/tag.entity'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRespository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRespository: Repository<ProductImage>,

    @InjectRepository(Size)
    private readonly sizeRespository: Repository<Size>,

    @InjectRepository(Tag)
    private readonly tagRespository: Repository<Tag>,

    private readonly dataSource: DataSource,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], sizes = [], tags = [], ...producDetails } = createProductDto

      const product = this.productRespository.create({
        ...producDetails,
        sizes: await this.sizeRespository.findBy({ id: In(sizes) }),
        tags: await this.tagRespository.findBy({ id: In(tags) }),
        images: images.map(url => this.productImageRespository.create({ url }))
      })

      await this.productRespository.save(product)

      return product
    } catch (error) {
      handleDBExceptions(error, 'ProductsService')
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    return this.productRespository
      .find({
        take: limit,
        skip: offset,
      })
  }

  async findOne(term: string) {
    let product: Product

    if (isUUID(term)) {
      product = await this.productRespository.findOneBy({ id: term })
    } else {
      product = await this.productRespository.findOne({ where: [{ title: term }, { slug: term }] })
    }

    if (!product) throw new NotFoundException(`Product ${term} not found`)

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, sizes, tags, ...toUpdate } = updateProductDto

    const product = await this.productRespository.preload({ id, ...toUpdate })

    if (!product) throw new NotFoundException(`Product with id '${id}' not found`)

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } })
        product.images = images.map(image => this.productImageRespository.create({ url: image }))
      }

      if (sizes) {
        await queryRunner.manager.delete('product_size', { productId: { id } })
        product.sizes = await this.sizeRespository.findBy({ id: In(sizes) })
      }

      if (tags) {
        await queryRunner.manager.delete('product_tag', { productId: { id } })
        product.tags = await this.tagRespository.findBy({ id: In(tags) })
      }

      await queryRunner.manager.save(product)

      await queryRunner.commitTransaction()

      await queryRunner.release()

      return this.findOne(id)
    } catch (error) {
      await queryRunner.rollbackTransaction()

      await queryRunner.release()

      handleDBExceptions(error, 'ProductsService')
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id)

    await this.productRespository.remove(product)
  }

  async deleteAllProducts() {
    const query = this.productRespository.createQueryBuilder('product')

    try {
      return await query.delete().where({}).execute()
    } catch (error) {
      handleDBExceptions(error, 'ProductsService')
    }
  }
}
