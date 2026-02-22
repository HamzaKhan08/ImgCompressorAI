import React, { useState, useEffect } from 'react';
import { CountryPreset } from '../types';
import { generatePrintSheet, compressImage, getFileSizeKB } from '../services/imageProcessing';

interface PreviewDownloadProps {
  finalImageSrc: string;
  preset: CountryPreset;
  onReset: () => void;
}

const PreviewDownload: React.FC<PreviewDownloadProps> = ({ finalImageSrc, preset, onReset }) => {
  const [activeTab, setActiveTab] = useState<'single' | 'sheet'>('single');
  const [sheetPreview, setSheetPreview] = useState<string | null>(null);
  const [sheetSize, setSheetSize] = useState<'4x6' | 'A4'>('4x6');
  const [isGenerating, setIsGenerating] = useState(false);

  // Compression State
  const [useCompression, setUseCompression] = useState(false);
  const [quality, setQuality] = useState(80); // 0-100
  const [currentSingleImage, setCurrentSingleImage] = useState(finalImageSrc);
  const [fileSizeKB, setFileSizeKB] = useState(0);

  // Update file size and compressed image when settings change
  useEffect(() => {
    const updateImage = async () => {
      if (activeTab === 'single') {
        let src = finalImageSrc;
        if (useCompression) {
          src = await compressImage(finalImageSrc, quality / 100);
        }
        setCurrentSingleImage(src);
        setFileSizeKB(getFileSizeKB(src));
      }
    };
    updateImage();
  }, [finalImageSrc, useCompression, quality, activeTab]);

  useEffect(() => {
    if (activeTab === 'sheet') {
      setIsGenerating(true);
      generatePrintSheet(finalImageSrc, preset, sheetSize)
        .then(setSheetPreview)
        .finally(() => setIsGenerating(false));
    }
  }, [activeTab, sheetSize, finalImageSrc, preset]);

  const handleDownload = (src: string, filename: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Privacy cleanup simulated
    setTimeout(() => {
       console.log("Session cleanup initiated.");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Your Photo is Ready</h2>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 transition-colors">Download your photo singly or as a printable sheet.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors">
        <div className="flex border-b border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('single')}
            className={`flex-1 py-3 md:py-4 font-medium text-xs md:text-sm transition-colors ${activeTab === 'single' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Single Photo
          </button>
          <button
            onClick={() => setActiveTab('sheet')}
            className={`flex-1 py-3 md:py-4 font-medium text-xs md:text-sm transition-colors ${activeTab === 'sheet' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Printable Sheet
          </button>
        </div>

        <div className="p-4 md:p-8">
          {activeTab === 'single' ? (
            <div className="flex flex-col items-center">
              {/* Preview Container */}
              <div className="p-2 bg-white dark:bg-slate-900 shadow-lg border border-slate-100 dark:border-slate-700 rounded-lg mb-4 inline-block transition-colors max-w-full">
                <img src={currentSingleImage} alt="Final" className="max-h-[200px] md:max-h-[300px] object-contain" style={{
                   maxWidth: '100%',
                }}/>
              </div>
              
              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 font-mono bg-slate-100 dark:bg-slate-900/50 px-4 py-2 rounded-full">
                <span>{preset.widthMm}x{preset.heightMm}mm</span>
                <span className="w-px h-3 bg-slate-300 dark:bg-slate-600"></span>
                <span>300 DPI</span>
                <span className="w-px h-3 bg-slate-300 dark:bg-slate-600"></span>
                <span>{fileSizeKB} KB</span>
              </div>

              {/* Compression Tools */}
              <div className="w-full max-w-md bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-100 dark:border-slate-700/50">
                 <div className="flex items-center justify-between mb-4">
                   <label className="flex items-center gap-2 cursor-pointer">
                     <div className="relative inline-flex items-center">
                        <input type="checkbox" className="sr-only peer" checked={useCompression} onChange={(e) => setUseCompression(e.target.checked)} />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                     </div>
                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300 select-none">Compress Image</span>
                   </label>
                   {useCompression && (
                     <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">{quality}% Quality</span>
                   )}
                 </div>

                 {useCompression && (
                   <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                     <div className="flex justify-between text-xs text-slate-400">
                        <span>Low Size</span>
                        <span>High Quality</span>
                     </div>
                     <input 
                       type="range" 
                       min="10" 
                       max="100" 
                       step="5" 
                       value={quality}
                       onChange={(e) => setQuality(parseInt(e.target.value))}
                       className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                     />
                     <p className="text-xs text-slate-400 text-center mt-2">
                       Many government forms require files under 100KB or 50KB.
                     </p>
                   </div>
                 )}
              </div>

              <button
                onClick={() => handleDownload(currentSingleImage, `passport-photo-${preset.id}${useCompression ? '-compressed' : ''}.jpg`)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download Photo
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex gap-2 md:gap-4 mb-6">
                <button 
                  onClick={() => setSheetSize('4x6')}
                  className={`px-3 md:px-4 py-2 rounded-lg border text-xs md:text-sm font-medium transition-colors ${sheetSize === '4x6' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 border-slate-300 dark:border-slate-600'}`}
                >
                  4x6 Inch
                </button>
                <button 
                  onClick={() => setSheetSize('A4')}
                  className={`px-3 md:px-4 py-2 rounded-lg border text-xs md:text-sm font-medium transition-colors ${sheetSize === 'A4' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 border-slate-300 dark:border-slate-600'}`}
                >
                  A4 Paper
                </button>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 p-2 md:p-4 rounded-xl mb-6 w-full flex justify-center overflow-auto max-h-[300px] md:max-h-[400px] transition-colors">
                {isGenerating || !sheetPreview ? (
                  <div className="flex flex-col items-center justify-center h-[200px] md:h-[300px] text-slate-400 dark:text-slate-500">
                    <svg className="animate-spin h-6 w-6 md:h-8 md:w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm">Generating...</span>
                  </div>
                ) : (
                  <img src={sheetPreview} alt="Print Sheet" className="shadow-md bg-white max-w-full" />
                )}
              </div>

              <button
                disabled={!sheetPreview}
                onClick={() => sheetPreview && handleDownload(sheetPreview, `printable-sheet-${sheetSize}.jpg`)}
                className="w-full sm:w-auto bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download Printable Sheet
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-8 md:mt-12">
        <button onClick={onReset} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm flex items-center justify-center gap-2 mx-auto transition-colors p-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Start New Photo
        </button>
      </div>
    </div>
  );
};

export default PreviewDownload;