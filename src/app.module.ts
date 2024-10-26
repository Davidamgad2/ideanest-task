import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration, { ENV_VALIDATION_SCHEMA } from './config/configuration';

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
        const dbUser = configService.get<string>('DB.USER');
        const dbPassword = configService.get<string>('DB.PASSWORD');
        const dbHost = configService.get<string>('DB.HOST');
        const dbPort = configService.get<string>('DB.PORT');
        const dbName = configService.get<string>('DB.NAME');

        return {
          uri: `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
