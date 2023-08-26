import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User } from './entities/user.entity'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto'
import { handleDBExceptions } from 'src/common/helpers/handleDBExceptions'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto

    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })
      await this.userRepository.save(user)
      return user
    } catch (error) {
      handleDBExceptions(error, 'AuthService')
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    })

    if (!user) throw new UnauthorizedException('Credentials are not valid')

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credentials are not valid')

    return user
  }
}
