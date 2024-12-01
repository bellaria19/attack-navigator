import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-json-viewer-dialog',
    template: `
        <h2 mat-dialog-title>Attack Data JSON</h2>
        <mat-dialog-content>
            <pre>{{ data.json }}</pre>
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-button mat-dialog-close>Close</button>
        </mat-dialog-actions>
    `,
    styles: [
        `
            pre {
                background-color: #f5f5f5;
                padding: 10px;
                max-height: 400px;
                overflow: auto;
            }
        `,
    ],
})
export class JsonViewerDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { json: string }) {}
}
