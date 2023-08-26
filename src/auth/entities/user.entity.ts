import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { v4 as uuid, validate as validateUUID } from 'uuid'

import { Role } from "src/roles/entities/role.entity"

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', {
    unique: true
  })
  email: string

  @Column('varchar', {
    select: false
  })
  password: string

  @Column('varchar')
  fullName: string

  @Column('bit', {
    default: true,
  })
  isActive: boolean

  @ManyToMany(() => Role, role => role.users, { eager: true, cascade: true, })
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'roleId' },
  })
  roles: Role[]

  @BeforeInsert()
  checkUUIDInsert() {
    if (!validateUUID(this.id)) this.id = uuid()
  }
}
