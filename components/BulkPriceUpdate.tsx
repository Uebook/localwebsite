'use client';

import { useState } from 'react';
import { Upload, Download, File, X, CheckCircle, Info, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useVendor } from '@/components/VendorDashboardLayout';

interface BulkPriceUpdateProps {
  onBack?: () => void;
  vendorProducts?: any[];
  onUpdatePrices?: () => void;
}

export default function BulkPriceUpdate({ onBack, vendorProducts = [], onUpdatePrices }: BulkPriceUpdateProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [uploadResults, setUploadResults] = useState<any[]>([]);

  const { vendor, loading: vendorLoading } = useVendor();

  const handleDownloadTemplate = async () => {
    if (!vendor?.id) {
      alert('Vendor session not found');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/vendor-products/template?vendorId=${encodeURIComponent(vendor.id)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to download template');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vendor_price_update_template.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Failed to download template');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel' ||
        selectedFile.name.endsWith('.xlsx') ||
        selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
      } else {
        alert('Please select a valid Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }
    if (!vendor?.id) {
      alert('Vendor session not found');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('vendorId', vendor.id);

      const res = await fetch('/api/vendor-products/bulk-price', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors && data.errors.length > 0) {
          alert(`Import failed with errors: ${data.errors.map((e: any) => `Row ${e.row}: ${e.error}`).join('\n')}`);
        } else {
          throw new Error(data.error || 'Import failed');
        }
      } else {
        alert(`Successfully updated ${data.updated} product prices!`);
        setFile(null);
        if (onUpdatePrices) {
          onUpdatePrices();
        }
      }
    } catch (err: any) {
      alert(err.message || 'Price update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const validImages = selectedFiles.filter(f => f.type.startsWith('image/'));
      if (validImages.length < selectedFiles.length) {
          alert('Some files were skipped. Please only upload images.');
      }
      setImageFiles(prev => [...prev, ...validImages]);
      setUploadResults([]); // Clear previous results
    }
  };

  const handleBulkImageUpload = async () => {
    if (imageFiles.length === 0) return;
    if (!vendor?.id) return;

    setImageLoading(true);
    setUploadResults([]);
    
    try {
      const formData = new FormData();
      formData.append('vendorId', vendor.id);
      imageFiles.forEach(f => formData.append('files', f));

      const res = await fetch('/api/vendor-products/bulk-images', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      setUploadResults(data.results || []);
      setImageFiles([]); // Clear queue on success
      if (onUpdatePrices) onUpdatePrices(); // Refresh data
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900 flex-1 text-center">Bulk Product Update</h1>
          <button
            onClick={() => setShowInstructions(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Info className="w-5 h-5 text-orange-600" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Download Template Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-6 h-6 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Download Template</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Download the Excel template with your current products. You can update **Prices**, **MRP**, and **Image URLs** then upload it back.
          </p>
          <button
            onClick={handleDownloadTemplate}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Template</span>
          </button>
        </div>

        {/* Upload File Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-6 h-6 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Upload Excel File</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Select the Excel file with updated prices. Make sure the file follows the template format.
          </p>

          {file ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          ) : (
            <label className="block">
              <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center bg-orange-50 cursor-pointer hover:bg-orange-100 transition">
                <Upload className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <p className="font-semibold text-orange-600 mb-1">Select Excel File</p>
                <p className="text-sm text-gray-500">.xlsx or .xls files only</p>
              </div>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {file && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Update Prices & Data</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* NEW: Bulk Image Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Bulk Image Uploader</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Select multiple images to upload. Name your files after your products (e.g., <code className="bg-gray-100 px-1 rounded text-orange-600">Milk.jpg</code>) and we will match them automatically.
          </p>

          <label className="block mb-4">
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center bg-blue-50/30 cursor-pointer hover:bg-blue-50 transition">
              <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="font-semibold text-blue-600">Select Multiple Images</p>
              <p className="text-xs text-slate-400">Match by Product Name</p>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleImageFileChange} className="hidden" />
          </label>

          {imageFiles.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-bold text-slate-700 mb-2">{imageFiles.length} images selected</p>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-lg">
                {imageFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200 text-[10px] font-medium text-slate-600">
                    <span className="truncate max-w-[100px]">{f.name}</span>
                    <button onClick={() => setImageFiles(prev => prev.filter((_, idx) => idx !== i))}>
                      <X size={10} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleBulkImageUpload}
                disabled={imageLoading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
              >
                {imageLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload size={18} />}
                <span>Upload & Match Images</span>
              </button>
            </div>
          )}

          {uploadResults.length > 0 && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold mb-3">Upload Results</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
                {uploadResults.map((res, i) => (
                  <div key={i} className={`flex items-center justify-between p-2 rounded ${res.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <span className="truncate max-w-[200px]">{res.fileName}</span>
                    <span className="font-bold">{res.status === 'success' ? 'Matched: ' + res.productName : res.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-6 h-6 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Instructions</h2>
          </div>
          <ol className="space-y-3 list-decimal list-inside text-gray-600">
            <li>Fill in the "New Price" or "Image URL (optional)" columns</li>
            <li>Maintain existing IDs to ensure correct updates</li>
            <li>Use the Multi-Image Uploader for local files (match by name)</li>
          </ol>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">How to Use Bulk Price Update</h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-gray-600">
              <p>• Download the template to get your current product list</p>
              <p>• Open the Excel file and update the "New Price" column</p>
              <p>• Do not modify Product ID, Product Name, or other columns</p>
              <p>• Save the file and upload it here</p>
              <p>• Prices will be updated after admin verification</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
