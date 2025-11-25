
import React, { useState } from 'react';
import { Image, FileJson, FileCode, X } from 'lucide-react';
import { useStore } from '../store';
import FileSaver from 'file-saver';
import { toPng, toSvg } from 'html-to-image';

interface ExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose }) => {
    const { nodes, edges } = useStore();
    const [exporting, setExporting] = useState(false);

    // Safe extraction of saveAs function handling both default export (ESM) and named property (CommonJS/Types)
    const saveAs = (FileSaver as any).saveAs || FileSaver;

    if (!isOpen) return null;

    const handleExportJSON = () => {
        const data = JSON.stringify({ nodes, edges, version: '1.0' }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        saveAs(blob, `jirai-workspace-${Date.now()}.json`);
        onClose();
    };

    const handleExportImage = async (format: 'png' | 'svg') => {
        setExporting(true);
        const flowElement = document.querySelector('.react-flow__viewport') as HTMLElement;
        
        if (!flowElement) {
            console.error("Canvas not found");
            setExporting(false);
            return;
        }

        try {
            // Temporarily styling for better capture
            const options = {
                backgroundColor: '#0F1115',
                style: { transform: 'scale(1)' } // ensure normal scale
            };

            let dataUrl;
            if (format === 'png') {
                dataUrl = await toPng(flowElement, options);
            } else {
                dataUrl = await toSvg(flowElement, options);
            }

            saveAs(dataUrl, `jirai-export-${Date.now()}.${format}`);
            onClose();
        } catch (err) {
            console.error('Export failed', err);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#181B21] border border-[#2D313A] rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X size={20} />
                </button>
                
                <h2 className="text-xl font-bold text-white mb-1">Export Workspace</h2>
                <p className="text-sm text-gray-400 mb-6">Choose a format to save your graph.</p>
                
                <div className="space-y-3">
                    <button 
                        onClick={handleExportJSON}
                        className="w-full flex items-center gap-4 p-4 bg-black/20 hover:bg-black/40 border border-[#2D313A] hover:border-jirai-accent rounded-lg transition-all group"
                    >
                        <div className="p-3 rounded bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <FileJson size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-white font-medium">JSON Data</h3>
                            <p className="text-xs text-gray-500">Full backup, editable in Jirai</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleExportImage('png')}
                        disabled={exporting}
                        className="w-full flex items-center gap-4 p-4 bg-black/20 hover:bg-black/40 border border-[#2D313A] hover:border-jirai-accent rounded-lg transition-all group"
                    >
                        <div className="p-3 rounded bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <Image size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-white font-medium">PNG Image</h3>
                            <p className="text-xs text-gray-500">High-res screenshot for sharing</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleExportImage('svg')}
                        disabled={exporting}
                        className="w-full flex items-center gap-4 p-4 bg-black/20 hover:bg-black/40 border border-[#2D313A] hover:border-jirai-accent rounded-lg transition-all group"
                    >
                        <div className="p-3 rounded bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <FileCode size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-white font-medium">SVG Vector</h3>
                            <p className="text-xs text-gray-500">Scalable graphics for editing</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
