import { Injectable } from '@nestjs/common'
import { ProductsService } from 'src/products/products.service'
import { initialData } from './data/seed-data'

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService
  ) { }

  async runSeed() {
    return this.insertNewProducts()
  }

  private async insertNewProducts() {
    this.productService.deleteAllProducts()

    const seedProducts = initialData.products

    const arrayPromises = []

    seedProducts.forEach(product => {
      arrayPromises.push(this.productService.create(product))
    })

    return await Promise.all(arrayPromises)
  }
}
