import { Module, Global } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Global() // Make it global so we can inject it anywhere easily
@Module({
    providers: [EventsGateway],
    exports: [EventsGateway],
})
export class EventsModule { }
