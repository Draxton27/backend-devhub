/* eslint-disable */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';
import { FirebaseAuthMiddleware } from './middleware/firebase-auth.middleware';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseAuthMiddleware)
      .forRoutes(
        UsersController,
        // { path: 'users', method: RequestMethod.ALL },
        { path: 'posts', method: RequestMethod.ALL },
        { path: 'dashboard', method: RequestMethod.ALL },
        // { path: 'users/me', method: RequestMethod.GET },
        // { path: 'users/:id', method: RequestMethod.GET }

      );
  }
}
