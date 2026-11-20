'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

export default function StorefrontChrome({ children, categoryMenu }: { children: React.ReactNode; categoryMenu: React.ReactNode }) {
  const admin = usePathname().startsWith('/admin')
  if (admin) return <>{children}</>
  return <><Navbar categoryMenuSlot={categoryMenu} /><main>{children}</main><Footer /><WhatsAppButton /></>
}
