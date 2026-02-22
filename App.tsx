import React, { useState, useEffect } from 'react';
import { UploadedImage, CountryPreset, AppStep, CropState } from './types';
import { COUNTRY_PRESETS } from './constants';
import UploadStep from './components/UploadStep';
import EditorStep from './components/EditorStep';
import PreviewDownload from './components/PreviewDownload';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [selectedPreset, setSelectedPreset] = useState<CountryPreset>(COUNTRY_PRESETS[0]);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  
  // Dark mode state - defaulting to false (light mode)
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        // Create an image object to get dimensions
        const img = new Image();
        img.onload = () => {
          setUploadedImage({
            originalUrl: e.target?.result as string,
            width: img.width,
            height: img.height,
            file
          });
          setStep(AppStep.EDITOR);
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditorComplete = (processedImageSrc: string) => {
    setFinalImage(processedImageSrc);
    setStep(AppStep.PREVIEW);
  };

  const handleReset = () => {
    // Revoke object URLs if we used them to prevent memory leaks
    setStep(AppStep.UPLOAD);
    setUploadedImage(null);
    setFinalImage(null);
  };

  const getStepNumber = (s: AppStep) => {
    switch(s) {
      case AppStep.UPLOAD: return 1;
      case AppStep.EDITOR: return 2;
      case AppStep.PREVIEW: return 3;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 flex flex-col font-sans transition-colors duration-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
              P
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight truncate hidden xs:block">PassportPro AI</span>
          </div>
          <nav className="flex items-center gap-2 md:gap-4">
             {/* Desktop Progress Indicators */}
             <div className="hidden md:flex items-center gap-2 text-sm mr-4">
               <span className={`px-3 py-1 rounded-full transition-colors ${step === AppStep.UPLOAD ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>1. Upload</span>
               <span className="text-slate-300 dark:text-slate-700">/</span>
               <span className={`px-3 py-1 rounded-full transition-colors ${step === AppStep.EDITOR ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>2. Edit</span>
               <span className="text-slate-300 dark:text-slate-700">/</span>
               <span className={`px-3 py-1 rounded-full transition-colors ${step === AppStep.PREVIEW ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>3. Download</span>
             </div>

             {/* Mobile Progress Indicator */}
             <div className="md:hidden flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 mr-2">
                Step {getStepNumber(step)}/3
             </div>

             {/* Dark Mode Toggle */}
             <button 
               onClick={() => setIsDarkMode(!isDarkMode)}
               className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
               aria-label="Toggle Dark Mode"
             >
               {isDarkMode ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                 </svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                 </svg>
               )}
             </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 w-full max-w-7xl mx-auto">
        {step === AppStep.UPLOAD && (
          <UploadStep 
            onUpload={handleUpload} 
            selectedPreset={selectedPreset}
            presets={COUNTRY_PRESETS}
            onSelectPreset={setSelectedPreset}
          />
        )}
        
        {step === AppStep.EDITOR && uploadedImage && (
          <EditorStep 
            image={uploadedImage}
            preset={selectedPreset}
            onBack={() => setStep(AppStep.UPLOAD)}
            onComplete={handleEditorComplete}
          />
        )}

        {step === AppStep.PREVIEW && finalImage && (
          <PreviewDownload 
            finalImageSrc={finalImage}
            preset={selectedPreset}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 md:py-8 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 dark:text-slate-500 text-xs md:text-sm">
          <p>© {new Date().getFullYear()} PassportPro AI. Images are processed locally in your browser.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;