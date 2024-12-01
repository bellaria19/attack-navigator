export interface AttackTechnique {
    techniqueID: string;
    tactics: string[];
    name: string;
    description?: string;
    severity?: 'high' | 'medium' | 'low';
    details?: string;
}

export interface AttackData {
    version: string;
    timestamp: string;
    techniques: AttackTechnique[];
    metadata?: {
        title?: string;
        creator?: string;
        created?: string;
        description?: string;
        tags?: string[];
    };
}

// attack-data.json 예시
// {
//     "version": "1.0",
//     "timestamp": "2024-03-20T10:00:00Z",
//     "techniques": [
//         {
//             "techniqueID": "T1548",
//             "tactics": ["privilege-escalation", "defense-evasion"],
//             "name": "Abuse Elevation Control Mechanism",
//             "severity": "high"
//         }
//     ],
//     "metadata": {
//         "title": "Attack Pattern Analysis",
//         "creator": "Security Team",
//         "created": "2024-03-20"
//     }
// }
