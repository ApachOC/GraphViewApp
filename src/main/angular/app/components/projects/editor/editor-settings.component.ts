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

    public expanded = true;

    public hidden = false;

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

    public selectedColorField: string;

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
        const id = this.mapping.colorProperty[1];
        this.mapping.colorProperty = [this.selectedColorField, id];
    }

    selectProperty(prop: [string, number]) {
        if (this.mapping.colorProperty[0] == null) {
            this.enableColor = true;
            this.selectedColorField = prop[0];
            this.mapping.colorProperty = prop;
        }
        else if (this.mapping.colorProperty[0] == prop[0]) {
            this.mapping.colorProperty = prop;
        } else {
            this.enableSize = true;
            this.mapping.sizeProperty
        }
        this.change.emit();
    }
}
