import React from 'react';
import { Shield, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { PolicyAnalysis } from '../types';

interface PolicySummaryProps {
  analysis: PolicyAnalysis;
}

const PolicySummary: React.FC<PolicySummaryProps> = ({ analysis }) => {
  const { summary } = analysis;

  const summaryItems = [
    {
      icon: Shield,
      label: 'Sum Insured',
      value: summary.sumInsured,
      color: 'blue'
    },
    {
      icon: DollarSign,
      label: 'Room Rent Limit',
      value: summary.roomRentLimit,
      color: 'green'
    },
    {
      icon: Clock,
      label: 'Waiting Period',
      value: summary.waitingPeriod,
      color: 'orange'
    },
    {
      icon: AlertTriangle,
      label: 'Co-pay',
      value: summary.coPay,
      color: 'purple'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Policy Summary</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryItems.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <item.icon className={`h-5 w-5 text-${item.color}-500 mr-2`} />
              <span className="text-sm font-medium text-gray-600">{item.label}</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Key Exclusions
        </h3>
        <ul className="space-y-2">
          {summary.keyExclusions.map((exclusion, index) => (
            <li key={index} className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              <span className="text-gray-700">{exclusion}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Simplified Clauses</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {analysis.simplifiedClauses.slice(0, 3).map((clause, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Page {clause.pageNumber}, {clause.clauseNumber}
                </span>
              </div>
              
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-600 mb-1">Simple Explanation:</h4>
                <p className="text-gray-800">{clause.simplifiedText}</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <h4 className="text-sm font-semibold text-green-800 mb-1">Analogy:</h4>
                <p className="text-green-700 text-sm">{clause.analogy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolicySummary;