'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';

export default function ToastMessages() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    if (success === 'true') {
      toast.success('Payment successful! Thank you for your support.', {
        icon: '🎉',
      });
    }
    
    if (canceled === 'true') {
      toast.info('Payment was canceled. Feel free to try again when you\'re ready.');
    }
  }, [success, canceled]);

  return null;
}