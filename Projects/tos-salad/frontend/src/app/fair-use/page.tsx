import { Scale, FileText, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Fair Use Policy — ToS Salad',
  description: 'How ToS Salad operates under Fair Use doctrine to provide educational commentary on Terms of Service documents.',
}

export default function FairUsePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Scale className="h-5 w-5 text-blue-700" />
            </div>
            <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Legal Framework</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Fair Use Policy</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            ToS Salad operates under the Fair Use doctrine of United States copyright law (17 U.S.C. § 107),
            which explicitly protects educational commentary on published works.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">The Four Fair Use Factors</h2>
            </div>
            <p className="text-gray-700 mb-4">Courts evaluate fair use based on four factors. Our use satisfies all four:</p>
            <div className="space-y-3">
              {[
                ['Purpose and Character', 'Our use is non-commercial and transformative. We add significant new meaning — educational analysis — to the original text. We are not a competing service.'],
                ['Nature of the Work', 'Terms of Service are functional legal documents, not creative works. Courts afford them less copyright protection than original creative expression.'],
                ['Amount Used', 'We quote only the specific clauses relevant to our commentary — never entire documents. Each quote is the minimum necessary to support our educational point.'],
                ['Market Effect', 'Our analysis cannot substitute for the original Terms of Service. We do not compete with any company\'s service or reduce demand for their product.'],
              ].map(([factor, analysis], i) => (
                <div key={factor} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-700 font-bold text-sm mt-0.5">{i + 1}.</span>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{factor}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{analysis}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">What We Do and Don't Do</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle size={16} /> We Do
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Quote specific clauses with attribution</li>
                  <li>• Provide educational plain-English commentary</li>
                  <li>• Link back to original documents</li>
                  <li>• Identify the source section of each quote</li>
                  <li>• Offer critical analysis for consumer education</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-bold text-red-800 mb-3">We Don't</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Republish full ToS documents</li>
                  <li>• Accept payment to analyze or remove companies</li>
                  <li>• Provide legal advice or legal representation</li>
                  <li>• Make claims of fact beyond what the document states</li>
                  <li>• Store or process user content from analyzed services</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Company Takedown Requests</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are a company represented in our database and believe our analysis is factually incorrect,
              we welcome factual corrections. We will review and update our analysis if a specific quote is
              misattributed or our explanation is factually wrong.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We do not remove accurate, factual analysis of publicly published Terms of Service based on
              legal threats or takedown requests. Our educational commentary is protected speech.
              Contact us at <a href="mailto:legal@tossalad.com" className="text-blue-600 hover:underline">legal@tossalad.com</a> for
              factual correction requests.
            </p>
          </section>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-600">
            This Fair Use Policy was last reviewed March 2026. We are not a law firm and this document
            does not constitute legal advice. It describes our good-faith understanding of how our
            educational activities qualify for Fair Use protection.
          </div>
        </div>
      </div>
    </div>
  )
}
