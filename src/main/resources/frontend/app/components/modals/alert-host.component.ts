import {
    Component,
    ComponentFactoryResolver, ComponentRef, EventEmitter,
    Input,
    OnDestroy,
    OnInit, Output, ViewContainerRef,
} from "@angular/core";
import {Alert, AlertService} from "../../services/alert.service";

@Component({
    selector: "alert-host",
    template: "",
})
export class AlertHostComponent implements OnInit, OnDestroy {

    private sub: { unsubscribe: () => void };

    private alertRefs: Record<string, ComponentRef<AlertComponent>> = {};

    public constructor(private alerts: AlertService,
                       private componentFactoryResolver: ComponentFactoryResolver,
                       public viewRef: ViewContainerRef) { }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    ngOnInit(): void {
        this.sub = this.alerts.subscribe({
            next: (alert) => this.displayAlert(alert),
            error() {},
            complete() {}
        });
    }

    private displayAlert(alert: Alert) {
        const timestamp = new Date().toDateString();
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const alertRef = this.viewRef.createComponent(componentFactory);
        alertRef.instance.type = alert.type;
        alertRef.instance.message = alert.message;
        alertRef.instance.close = () => this.dismissAlert(timestamp);
        this.alertRefs[timestamp] = alertRef;
    }

    public dismissAlert(timestamp: string) {
        const alertRef = this.alertRefs[timestamp];
        alertRef.destroy();
    }
}

@Component({
    selector: "alert",
    template: "<ngb-alert [type]=\"type\" [dismissible]=\"true\" (close)=\"close()\">{{message}}</ngb-alert>",
})
export class AlertComponent {

    @Input()
    public type: string;

    @Input()
    public message: string;

    @Output()
    public close: () => void;
}
