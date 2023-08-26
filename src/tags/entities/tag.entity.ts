import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Product } from 'src/products/entities/product.entity'

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', {
    unique: true
  })
  name: string

  @Column('bit')
  status: boolean

  @ManyToMany(() => Product, product => product.tags)
  product: Product[]
}
