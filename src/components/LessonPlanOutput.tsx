import React from 'react';
import Markdown from 'react-markdown';
import { Copy, Download, Printer, Check } from 'lucide-react';

interface LessonPlanOutputProps {
  content: string;
}

export default function LessonPlanOutput({ content }: LessonPlanOutputProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "lesson-plan.txt";
    document.body.appendChild(element);
    element.click();
  };

  if (!content) return null;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mt-8 border-2 border-pink-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4 print:hidden">
        <h2 className="text-2xl font-bold text-pink-600">Generated Lesson Plan</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors font-medium text-sm"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors font-medium text-sm"
          >
            <Printer size={16} />
            Print / PDF
          </button>
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors font-medium text-sm shadow-md"
          >
            <Download size={16} />
            Download TXT
          </button>
        </div>
      </div>

      <div className="markdown-body prose prose-pink max-w-none print:prose-sm">
        <Markdown>{content}</Markdown>
      </div>
      
      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .bg-white { border: none !important; box-shadow: none !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
