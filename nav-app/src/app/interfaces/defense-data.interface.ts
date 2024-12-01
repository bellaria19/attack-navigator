export interface DefenseMeasure {
    techniqueID: string;
    status: 'detected' | 'blocked' | 'mitigated';
    detectionMethod?: string;
    implementedControls?: string[];
    timestamp: string;
    confidence: 'high' | 'medium' | 'low';
    description?: string;
    actionTaken?: string;
    recommendedActions?: string[];
}

export interface DefenseData {
    version: string;
    timestamp: string;
    measures: DefenseMeasure[];
    metadata?: {
        title?: string;
        organization?: string;
        lastUpdated?: string;
        description?: string;
        environment?: string;
        tooling?: string[];
    };
}

// defense-data.json 예시
// {
//     "version": "1.0",
//     "timestamp": "2024-03-20T10:00:00Z",
//     "measures": [
//         {
//             "techniqueID": "T1548",
//             "status": "detected",
//             "detectionMethod": "EDR Alert",
//             "implementedControls": [
//                 "Access Control",
//                 "Monitoring"
//             ],
//             "timestamp": "2024-03-20T09:45:00Z",
//             "confidence": "high",
//             "description": "Description of the detected technique",
//             "actionTaken": "Action taken",
//             "recommendedActions": [
//                 "Recommended action 1",
//                 "Recommended action 2"
//             ]
//         }
//     ],
//     "metadata": {
//         "title": "Defense Measures Report",
//         "organization": "Security Operations",
//         "lastUpdated": "2024-03-20T10:00:00Z",
//         "description": "Description of the entire data",
//         "environment": "Environment information",
//         "tooling": [
//             "Tool 1",
//             "Tool 2"
//         ]
//     }
// }
