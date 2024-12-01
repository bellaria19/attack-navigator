import { Component, OnInit } from '@angular/core';
import { AttackImportService } from '../services/attack-import.service';
import { ViewModel } from '../classes/view-model';
import { MatDialog } from '@angular/material/dialog';
import { JsonViewerDialogComponent } from 'src/app/dialogs/json-viewer-dialog.component';

@Component({
    selector: 'app-matrix',
    templateUrl: './matrix.component.html',
})
export class MatrixComponent implements OnInit {
    constructor(
        private attackImportService: AttackImportService,
        private viewModel: ViewModel,
        private dialog: MatDialog
    ) {}

    showCurrentJson() {
        const data = this.attackImportService.getCurrentAttackData();
        if (data) {
            const dialogRef = this.dialog.open(JsonViewerDialogComponent, {
                width: '600px',
                data: { json: JSON.stringify(data, null, 2) },
            });
        }
    }

    ngOnInit() {
        // JSON 파일 URL
        const jsonUrl = 'assets/attack-data.json';

        this.attackImportService.importFromJson(jsonUrl).subscribe((data) => {
            this.attackImportService.applyAttackData(data, this.viewModel);
        });
    }
}
