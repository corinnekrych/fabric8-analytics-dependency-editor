import { Broadcaster } from 'ngx-base';
import { eventKeyMap } from './woopra-key-map';

export class TelemetryService {
    constructor() { }

    broadcast(broadcaster: Broadcaster, event: string, data?: any) {
        if (broadcaster) {
            broadcaster.broadcast('analyticsTracker', {
                event: eventKeyMap[event],
                data: data
            });
        }
    }
}
