import {Component, EventEmitter, Input, Output} from "@angular/core";
import {PropertyMapping} from "./property-mapping";
import {ProjectData} from "../../../models/project-models";

@Component({
    selector: 'graph-editor-settings',
    templateUrl: './editor-settings.component.html'
})
export class EditorSettingsComponent {

    @Input()
    public project: ProjectData

    @Input()
    public mapping: PropertyMapping

    @Output()
    public change = new EventEmitter<void>();

    public expanded = false;

    public hidden = !this.expanded;

    public enableColor = false;

    get disableColor() {
        return !this.enableColor || this.availableFields.length < 1;
    }

    public enableSize: boolean;

    get disableSize() {
        return !this.enableSize || this.availableFields.length < 1;
    }

    get availableFields() {
        if (!this.project) {
            return []
        } else {
            return Object.getOwnPropertyNames(this.project.history);
        }
    }

    public selectedColorField: string = null;

    public selectedSizeField: string = null;

    toggle() {
        if (this.expanded) {
            this.hidden = true
        } else {
            setTimeout(() => {
                this.hidden = false
            }, 500);
        }
        this.expanded = !this.expanded;
    }

    selectColorField() {
        if (this.disableColor) {
            this.mapping.colorProperty = [null, 0]
        } else {

            const id = Math.max(...this.project.history[this.selectedColorField]);
            this.mapping.colorProperty = [this.selectedColorField, id];
        }
    }

    selectSizeField() {
        if (this.disableSize) {
            this.mapping.sizeProperty = [null, 0]
        } else {
            const id = Math.max(...this.project.history[this.selectedSizeField]);
            this.mapping.sizeProperty = [this.selectedSizeField, id];
        }
    }

    selectProperty(prop: [string, number]) {
        if (this.mapping.colorProperty[0] == null) {
            this.enableColor = true;
            this.selectedColorField = prop[0];
            this.selectColorField();
        }
        else if (this.mapping.colorProperty[0] == prop[0]) {
            this.mapping.colorProperty = prop;
        } else {
            this.enableSize = true;
            this.selectedColorField = prop[0];
            this.selectSizeField();
        }
        this.change.emit();
    }

    removeFromHistory(prop: [string, number]) {
        // remove from project history
        if (prop[0] in this.project.history) {
            this.project.history[prop[0]] = this.project.history[prop[0]].filter(timestamp => {
                timestamp != prop[1];
            });
            if (!this.project.history[prop[0]].length) {
                delete this.project.history[prop[0]]
            }
        }
        // remove from individual node values
        for (let node of this.project.nodes) {
            if (prop[0] in node.extraValues && prop[1] in node.extraValues[prop[0]]) {
                delete node.extraValues[prop[0]][prop[1]]
                if (!Object.keys(node.extraValues[prop[0]]).length) {
                    delete node.extraValues[prop[0]]
                }
            }
        }
        // update mapping if needed
        if (this.mapping.colorProperty[0] == prop[0] && this.mapping.colorProperty[1] == prop[1]) {
            this.enableColor = false;
            this.mapping.colorProperty = [null, 0]
        }
        if (this.mapping.sizeProperty[0] == prop[0] && this.mapping.sizeProperty[1] == prop[1]) {
            this.enableSize = false;
            this.mapping.sizeProperty = [null, 0]
        }
        this.change.emit();
    }
}
