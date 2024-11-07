import React, { useState } from 'react';
import { Car, History } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { DamageReport } from './components/DamageReport';
import { ApiSettings } from './components/ApiSettings';
import { useStore } from './store';
import { analyzeDamageImage } from './services/openai';
import type { DamageReport as DamageReportType } from './types';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { reports, addReport, apiConfig } = useStore();

  const handleImageUpload = async (files: File[]) => {
    if (!apiConfig.openai?.apiKey) {
      alert('Please configure your OpenAI API key in the settings first.');
      return;
    }

    try {
      setIsAnalyzing(true);

      // Convert files to data URLs
      const imageUrls = await Promise.all(
        files.map(file => new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        }))
      );

      // Analyze each image
      const assessments = await Promise.all(
        imageUrls.map(url => analyzeDamageImage(url, apiConfig.openai!.apiKey))
      );

      // Combine assessments if multiple images
      const combinedReport: DamageReportType = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        images: imageUrls,
        damageLocations: assessments.flatMap(a => a.damageLocations),
        severity: assessments.reduce((max, curr) => 
          ['Minor', 'Moderate', 'Severe'].indexOf(curr.severity) > 
          ['Minor', 'Moderate', 'Severe'].indexOf(max) ? curr.severity : max
        , 'Minor' as DamageReportType['severity']),
        estimatedCost: assessments.reduce((sum, curr) => sum + curr.estimatedCost, 0),
        recommendations: [...new Set(assessments.flatMap(a => a.recommendations))]
      };

      addReport(combinedReport);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error analyzing images: ${error.message}`);
      } else {
        alert('An unexpected error occurred while analyzing the images.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Vehicle Damage Assessment
              </h1>
            </div>
            <ApiSettings />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">New Assessment</h2>
              <ImageUpload onUpload={handleImageUpload} disabled={isAnalyzing} />
              {isAnalyzing && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  Analyzing images... This may take a few moments.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <History className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium">Assessment History</h2>
              </div>
              <div className="space-y-6">
                {reports.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No assessment reports yet. Upload vehicle images to get started.
                  </p>
                ) : (
                  reports.map(report => (
                    <DamageReport key={report.id} report={report} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;