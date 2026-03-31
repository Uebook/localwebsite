'use client';

import VendorDashboardLayout, { useVendor } from '@/components/VendorDashboardLayout';
import BulkPriceUpdate from '@/components/BulkPriceUpdate';
import { useRouter } from 'next/navigation';

function BulkUpdateContent() {
  const router = useRouter();
  const { products, refresh } = useVendor();

  return (
    <BulkPriceUpdate
      onBack={() => router.push('/vendor/dashboard')}
      vendorProducts={products}
      onUpdatePrices={() => {
        refresh();
        router.push('/vendor/dashboard/catalog');
      }}
    />
  );
}

export default function BulkUpdatePage() {
  return (
    <VendorDashboardLayout hideTabs={false}>
      <BulkUpdateContent />
    </VendorDashboardLayout>
  );
}
