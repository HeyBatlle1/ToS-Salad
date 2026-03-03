import { AlertTriangle, AlertCircle, Info } from 'lucide-react'

export const metadata = {
  title: 'Red Flag Detection — ToS Salad',
  description: 'What constitutes a red flag in Terms of Service documents, how we classify severity, and what each category means for your rights.',
}

const FLAGS = [
  {
    severity: 'high' as const,
    title: 'Forced Arbitration',
    description: 'Clauses that require you to settle disputes through private arbitration rather than the court system. This strips you of your right to sue, join class actions, or have disputes heard by a jury.',
    example: '"Any dispute...shall be resolved exclusively through binding arbitration...you waive the right to participate in a class action lawsuit."',
  },
  {
    severity: 'high' as const,
    title: 'Perpetual Content License',
    description: 'Rights to your photos, videos, text, or other content that survive account deletion and can be used commercially. You create it, they can profit from it forever.',
    example: '"You grant us a worldwide, non-exclusive, royalty-free, sublicensable license to use, reproduce, modify, and distribute your content."',
  },
  {
    severity: 'high' as const,
    title: 'Broad Data Sharing',
    description: 'Permission to share your personal data with third parties — often advertisers, partners, or affiliates — without specific consent for each sharing event.',
    example: '"We may share your information with our partners and affiliates for marketing, analytics, and business purposes."',
  },
  {
    severity: 'high' as const,
    title: 'Surveillance Permissions',
    description: 'Rights to monitor your activity, messages, device usage, or behavior beyond what is necessary to deliver the service.',
    example: '"We may collect information about your device, usage patterns, and interactions with our service and third-party services."',
  },
  {
    severity: 'medium' as const,
    title: 'Unilateral Term Changes',
    description: 'The company can change its terms at any time with minimal or no notice, and continued use of the service counts as acceptance.',
    example: '"We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the new terms."',
  },
  {
    severity: 'medium' as const,
    title: 'Liability Caps',
    description: 'Hard limits on what the company owes you if their negligence causes you harm — often capped at $100 or the amount you paid.',
    example: '"Our total liability shall not exceed the greater of $100 or the amounts you paid in the past twelve months."',
  },
  {
    severity: 'medium' as const,
    title: 'Account Termination at Will',
    description: 'Ability to terminate your account and delete your data without cause, notice, or recourse — sometimes without refund.',
    example: '"We may suspend or terminate your account at any time, for any reason, without notice or liability."',
  },
  {
    severity: 'medium' as const,
    title: 'Data Retention After Deletion',
    description: 'Your data is kept for extended periods after you close your account, often for undefined "business purposes."',
    example: '"We may retain certain information for up to 90 days after account deletion for legal and business purposes."',
  },
  {
    severity: 'low' as const,
    title: 'Vague Opt-Out Mechanisms',
    description: 'Data sharing or marketing opt-outs that are buried, difficult to use, or ineffective at actually stopping data use.',
    example: '"You may opt out of certain communications by following the unsubscribe instructions in our emails."',
  },
  {
    severity: 'low' as const,
    title: 'Broad Indemnification',
    description: 'Requirements that you cover the company\'s legal costs if your use of the service causes them to be sued — even for things outside your control.',
    example: '"You agree to indemnify and hold harmless [Company] from any claims arising from your use of the service."',
  },
]

const SEVERITY = {
  high:   { label: 'High', bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-800',    icon: AlertTriangle },
  medium: { label: 'Medium', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  low:    { label: 'Low',  bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-800', icon: Info },
}

export default function RedFlagsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-700" />
            </div>
            <span className="text-sm font-semibold text-red-700 uppercase tracking-wide">Red Flag Detection</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">What Counts as a Red Flag</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Not every clause that sounds scary is actually harmful. We classify red flags by their real-world
            impact on your rights, privacy, and ability to seek recourse.
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          {(['high', 'medium', 'low'] as const).map(s => {
            const { label, badge } = SEVERITY[s]
            const count = FLAGS.filter(f => f.severity === s).length
            return (
              <div key={s} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${badge}`}>
                <span className="text-sm font-bold">{label}</span>
                <span className="text-xs opacity-70">{count} types</span>
              </div>
            )
          })}
        </div>

        <div className="space-y-4">
          {FLAGS.map(flag => {
            const s = SEVERITY[flag.severity]
            const Icon = s.icon
            return (
              <div key={flag.title} className={`rounded-xl border-2 ${s.border} ${s.bg} p-5`}>
                <div className="flex items-start gap-3">
                  <Icon size={18} className={flag.severity === 'high' ? 'text-red-600' : flag.severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900">{flag.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.badge}`}>{s.label}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{flag.description}</p>
                    <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Typical wording</p>
                      <p className="text-xs italic text-gray-700">{flag.example}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-600">
          <strong className="text-gray-900">Note:</strong> The presence of a red flag doesn't automatically make a service illegal or unusable.
          It means you should be aware of that clause and decide if it's acceptable given how you plan to use the service.
          Our goal is to make sure that decision is informed — not to make it for you.
        </div>
      </div>
    </div>
  )
}
