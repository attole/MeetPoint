import { Component, input, model } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSliderModule } from "@angular/material/slider";

@Component({
    selector: "update-time-slider",
    imports: [MatSliderModule, FormsModule, ReactiveFormsModule],
    template: `
        <div class="form-container">
            <label for="frequency-slider" class="form-label">
                Personal update frequency
            </label>
            <mat-slider
                id="frequency-slider"
                class="slider"
                min="0"
                [max]="timeLabels.length - 1"
                step="1"
                tickInterval="1"
                showTickMarks
                discrete
                [displayWith]="selectedLabel"
                [formControl]="control()!"
            >
            </mat-slider>
        </div>
    `,
    styles: `
        .form-container {
            width: 100%;
            margin: 20px 0;
            padding: 0 16px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: var(--mat-sys-surface-variant);
            border-top-left-radius: var(--mat-sys-corner-extra-small);
            border-top-right-radius: var(--mat-sys-corner-extra-small);
            font-size: var(--mat-sys-body-large-size);
            font-weight: var(--mat-sys-body-large-weight);
            color: var(--mat-sys-on-surface-variant);
        }

        .form-label {
            padding-top: 5px;
            font: var(--mat-sys-label-medium);
            color: var(--mat-sys-color-on-surface);
        }

        .slider {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `,
})
export class TimeFrequency {
    control = input<FormControl>();
    public timeLabels = [
        "1 s",
        "5 s",
        "10 s",
        "30 s",
        "1 m",
        "5 m",
        "15 m",
        "30 m",
        "1 h",
        "6 h",
        "24 h",
    ];

    public defaultIndex = input(1);
    public selectedIndex = model(this.defaultIndex());

    selectedLabel(value: number) {
        this.OnChange.emit(this.timeLabels[value]);
        return this.timeLabels[value];
    }
}
