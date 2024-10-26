import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration, { ENV_VALIDATION_SCHEMA } from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { RedisAppModule } from './redis/redis.module';
@Module({
  imports: [
    UsersModule,
    OrganizationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
      validationSchema: ENV_VALIDATION_SCHEMA,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const {
          USER: dbUser,
          PASSWORD: dbPassword,
          HOST: dbHost,
          PORT: dbPort,
          NAME: dbName,
        } = configService.get('DB');

        const credentials = dbPassword ? `${dbUser}:${dbPassword}@` : '';
        const uri = `mongodb://${credentials}${dbHost}:${dbPort}/${dbName}?authSource=admin`;

        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    RedisAppModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
