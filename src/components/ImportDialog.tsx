
import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, X, FileJson } from 'lucide-react';
import { useStore } from '../store';

interface ImportDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({ isOpen, onClose }) => {
    const { setGraph } = useStore();
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
                    throw new Error('Invalid file format: Missing nodes or edges array.');
                }

                setGraph(data.nodes, data.edges);
                onClose();
            } catch (err) {
                setError('Failed to parse JSON. Please ensure this is a valid Jirai export.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
             <div className="bg-[#181B21] border border-[#2D313A] rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-1">Import Workspace</h2>
                <p className="text-sm text-gray-400 mb-6">Restore a previously saved JSON file.</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded flex items-center gap-2 text-xs text-red-400">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div 
                    className="border-2 border-dashed border-[#2D313A] hover:border-jirai-accent rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group bg-black/20"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="w-16 h-16 rounded-full bg-[#2D313A] group-hover:bg-jirai-accent/20 flex items-center justify-center mb-4 transition-colors">
                        <Upload className="text-gray-400 group-hover:text-jirai-accent" size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-300 group-hover:text-white">Click to upload JSON</p>
                    <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                </div>

                <input 
                    type="file" 
                    accept=".json"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                />

                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="text-sm text-gray-400 hover:text-white px-4 py-2">
                        Cancel
                    </button>
                </div>
             </div>
        </div>
    );
};
