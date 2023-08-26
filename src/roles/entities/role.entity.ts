import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', {
    unique: true
  })
  name: string

  @Column('bit')
  status: boolean

  @ManyToMany(() => User, user => user.roles)
  users: User[]
}
