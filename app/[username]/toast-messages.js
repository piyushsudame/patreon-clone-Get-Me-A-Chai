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
    
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'missing_payment_id':
          toast.error('Payment processing error: Missing payment ID');
          break;
        case 'payment_processing':
          toast.error('Error processing payment. Please try again later.');
          break;
        default:
          toast.error(`Error: ${error}`);
      }
    }
  }, [success, canceled, searchParams]);

  return null;
}