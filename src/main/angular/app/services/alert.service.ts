import {Injectable} from "@angular/core";
import {Observer} from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AlertService {

    private _subscribers: Observer<Alert>[] = []

    public subscribe(subscriber: Observer<Alert>) {
        this._subscribers.push(subscriber);
        return {
            unsubscribe: () => {
                this._subscribers.splice(this._subscribers.indexOf(subscriber), 1);
            }
        };
    }

    public pushAlert(type: string, message: string) {
        const alert = new Alert(type, message);
        this._subscribers.forEach((o) => o.next(alert));
    }
}

export class Alert {
    constructor(public readonly type: string,
                public readonly message: string) {
    }
}
