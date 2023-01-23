import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configFactory } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemModule } from './modules/system/system.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configFactory],
      isGlobal: true // to prevent the need to import in other modules
    }),
    SharedModule,
    SystemModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
