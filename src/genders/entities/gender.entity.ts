import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Product } from '../../products/entities/product.entity'

@Entity('genders')
export class Gender {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', {
    unique: true
  })
  name: string

  @Column('bit')
  status: boolean

  @OneToMany(() => Product, product => product.gender)
  product: Product[]
}
