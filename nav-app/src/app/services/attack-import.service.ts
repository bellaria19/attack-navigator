import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TechniqueVM } from '../classes/technique-vm';
import { tap } from 'rxjs/operators';
import { AttackData } from '../interfaces/attack-data.interface';
import { DefenseData } from '../interfaces/defense-data.interface';
import { AttackTechnique } from '../interfaces/attack-data.interface';
import { DefenseMeasure } from '../interfaces/defense-data.interface';

@Injectable({
    providedIn: 'root',
})
export class AttackImportService {
    private currentAttackData: AttackData | null = null;
    private currentDefenseData: DefenseData | null = null;
    private readonly ATTACK_COLOR = '#ff0000'; // 빨간색
    private readonly DEFENSE_COLOR = '#0000ff'; // 파란색
    private readonly OVERLAP_COLOR = '#800080'; // 보라색

    constructor(private http: HttpClient) {}

    importFromJson(url: string): Observable<any> {
        return this.http.get(url).pipe(tap((data) => (this.currentAttackData = data)));
    }

    getCurrentAttackData(): AttackData | null {
        return this.currentAttackData;
    }

    setCurrentAttackData(data: any) {
        this.currentAttackData = data;
    }

    applyAttackData(data: AttackData, viewModel: any) {
        if (this.validateAttackData(data)) {
            this.currentAttackData = data;

            data.techniques.forEach((technique) => {
                technique.tactics.forEach((tactic) => {
                    const techniqueID = `${technique.techniqueID}^${tactic}`;
                    const techniqueVM = new TechniqueVM(techniqueID);
                    techniqueVM.color = this.ATTACK_COLOR;
                    techniqueVM.enabled = true;
                    this.updateTechniqueVMWithAttackData(techniqueVM, technique);
                    viewModel.setTechniqueVM(techniqueVM);
                });
            });
        }
    }

    getCurrentDefenseData(): DefenseData | null {
        return this.currentDefenseData;
    }

    applyDefenseData(data: DefenseData, viewModel: any) {
        if (this.validateDefenseData(data)) {
            this.currentDefenseData = data;

            if (this.currentAttackData) {
                this.updateColors(viewModel);
            } else {
                data.measures.forEach((measure) => {
                    const tactics = this.getTacticsForTechnique(measure.techniqueID);
                    tactics.forEach((tactic) => {
                        const techniqueID = `${measure.techniqueID}^${tactic}`;
                        const techniqueVM = new TechniqueVM(techniqueID);
                        techniqueVM.color = this.DEFENSE_COLOR;
                        techniqueVM.enabled = true;
                        this.updateTechniqueVMWithDefenseData(techniqueVM, measure);
                        viewModel.setTechniqueVM(techniqueVM);
                    });
                });
            }
        }
    }

    private getTacticsForTechnique(techniqueID: string): string[] {
        const technique = this.currentAttackData?.techniques.find((t) => t.techniqueID === techniqueID);
        if (technique) {
            return technique.tactics;
        }
        return ['defense-evasion'];
    }

    private updateColors(viewModel: any) {
        this.currentAttackData?.techniques.forEach((technique) => {
            technique.tactics.forEach((tactic) => {
                const techniqueID = `${technique.techniqueID}^${tactic}`;
                const techniqueVM = new TechniqueVM(techniqueID);

                this.updateTechniqueVMWithAttackData(techniqueVM, technique);

                const defenseMeasure = this.currentDefenseData?.measures.find((m) => m.techniqueID === technique.techniqueID);
                if (defenseMeasure) {
                    this.updateTechniqueVMWithDefenseData(techniqueVM, defenseMeasure);
                    techniqueVM.color = this.OVERLAP_COLOR;
                } else {
                    techniqueVM.color = this.ATTACK_COLOR;
                }

                techniqueVM.enabled = true;
                viewModel.setTechniqueVM(techniqueVM);
            });
        });

        this.currentDefenseData?.measures.forEach((measure) => {
            if (!this.isInAttackData(measure.techniqueID)) {
                const tactics = this.getTacticsForTechnique(measure.techniqueID);
                tactics.forEach((tactic) => {
                    const techniqueID = `${measure.techniqueID}^${tactic}`;
                    const techniqueVM = new TechniqueVM(techniqueID);
                    techniqueVM.color = this.DEFENSE_COLOR;
                    techniqueVM.enabled = true;
                    this.updateTechniqueVMWithDefenseData(techniqueVM, measure);
                    viewModel.setTechniqueVM(techniqueVM);
                });
            }
        });
    }

