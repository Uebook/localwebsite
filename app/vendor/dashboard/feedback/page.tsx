'use client';

import VendorDashboardLayout from '@/components/VendorDashboardLayout';
import FeedbackForm from '@/components/FeedbackForm';
import { useRouter } from 'next/navigation';

export default function FeedbackPage() {
  const router = useRouter();

  return (
    <VendorDashboardLayout hideTabs={false}>
      <FeedbackForm
        onBack={() => router.push('/vendor/dashboard')}
        userRole="vendor"
        onSubmit={(feedbackData) => {
          console.log('Feedback submitted:', feedbackData);
          router.push('/vendor/dashboard');
        }}
      />
    </VendorDashboardLayout>
  );
}
