import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Product } from '../../products/entities/product.entity'

@Entity('sizes')
export class Size {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', {
    unique: true
  })
  name: string

  @Column('bit')
  status: boolean

  @ManyToMany(() => Product, product => product.sizes)
  product: Product[]
}