    private isDetectedByDefense(techniqueID: string): boolean {
        return this.currentDefenseData?.measures.some((measure) => measure.techniqueID === techniqueID) ?? false;
    }

    private isInAttackData(techniqueID: string): boolean {
        return this.currentAttackData?.techniques.some((technique) => technique.techniqueID === techniqueID) ?? false;
    }

    private validateAttackData(data: any): data is AttackData {
        return (
            data &&
            typeof data.version === 'string' &&
            Array.isArray(data.techniques) &&
            data.techniques.every((t: any) => typeof t.techniqueID === 'string' && Array.isArray(t.tactics))
        );
    }

    private validateDefenseData(data: any): data is DefenseData {
        try {
            if (!data || typeof data !== 'object') return false;
            if (typeof data.version !== 'string') return false;
            if (typeof data.timestamp !== 'string') return false;
            if (!Array.isArray(data.measures)) return false;

            const validMeasures = data.measures.every((measure: any) => {
                const validStatus = ['detected', 'blocked', 'mitigated'].includes(measure.status);
                const validConfidence = ['high', 'medium', 'low'].includes(measure.confidence);

                return (
                    typeof measure.techniqueID === 'string' &&
                    typeof measure.status === 'string' &&
                    validStatus &&
                    typeof measure.timestamp === 'string' &&
                    typeof measure.confidence === 'string' &&
                    validConfidence &&
                    (measure.detectionMethod === undefined || typeof measure.detectionMethod === 'string') &&
                    (measure.implementedControls === undefined ||
                        (Array.isArray(measure.implementedControls) &&
                            measure.implementedControls.every((control: any) => typeof control === 'string')))
                );
            });

            if (!validMeasures) {
                console.error('Invalid measures data structure');
                return false;
            }

            if (data.metadata) {
                if (typeof data.metadata !== 'object') return false;
                if (data.metadata.title && typeof data.metadata.title !== 'string') return false;
                if (data.metadata.organization && typeof data.metadata.organization !== 'string') return false;
                if (data.metadata.lastUpdated && typeof data.metadata.lastUpdated !== 'string') return false;
            }

            return true;
        } catch (error) {
            console.error('Defense data validation error:', error);
            return false;
        }
    }

    private updateTechniqueVMWithAttackData(techniqueVM: TechniqueVM, attackData: any): void {
        techniqueVM.attackData = attackData; // 전체 공격 데이터 저장
        techniqueVM.attackDescription = attackData.description || '';
        if (attackData.details) {
            techniqueVM.attackDescription += `\n${attackData.details}`;
        }
    }

    private updateTechniqueVMWithDefenseData(techniqueVM: TechniqueVM, defenseData: any): void {
        techniqueVM.defenseData = defenseData; // 전체 방어 데이터 저장
        techniqueVM.defenseDescription = defenseData.description || '';
        techniqueVM.defenseActions = defenseData.recommendedActions || [];

        if (defenseData.actionTaken) {
            techniqueVM.defenseActions.push(`Action Taken: ${defenseData.actionTaken}`);
        }

        if (defenseData.recommendedActions) {
            techniqueVM.defenseActions.push('Recommended Actions:');
            techniqueVM.defenseActions.push(...defenseData.recommendedActions.map((action) => `- ${action}`));
        }
    }
}
