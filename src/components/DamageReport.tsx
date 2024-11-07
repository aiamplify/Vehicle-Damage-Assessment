import React from 'react';
import { AlertTriangle, Wrench, DollarSign } from 'lucide-react';
import type { DamageReport as DamageReportType } from '../types';

interface DamageReportProps {
  report: DamageReportType;
}

export function DamageReport({ report }: DamageReportProps) {
  const severityColor = {
    Minor: 'bg-yellow-100 text-yellow-800',
    Moderate: 'bg-orange-100 text-orange-800',
    Severe: 'bg-red-100 text-red-800',
  }[report.severity];

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium">Damage Assessment</h3>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(report.timestamp).toLocaleString()}
          </p>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${severityColor}`}>
          {report.severity}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {report.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Damage view ${index + 1}`}
            className="rounded-lg object-cover w-full h-48"
          />
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Damage Locations</h4>
          <ul className="space-y-2">
            {report.damageLocations.map((location, index) => (
              <li key={index} className="text-sm">
                <span className="font-medium">{location.area}:</span>{' '}
                {location.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-gray-500" />
          <span className="font-medium">
            Estimated Cost: ${report.estimatedCost.toLocaleString()}
          </span>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Wrench className="h-5 w-5 text-gray-500" />
            <h4 className="font-medium">Recommendations</h4>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {report.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-600">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}