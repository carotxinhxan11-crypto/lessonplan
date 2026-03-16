import React, { useState, useRef } from 'react';
import { Sparkles, Upload, FileText, Trash2, Loader2, BookOpen, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateLessonPlan } from './services/gemini';
import LessonPlanOutput from './components/LessonPlanOutput';

export default function App() {
  const [outline, setOutline] = useState('');
  const [files, setFiles] = useState<{ name: string; data: string; mimeType: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFiles(prev => [...prev, {
          name: file.name,
          data: event.target?.result as string,
          mimeType: file.type
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!outline.trim()) {
      setError('Please provide a lesson outline first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedPlan(null);

    try {
      const plan = await generateLessonPlan(outline, files);
      setGeneratedPlan(plan || '');
    } catch (err) {
      console.error(err);
      setError('Failed to generate lesson plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-pink-100 py-6 px-4 sticky top-0 z-10 shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
              <BookOpen size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Lesson Plan Generator</h1>
              <p className="text-pink-500 text-sm font-medium">For Vietnamese English Teachers</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-pink-400 font-medium text-sm bg-pink-50 px-4 py-2 rounded-full">
            <Sparkles size={16} />
            <span>Smart Practicum Assistant</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-10">
        <div className="grid gap-8 print:hidden">
          {/* Section 1: Lesson Outline */}
          <section className="bg-white rounded-3xl shadow-sm p-8 border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">1. Lesson Outline</h2>
              </div>
              <button 
                onClick={() => setOutline('Activity 1: Warm-up – Guessing Game\nActivity 2: Everyday English – Listen and Read\nActivity 3: Pair Speaking Practice\nActivity 4: Reading Discussion\nActivity 5: Quiz\nHomework')}
                className="text-xs font-bold text-pink-400 hover:text-pink-600 transition-colors"
              >
                Try Example
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Type your classroom activities here (Vietnamese or English). 
              Example: Activity 1: Warm-up - Guessing Game, Activity 2: Listen and Read...
            </p>
            <textarea
              value={outline}
              onChange={(e) => setOutline(e.target.value)}
              placeholder="Enter your lesson outline or list of activities..."
              className="w-full h-48 p-4 bg-pink-50/50 border-2 border-pink-100 rounded-2xl focus:border-pink-300 focus:ring-0 transition-all resize-none text-gray-700 placeholder:text-pink-200"
            />
          </section>

          {/* Section 2: Textbook Upload */}
          <section className="bg-white rounded-3xl shadow-sm p-8 border border-pink-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                <Upload size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">2. Optional Textbook Upload</h2>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Upload textbook pages (Images or PDFs) to help the AI align with specific tasks.
            </p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-pink-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-pink-50/30 hover:bg-pink-50 transition-colors cursor-pointer group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                multiple 
                accept="image/*,application/pdf"
                className="hidden" 
              />
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-pink-400 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <p className="text-pink-600 font-semibold">Click to upload files</p>
              <p className="text-pink-300 text-xs mt-1">PNG, JPG, PDF (Max 5MB)</p>
            </div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 space-y-2"
                >
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-pink-50 rounded-xl border border-pink-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-pink-400 shrink-0">
                          <FileText size={18} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="p-1.5 text-pink-300 hover:text-pink-600 hover:bg-white rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Section 3: Generate Button */}
          <div className="flex flex-col items-center gap-4">
            {error && (
              <p className="text-red-500 text-sm font-medium animate-bounce">{error}</p>
            )}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto px-12 py-4 bg-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 hover:bg-pink-600 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Wand2 size={24} />
                  Generate Lesson Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 4: Output */}
        <LessonPlanOutput content={generatedPlan || ''} />
      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-pink-300 text-sm print:hidden">
        <p>© 2026 AI Lesson Plan Generator • Crafted for Teachers</p>
      </footer>
    </div>
  );
}
