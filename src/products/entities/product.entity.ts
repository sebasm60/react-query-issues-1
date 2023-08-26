import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm'
import { v4 as uuid, validate as validateUUID } from 'uuid'

import { Size } from '../../sizes/entities/size.entity'
import { Gender } from 'src/genders/entities/gender.entity'
import { Tag } from 'src/tags/entities/tag.entity'
import { ProductImage } from './product-image.entity'
import { IsOptional } from 'class-validator'


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', {
    unique: false
  })
  title: string

  @Column('money', {
    default: 0
  })
  price: number

  @Column('varchar', {
    nullable: true,
  })
  description: string

  @Column('varchar', {
    unique: false
  })
  slug: string

  @Column('int', {
    default: 0
  })
  stock: number

  @ManyToOne(() => Gender, gender => gender.product, { eager: true, onDelete: 'CASCADE' })
  gender: Gender

  @ManyToMany(() => Size, size => size.product, { eager: true, cascade: true, })
  @JoinTable({
    name: 'products_sizes',
    joinColumn: { name: 'productId' },
    inverseJoinColumn: { name: 'sizeId' },
  })
  sizes: Size[]

  @ManyToMany(() => Tag, tag => tag.product, { eager: true, cascade: true, })
  @JoinTable({
    name: 'products_tags',
  })
  tags?: Tag[]

  @OneToMany(() => ProductImage, productImage => productImage.product, { cascade: true, eager: true, })
  images: ProductImage[]

  @Column('bit', { default: true })
  @IsOptional()
  status?: boolean

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')
  }

  @BeforeInsert()
  checkDescription() {
    if (this.description.length >= 255) this.description = ''

    this.description = this.description
      .toLowerCase()
      .replaceAll("'", '')
  }

  @BeforeInsert()
  checkUUIDInsert() {
    if (!validateUUID(this.id)) this.id = uuid()
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug) {
      this.slug = this.title
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')
  }
}
