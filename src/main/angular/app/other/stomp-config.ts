import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';

export const myRxStompConfig: InjectableRxStompConfig = {
    // Which server?
    brokerURL: 'ws://localhost:8080/ws',

    // Will log diagnostics on console
    // It can be quite verbose, not recommended in production
    // Skip this key to stop logging to console
    debug: (msg: string): void => {
        console.log(new Date(), msg);
    },
};
