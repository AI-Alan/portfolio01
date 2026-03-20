import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  )
}
