import React, { useState, useEffect, useRef } from 'react';
import { UploadedImage, CropState, CountryPreset, AIAnalysisResult } from '../types';
import { checkPhotoCompliance } from '../services/geminiService';
import { generatePassportPhoto } from '../services/imageProcessing';

interface EditorStepProps {
  image: UploadedImage;
  preset: CountryPreset;
  onBack: () => void;
  onComplete: (processedImageSrc: string) => void;
}

const BG_COLORS = [
  { name: 'White', value: '#FFFFFF', border: 'border-slate-200' },
  { name: 'Light Grey', value: '#F0F0F0', border: 'border-slate-300' },
  { name: 'Light Blue', value: '#E6F3FF', border: 'border-blue-200' },
  { name: 'Blue', value: '#0066CC', border: 'border-blue-700' },
  { name: 'Red', value: '#DB1517', border: 'border-red-700' },
];

const EditorStep: React.FC<EditorStepProps> = ({ image, preset, onBack, onComplete }) => {
  const [crop, setCrop] = useState<CropState>({ x: 0, y: 0, zoom: 1, rotation: 0 });
  const [bgColor, setBgColor] = useState<string>(preset.bgColor);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset bgColor when preset changes
  useEffect(() => {
    setBgColor(preset.bgColor);
  }, [preset]);
  
  // Update live preview when controls change
  useEffect(() => {
    let active = true;
    const updatePreview = async () => {
      try {
        const result = await generatePassportPhoto(image.originalUrl, crop, preset, bgColor);
        if (active) setPreviewSrc(result);
      } catch (e) {
        console.error(e);
      }
    };
    updatePreview();
    return () => { active = false; };
  }, [crop, image.originalUrl, preset, bgColor]);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Use the current preview (cropped) for analysis
      const result = await checkPhotoCompliance(previewSrc, preset.name);
      setAiResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    onComplete(previewSrc);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 h-full">
      {/* Editor Canvas Area */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col transition-colors order-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white transition-colors">Adjust Photo</h2>
          <div className="flex gap-2">
             <button onClick={onBack} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-1 rounded text-sm transition-colors">
               Cancel
             </button>
             <button 
               onClick={handleAIAnalysis}
               disabled={isAnalyzing}
               className={`
                 flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium text-white text-sm transition-all
                 ${isAnalyzing ? 'bg-blue-400 dark:bg-blue-600 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20'}
               `}
             >
               {isAnalyzing ? (
                 <>
                   <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   <span className="hidden sm:inline">Analyzing...</span>
                   <span className="sm:hidden">...</span>
                 </>
               ) : (
                 <>
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                   AI Check
                 </>
               )}
             </button>
          </div>
        </div>

        {/* Visual Editor */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl relative overflow-hidden min-h-[300px] md:min-h-[400px] flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors">
           {/* This simulates the editor view. In a real heavy app, this would be the interactive canvas. 
               Here we show the resulting preview which updates as we move sliders. */}
           <img 
             src={previewSrc} 
             alt="Preview" 
             className="shadow-2xl object-contain max-h-[85%] max-w-[85%] bg-white"
             style={{
               aspectRatio: `${preset.widthMm}/${preset.heightMm}`
             }}
           />
           
           {/* Guides Overlay */}
           <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div 
                className="border-2 border-blue-400/50 relative"
                style={{
                  width: `${Math.min(300, 300 * (preset.widthMm/preset.heightMm))}px`,
                  height: '300px',
                  maxWidth: '85%',
                  maxHeight: '85%'
                }}
              >
                {/* Center Crosshair */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-400/30"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-400/30"></div>
                
                {/* Eye Line Guide (approximate) */}
                <div className="absolute top-[40%] left-4 right-4 h-px border-t border-dashed border-red-400/50"></div>
                <div className="absolute top-[40%] right-2 text-[10px] text-red-500 font-mono">EYES</div>
                
                {/* Head Top Guide */}
                <div className="absolute top-[10%] left-10 right-10 h-px border-t border-dashed border-green-400/50"></div>
              </div>
           </div>
        </div>

        {/* Controls */}
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
               <div>
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors flex justify-between">
                   <span>Zoom</span>
                   <span className="text-slate-400">{crop.zoom.toFixed(1)}x</span>
                 </label>
                 <input 
                   type="range" min="0.5" max="3" step="0.1"
                   value={crop.zoom}
                   onChange={(e) => setCrop({...crop, zoom: parseFloat(e.target.value)})}
                   className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-colors mt-1"
                 />
               </div>
               <div>
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors flex justify-between">
                   <span>Rotation</span>
                   <span className="text-slate-400">{crop.rotation}°</span>
                 </label>
                 <input 
                   type="range" min="-45" max="45" step="1"
                   value={crop.rotation}
                   onChange={(e) => setCrop({...crop, rotation: parseFloat(e.target.value)})}
                   className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-colors mt-1"
                 />
               </div>
            </div>
            <div className="space-y-4">
               <div>
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Horizontal Position</label>
                 <input 
                   type="range" min="-200" max="200" step="1"
                   value={crop.x}
                   onChange={(e) => setCrop({...crop, x: parseFloat(e.target.value)})}
                   className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-colors mt-1"
                 />
               </div>
               <div>
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Vertical Position</label>
                 <input 
                   type="range" min="-200" max="200" step="1"
                   value={crop.y}
                   onChange={(e) => setCrop({...crop, y: parseFloat(e.target.value)})}
                   className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-colors mt-1"
                 />
               </div>
            </div>
          </div>
          
          {/* Background Color Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors block mb-2">Background Color</label>
            <div className="flex flex-wrap items-center gap-3">
              {BG_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setBgColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 ${color.border} ${bgColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-800' : ''}`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  aria-label={`Select ${color.name} background`}
                />
              ))}
              
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
              
              <div className="relative">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer p-0 border-0 overflow-hidden"
                  title="Custom Color"
                />
                <div className="absolute inset-0 rounded-full border border-slate-200 dark:border-slate-600 pointer-events-none"></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Note: Changing background color works best with transparent images (PNG) or when filling empty space.
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar: AI Analysis & Preset Info */}
      <div className="space-y-4 md:space-y-6 lg:order-2 order-2">
        
        {/* Preset Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 md:p-6 transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-white mb-2 transition-colors">{preset.name} Standard</h3>
          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2 transition-colors">
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-mono">{preset.widthMm}mm x {preset.heightMm}mm</span>
            </div>
            <div className="flex justify-between">
              <span>Background:</span>
              <span className="capitalize">{preset.bgColor === '#FFFFFF' ? 'White' : 'Light Grey'}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700 mt-2 transition-colors">
              {preset.description}
            </p>
          </div>
        </div>

        {/* AI Results Card */}
        {aiResult && (
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-l-4 transition-colors ${aiResult.isValid ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'}`}>
            <div className="flex items-center justify-between mb-4">
               <h3 className={`font-bold transition-colors ${aiResult.isValid ? 'text-green-800 dark:text-green-400' : 'text-orange-800 dark:text-orange-400'}`}>
                 {aiResult.isValid ? 'Passed' : 'Issues'}
               </h3>
               <span className="text-2xl font-bold text-slate-700 dark:text-slate-200 transition-colors">{aiResult.score}<span className="text-sm text-slate-400 dark:text-slate-500">/100</span></span>
            </div>
            
            {aiResult.issues.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1 transition-colors">Issues</p>
                <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1 transition-colors">
                  {aiResult.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiResult.suggestions.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1 transition-colors">Suggestions</p>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1 transition-colors">
                  {aiResult.suggestions.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={handleSave}
          className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-bold py-3 md:py-4 rounded-xl shadow-xl shadow-slate-900/10 dark:shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <span>Next Step</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </button>

      </div>
    </div>
  );
};

export default EditorStep;