import React, { useCallback } from 'react';
import { CountryPreset } from '../types';

interface UploadStepProps {
  onUpload: (file: File) => void;
  selectedPreset: CountryPreset;
  presets: CountryPreset[];
  onSelectPreset: (preset: CountryPreset) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ 
  onUpload, 
  selectedPreset, 
  presets, 
  onSelectPreset 
}) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onUpload(e.dataTransfer.files[0]);
      }
    },
    [onUpload]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="text-center mb-6 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 md:mb-4 tracking-tight transition-colors">
          Professional Passport Photos in Seconds
        </h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors px-2">
          Secure, AI-powered ID photo generator. Photos are processed locally and auto-deleted.
          No signup required.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 md:p-8 mb-8 border border-slate-100 dark:border-slate-700 transition-colors">
        {/* Country Selector */}
        <div className="mb-6 md:mb-8">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 transition-colors">
            Select Document Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`
                  flex flex-col items-start p-3 rounded-xl border transition-all duration-200 text-left
                  ${selectedPreset.id === preset.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-1 md:ring-2 ring-blue-200 dark:ring-blue-800' 
                    : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }
                `}
              >
                <span className={`font-semibold text-sm transition-colors ${selectedPreset.id === preset.id ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-slate-200'}`}>
                  {preset.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-colors">
                  {preset.widthMm}x{preset.heightMm}mm
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 md:border-3 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer min-h-[250px] md:min-h-[300px] flex flex-col items-center justify-center p-6 md:p-8 group"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-2 transition-colors">
            Upload your photo
          </h3>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 text-center mb-6 max-w-sm transition-colors">
            Drag and drop or click to browse. <br className="hidden md:block"/>JPG or PNG, max 10MB.
          </p>
          <label className="relative">
            <input 
              type="file" 
              className="hidden" 
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
            />
            <span className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 md:px-8 rounded-lg shadow-lg shadow-blue-500/20 transition-all cursor-pointer inline-block text-sm md:text-base">
              Select Photo
            </span>
          </label>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs md:text-sm text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <span>Encrypted & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            <span>Auto-deleted after use</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStep;