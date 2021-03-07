import {Component, Input} from "@angular/core";
import {ChartNode} from "./editor.component";

@Component({
    selector: 'graph-editor-details',
    templateUrl: './editor-details.component.html'
})
export class EditorDetailsComponent {

    @Input()
    public selectedNodes: ChartNode[] = []

    public expanded = true

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
}
