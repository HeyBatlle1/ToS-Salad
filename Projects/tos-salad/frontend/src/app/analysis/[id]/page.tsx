import { notFound } from 'next/navigation'
import { UserAnalysisResult } from '@/components/analyze/UserAnalysisResult'
import Link from 'next/link'
import { ArrowLeft, PlusCircle } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tossalad.netlify.app'
    const res = await fetch(`${baseUrl}/api/analyze/${id}`, { cache: 'no-store' })
    if (res.ok) {
      const { analysis } = await res.json()
      return {
        title: `${analysis.company_name} ToS Analysis — ToS Salad`,
        description: analysis.summary?.slice(0, 160) ?? 'Community Terms of Service analysis',
      }
    }
  } catch {}
  return { title: 'Analysis — ToS Salad' }
}

export default async function AnalysisPage({ params }: Props) {
  const { id } = await params

  // UUID format check
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID_RE.test(id)) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tossalad.netlify.app'
  let analysis
  try {
    const res = await fetch(`${baseUrl}/api/analyze/${id}`, { cache: 'no-store' })
    if (!res.ok) notFound()
    const data = await res.json()
    analysis = data.analysis
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back nav */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/companies"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            All Companies
          </Link>
          <Link
            href="/analyze"
            className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800 font-semibold transition-colors"
          >
            <PlusCircle size={16} />
            Analyze another
          </Link>
        </div>

        <UserAnalysisResult analysis={analysis} />
      </div>
    </div>
  )
}
