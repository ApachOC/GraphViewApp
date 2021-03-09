import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ChartNode} from "./editor.component";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";
import {ProjectData} from "../../../models/project-models";

@Component({
    selector: 'graph-editor-details',
    templateUrl: './editor-details.component.html'
})
export class EditorDetailsComponent {

    @Input()
    public selectedNodes: ChartNode[];

    @Input()
    public project: ProjectData;

    @Output()
    public selectedResult = new EventEmitter<[string, number]>();

    @Output()
    public removeFromHistory = new EventEmitter<[string, number]>();

    public expanded = true

    expandedCollapse: NgbCollapse;

    get personalization () {
        let p = this.selectedNodes[0].data.personalization;
        for (let node of this.selectedNodes) {
            if (node.data.personalization != p) {
                return null;
            }
        }
        return p;
    }

    set personalization(value) {
        for (let node of this.selectedNodes) {
            node.data.personalization = value;
        }
    }

    get projectHistoryNames() {
        return Object.keys(this.project.history);
    }

    get extraValueNames() {
        return Object.keys(this.selectedNodes[0].data.extraValues);
    }

    get hasExtraValues() {
        if (this.selectedNodes.length != 1) {
            return false;
        }
        return this.extraValueNames.length > 0;
    }

    get extraValues() {
        return this.selectedNodes[0].data.extraValues;
    }

    get density(): number {
        if (this.project.nodeCount) {
            return this.project.edgeCount / (this.project.nodeCount * (this.project.nodeCount - 1))
        } else {
            return 0
        }
    }

    expandResult(resultCollapse: NgbCollapse) {
        if (this.expandedCollapse) {
            this.expandedCollapse.collapsed = true;
        }
        resultCollapse.collapsed = false;
        this.expandedCollapse = resultCollapse;
    }

    formatValue(value: string) {
        //todo work with other output types
        const v = parseFloat(value);
        return v.toFixed(5);
    }

    dateTime(timestamp: number) {
        const date = new Date(timestamp);
        const formatOptions = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        };
        const idf = new Intl.DateTimeFormat('default', formatOptions);
        return idf.format(date)
    }
}
