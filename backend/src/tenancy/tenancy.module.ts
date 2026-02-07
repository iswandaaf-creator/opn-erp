import { Module, Global, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TenancyMiddleware } from './tenancy.middleware';
import { ConnectionService } from './connection.service';

@Global() // Global so we don't need to import it everywhere
@Module({
    providers: [ConnectionService],
    exports: [ConnectionService],
})
export class TenancyModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TenancyMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
