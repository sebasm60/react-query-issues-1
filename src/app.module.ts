import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { SizesModule } from './sizes/sizes.module';
import { GendersModule } from './genders/genders.module';
import { CommonModule } from './common/common.module';
import { TagsModule } from './tags/tags.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      options: {
        encrypt: false
      },
      logging: true,
    }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    AuthModule,
    CommonModule,
    FilesModule,
    GendersModule,
    ProductsModule,
    SeedModule,
    SizesModule,
    TagsModule,
    RolesModule,
  ],
})

export class AppModule { }
