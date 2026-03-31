'use client';

import { useState } from 'react';
import VendorDashboardLayout, { useVendor } from '@/components/VendorDashboardLayout';
import { MessageSquare, Phone, Mail, Clock, CheckCircle, Loader2 } from 'lucide-react';

function EnquiriesContent() {
  const { enquiries, loading } = useVendor();
  const [expanded, setExpanded] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'read': return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'replied': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="animate-spin" size={24} style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Enquiries</h1>
          <p className="text-slate-400 text-sm mt-0.5">{enquiries.length} total customer messages</p>
        </div>
        {enquiries.filter(e => (e.status === 'new' || !e.status)).length > 0 && (
          <span className="px-3 py-1 text-xs font-bold rounded-full text-white" style={{ background: 'var(--primary)' }}>
            {enquiries.filter(e => (e.status === 'new' || !e.status)).length} New
          </span>
        )}
      </div>

      {enquiries.length > 0 ? (
        <div className="space-y-3">
          {enquiries.map((enquiry: any) => {
            const isNew = !enquiry.status || enquiry.status === 'new';
            const isExpanded = expanded === enquiry.id;
            const name = enquiry.customer_name ?? enquiry.name ?? enquiry.senderName ?? 'Customer';
            const phone = enquiry.customer_phone ?? enquiry.phone ?? enquiry.senderMobile ?? '';
            const message = enquiry.message ?? enquiry.service ?? '';
            const status = enquiry.status ?? 'new';
            const date = enquiry.created_at
              ? new Date(enquiry.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
              : enquiry.date ?? '';

            return (
              <div
                key={enquiry.id}
                className={`bg-white rounded-2xl border transition-all ${isNew ? 'border-blue-100 shadow-sm' : 'border-slate-100'}`}
              >
                <button
                  className="w-full text-left p-4 sm:p-5"
                  onClick={() => setExpanded(isExpanded ? null : enquiry.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <MessageSquare size={16} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-slate-900 text-sm">{name}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5 truncate">{message}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-300 flex-shrink-0">{date}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-4 border-t border-slate-50">
                    <p className="text-slate-700 text-sm leading-relaxed py-3">{message}</p>
                    <div className="flex flex-wrap gap-2">
                      {phone && (
                        <a
                          href={`tel:${phone}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-80"
                          style={{ background: 'var(--primary)' }}
                        >
                          <Phone size={13} /> Call {phone}
                        </a>
                      )}
                      <a
                        href={`https://wa.me/91${phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-green-500 text-white hover:opacity-80 transition-opacity"
                      >
                        <MessageSquare size={13} /> WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <MessageSquare className="text-slate-200 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Enquiries Yet</h3>
          <p className="text-slate-400 text-sm">Customer enquiries will appear here</p>
        </div>
      )}
    </div>
  );
}

export default function VendorEnquiriesPage() {
  return (
    <VendorDashboardLayout>
      <EnquiriesContent />
    </VendorDashboardLayout>
  );
}
