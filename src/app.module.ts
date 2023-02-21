import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { First } from './first/first.module';
import { TodoModule } from './todo/todo.module';
import { CommonModule } from './common/common.module';
import { FirstController } from './first/first.controller';

@Module({
  imports: [First, TodoModule, CommonModule],
  controllers: [FirstController, AppController],
  providers: [AppService],
})
export class AppModule {}
