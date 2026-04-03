'use client';

import { useState } from 'react';
import { Upload, Download, File, X, CheckCircle, Info, FileSpreadsheet, Loader2 } from 'lucide-react';

interface BulkInventoryUploadProps {
       vendorId: string;
       onSuccess: () => void;
       onCancel: () => void;
}

export default function BulkInventoryUpload({ vendorId, onSuccess, onCancel }: BulkInventoryUploadProps) {
       const [file, setFile] = useState<File | null>(null);
       const [loading, setLoading] = useState(false);
       const [error, setError] = useState('');
       const [success, setSuccess] = useState('');

       const handleDownloadTemplate = () => {
              const headers = ['Name', 'Local Price', 'Online Price', 'MRP', 'UOM', 'Description', 'Category ID'];
              const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "inventory_template.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
       };

       const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                     if (selectedFile.name.endsWith('.csv')) {
                            setFile(selectedFile);
                            setError('');
                     } else {
                            setError('Please upload a .csv file');
                     }
              }
       };

       const handleUpload = async () => {
              if (!file || !vendorId) return;
              setLoading(true);
              setError('');

              try {
                     const text = await file.text();
                     const lines = text.split('\n');
                     const products = [];

                     // Basic CSV parser (skip header)
                     for (let i = 1; i < lines.length; i++) {
                            const line = lines[i].trim();
                            if (!line) continue;
                            const [name, localPrice, onlinePrice, mrp, uom, description, categoryId] = line.split(',');

                            if (name && localPrice) {
                                   products.push({
                                          vendorId,
                                          name,
                                          price: parseFloat(localPrice),
                                          onlinePrice: onlinePrice ? parseFloat(onlinePrice) : null,
                                          mrp: mrp ? parseFloat(mrp) : null,
                                          uom: uom || 'Piece',
                                          description: description || '',
                                          categoryId: categoryId || null,
                                          type: 'Product',
                                          inStock: true
                                   });
                            }
                     }

                     if (products.length === 0) {
                            throw new Error('No valid products found in file');
                     }

                     let successCount = 0;
                     for (const product of products) {
                            const res = await fetch('/api/vendor/products', {
                                   method: 'POST',
                                   headers: { 'Content-Type': 'application/json' },
                                   body: JSON.stringify(product)
                            });
                            if (res.ok) successCount++;
                     }

                     setSuccess(`Successfully uploaded ${successCount} products!`);
                     setTimeout(() => {
                            onSuccess();
                     }, 2000);
              } catch (err: any) {
                     setError(err.message || 'Failed to upload inventory');
              } finally {
                     setLoading(false);
              }
       };

       return (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 max-w-2xl mx-auto">
                     <div className="flex items-center justify-between mb-8">
                            <div>
                                   <h2 className="text-2xl font-black text-slate-900">Bulk Inventory Upload</h2>
                                   <p className="text-sm text-slate-500 font-medium">Quickly add multiple items to your shop</p>
                            </div>
                            <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                                   <X size={24} />
                            </button>
                     </div>

                     <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                   <div className="flex items-start gap-4">
                                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                                                 <Download className="text-primary" size={24} />
                                          </div>
                                          <div>
                                                 <h3 className="font-bold text-slate-900">1. Download Template</h3>
                                                 <p className="text-xs text-slate-500 mb-4 leading-relaxed">Download our CSV template and fill it with your product details. Ensure "Name" and "Price" are provided.</p>
                                                 <button onClick={handleDownloadTemplate} className="text-xs font-black text-primary uppercase tracking-widest hover:opacity-70 transition-all">
                                                        Get CSV Template ↓
                                                 </button>
                                          </div>
                                   </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                   <div className="flex items-start gap-4">
                                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                                                 <Upload className="text-orange-500" size={24} />
                                          </div>
                                          <div className="flex-1">
                                                 <h3 className="font-bold text-slate-900">2. Upload Filled Template</h3>
                                                 <p className="text-xs text-slate-500 mb-4 leading-relaxed">Select your completed CSV file to start the import process.</p>

                                                 {file ? (
                                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                                                               <div className="flex items-center gap-3">
                                                                      <FileSpreadsheet className="text-green-500" size={20} />
                                                                      <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{file.name}</span>
                                                               </div>
                                                               <button onClick={() => setFile(null)} className="text-slate-300 hover:text-red-500">
                                                                      <X size={16} />
                                                               </button>
                                                        </div>
                                                 ) : (
                                                        <label className="block cursor-pointer">
                                                               <div className="py-4 border-2 border-dashed border-orange-200 rounded-2xl text-center bg-orange-50/30 hover:bg-orange-50 transition-all">
                                                                      <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Choose File</span>
                                                               </div>
                                                               <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                                                        </label>
                                                 )}
                                          </div>
                                   </div>
                            </div>

                            {error && (
                                   <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                                          <Info size={18} /> {error}
                                   </div>
                            )}

                            {success && (
                                   <div className="p-4 bg-green-50 text-green-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                                          <CheckCircle size={18} /> {success}
                                   </div>
                            )}

                            <button
                                   disabled={!file || loading}
                                   onClick={handleUpload}
                                   className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                   {loading ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle size={24} />}
                                   <span>{loading ? 'Importing Inventory...' : 'Start Import Now'}</span>
                            </button>
                     </div>
              </div>
       );
}
