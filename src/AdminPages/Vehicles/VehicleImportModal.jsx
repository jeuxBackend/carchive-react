import React, { useState, useRef } from 'react';
import { importCars } from '../../API/adminServices';
import { BeatLoader } from 'react-spinners';

function VehicleImportModal({ isOpen, onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (f) => {
        setError('');
        setFile(f || null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const dropped = e.dataTransfer?.files?.[0];
        if (dropped) handleFileChange(dropped);
    };

    const handleSubmit = async (e) => {
        e && e.preventDefault();
        setError('');
        if (!file) {
            setError('Please select a CSV file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            await importCars(formData);
            onSuccess && onSuccess();
            onClose && onClose();
        } catch (err) {
            console.error('Error uploading CSV:', err);
            const msg = err?.response?.data?.message || err?.message || 'Upload failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Import cars modal"
         
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div
                className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h3 className="text-lg font-semibold">Import Cars</h3>
                        <p className="text-sm text-gray-500">Upload a CSV file to bulk import vehicles.</p>
                    </div>

                    <button
                        onClick={() => { if (!loading) onClose(); }}
                        aria-label="Close import modal"
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-6">
                    <div
                        className={`flex flex-col items-center justify-center gap-4 p-6 rounded-lg border-2 border-dashed ${file ? 'border-blue-500/60' : 'border-gray-200'} bg-gray-50 cursor-pointer hover:bg-gray-100 transition`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16v4h10v-4M12 12v8m0-8l-4 4m4-4l4 4M12 3v9" />
                        </svg>

                        <div className="text-center">
                            <p className="font-medium text-sm text-gray-700">Drag & drop a CSV file here, or click to browse</p>
                            <p className="text-xs text-gray-400">File must be UTF-8 encoded, .csv</p>
                        </div>

                        {file && (
                            <div className="mt-2 text-sm text-gray-700">Selected: <span className="font-medium">{file.name}</span></div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,text/csv"
                            className="hidden"
                            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        />
                    </div>

                    {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => { if (!loading) onClose(); }}
                            className="px-4 py-2 bg-white border rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2d9bff] text-white rounded-md text-sm hover:bg-[#2d9bff]/80"
                            disabled={loading}
                        >
                            {loading ? <BeatLoader size={8} color="#fff" /> : 'Upload CSV'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VehicleImportModal;
