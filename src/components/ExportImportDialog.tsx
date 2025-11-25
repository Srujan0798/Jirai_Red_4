
import React, { useState, useRef } from 'react';
import { X, Download, Upload, FileJson, Image, FileText, Check, AlertCircle, FileCode2 } from 'lucide-react';
import { useStore } from '../store';
import { exportToJSON, exportToPNG, exportToMarkdown, exportToTOON } from '../utils/export';
import { importWorkspace } from '../utils/import';

interface ExportImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'export' | 'import';
}

export const ExportImportDialog: React.FC<ExportImportDialogProps> = ({ isOpen, onClose, initialTab = 'export' }) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>(initialTab);
  const { nodes, edges, selectedNodeIds, setGraph } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = async (type: 'json' | 'png' | 'md' | 'toon') => {
    setIsProcessing(true);
    try {
      if (type === 'json') {
        exportToJSON(nodes, edges, selectedNodeIds);
      } else if (type === 'png') {
        const canvas = document.querySelector('.react-flow__viewport') as HTMLElement;
        await exportToPNG(canvas);
      } else if (type === 'md') {
        exportToMarkdown(nodes);
      } else if (type === 'toon') {
        exportToTOON(nodes, edges);
      }
      setSuccess('Export successful!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError('Export failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await importWorkspace(file);
      // Simple replace strategy for now
      if (confirm('This will replace your current workspace. Continue?')) {
        setGraph(result.nodes, result.edges);
        setSuccess('Workspace imported successfully!');
        setTimeout(() => {
            setSuccess(null);
            onClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Import failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181B21] border border-[#2D313A] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <X size={20} />
        </button>

        {/* Header */}
        <div className="flex border-b border-[#2D313A]">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'export' ? 'bg-[#181B21] text-white border-b-2 border-[#FF4F5E]' : 'bg-[#0F1115] text-gray-500 hover:text-gray-300'}`}
          >
            Export
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'import' ? 'bg-[#181B21] text-white border-b-2 border-[#FF4F5E]' : 'bg-[#0F1115] text-gray-500 hover:text-gray-300'}`}
          >
            Import
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-xs flex items-center gap-2">
              <Check size={16} /> {success}
            </div>
          )}

          {activeTab === 'export' ? (
            <div className="space-y-3">
               <p className="text-sm text-gray-400 mb-4">Choose a format to download your workspace.</p>
               
               <button onClick={() => handleExport('json')} className="w-full flex items-center gap-3 p-3 bg-[#0F1115] hover:bg-[#2D313A] border border-[#2D313A] rounded-xl transition-all group">
                 <div className="p-2 bg-blue-500/10 text-blue-400 rounded group-hover:bg-blue-500 group-hover:text-white"><FileJson size={20} /></div>
                 <div className="text-left"><div className="text-sm font-medium text-white">JSON Data</div><div className="text-[10px] text-gray-500">Full backup (Standard)</div></div>
               </button>

               <button onClick={() => handleExport('toon')} className="w-full flex items-center gap-3 p-3 bg-[#0F1115] hover:bg-[#2D313A] border border-[#2D313A] rounded-xl transition-all group">
                 <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded group-hover:bg-emerald-500 group-hover:text-white"><FileCode2 size={20} /></div>
                 <div className="text-left"><div className="text-sm font-medium text-white">TOON Format</div><div className="text-[10px] text-gray-500">AI-Optimized & Compact</div></div>
               </button>

               <button onClick={() => handleExport('png')} className="w-full flex items-center gap-3 p-3 bg-[#0F1115] hover:bg-[#2D313A] border border-[#2D313A] rounded-xl transition-all group">
                 <div className="p-2 bg-purple-500/10 text-purple-400 rounded group-hover:bg-purple-500 group-hover:text-white"><Image size={20} /></div>
                 <div className="text-left"><div className="text-sm font-medium text-white">PNG Image</div><div className="text-[10px] text-gray-500">High-res screenshot</div></div>
               </button>

               <button onClick={() => handleExport('md')} className="w-full flex items-center gap-3 p-3 bg-[#0F1115] hover:bg-[#2D313A] border border-[#2D313A] rounded-xl transition-all group">
                 <div className="p-2 bg-orange-500/10 text-orange-400 rounded group-hover:bg-orange-500 group-hover:text-white"><FileText size={20} /></div>
                 <div className="text-left"><div className="text-sm font-medium text-white">Markdown</div><div className="text-[10px] text-gray-500">Outline format</div></div>
               </button>
            </div>
          ) : (
            <div className="text-center">
              <div 
                className="border-2 border-dashed border-[#2D313A] hover:border-[#FF4F5E] rounded-xl p-8 cursor-pointer transition-colors group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 bg-[#2D313A] rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 group-hover:text-[#FF4F5E] transition-colors">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-medium text-white">Click to Upload</p>
                <p className="text-xs text-gray-500 mt-1">Supports JSON & TOON files</p>
              </div>
              <input ref={fileInputRef} type="file" accept=".json,.toon" className="hidden" onChange={handleImport} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
