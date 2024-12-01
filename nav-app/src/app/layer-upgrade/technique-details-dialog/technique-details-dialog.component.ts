import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-technique-details-dialog',
    template: `
        <h2 mat-dialog-title>기법 상세 정보: {{ data.technique.attackID }}</h2>
        <mat-dialog-content class="dialog-content">
            <h3>{{ data.technique.name }}</h3>
            <p>
                <strong>전술:</strong>
                {{ data.tactic.name }}
            </p>

            <div *ngIf="data.techniqueVM.attackData" class="section">
                <h4>공격 정보</h4>
                <p>
                    <strong>심각도:</strong>
                    {{ data.techniqueVM.attackData.severity }}
                </p>
                <p>
                    <strong>설명:</strong>
                    {{ data.techniqueVM.attackData.description }}
                </p>
                <p>
                    <strong>상세:</strong>
                    {{ data.techniqueVM.attackData.details }}
                </p>

                <div class="json-section">
                    <h5>원본 JSON 데이터</h5>
                    <pre>{{ getFormattedJson(data.techniqueVM.attackData) }}</pre>
                </div>
            </div>

            <div *ngIf="data.techniqueVM.defenseData" class="section">
                <h4>방어 정보</h4>
                <p>
                    <strong>상태:</strong>
                    {{ data.techniqueVM.defenseData.status }}
                </p>
                <p>
                    <strong>탐지 방법:</strong>
                    {{ data.techniqueVM.defenseData.detectionMethod }}
                </p>
                <p>
                    <strong>신뢰도:</strong>
                    {{ data.techniqueVM.defenseData.confidence }}
                </p>
                <p><strong>구현된 통제:</strong></p>
                <ul>
                    <li *ngFor="let control of data.techniqueVM.defenseData.implementedControls">
                        {{ control }}
                    </li>
                </ul>
                <p>
                    <strong>조치 사항:</strong>
                    {{ data.techniqueVM.defenseData.actionTaken }}
                </p>
                <p><strong>권장 조치:</strong></p>
                <ul>
                    <li *ngFor="let action of data.techniqueVM.defenseData.recommendedActions">
                        {{ action }}
                    </li>
                </ul>

                <div class="json-section">
                    <h5>원본 JSON 데이터</h5>
                    <pre>{{ getFormattedJson(data.techniqueVM.defenseData) }}</pre>
                </div>
            </div>

            <div *ngIf="data.techniqueVM.uploadedData" class="section">
                <h4>업로드된 데이터</h4>
                <div class="json-section">
                    <h5>원본 JSON 데이터</h5>
                    <pre>{{ getFormattedJson(data.techniqueVM.uploadedData) }}</pre>
                </div>
            </div>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>닫기</button>
        </mat-dialog-actions>
    `,
    styles: [
        `
            .dialog-content {
                max-height: 80vh;
                overflow-y: auto;
                padding: 0 24px;
            }
            .section {
                margin: 16px 0;
                padding: 16px;
                background: #f5f5f5;
                border-radius: 4px;
            }
            .json-section {
                margin-top: 16px;
                padding: 8px;
                background: #e0e0e0;
                border-radius: 4px;
            }
            .json-section h5 {
                margin: 0 0 8px 0;
                color: #333;
            }
            pre {
                background: #fff;
                padding: 8px;
                border-radius: 4px;
                overflow-x: auto;
                margin: 0;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            h4 {
                color: #333;
                margin-bottom: 12px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 8px;
            }
        `,
    ],
})
export class TechniqueDetailsDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

    getFormattedJson(data: any): string {
        return JSON.stringify(data, null, 2);
    }
}
