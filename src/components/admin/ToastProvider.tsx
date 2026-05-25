'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: '2px',
          fontSize: '13px',
        },
        success: {
          style: { background: '#14532d', color: '#fff' },
          iconTheme: { primary: '#86efac', secondary: '#14532d' },
        },
        error: {
          style: { background: '#7f1d1d', color: '#fff' },
          iconTheme: { primary: '#fca5a5', secondary: '#7f1d1d' },
        },
      }}
    />
  )
}
