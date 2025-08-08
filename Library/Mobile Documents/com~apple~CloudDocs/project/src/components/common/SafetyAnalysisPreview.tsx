import React, { forwardRef } from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, HardHat } from 'lucide-react';
import SafetyReportLayout from './SafetyReportLayout';

interface SafetyAnalysisPreviewProps {
  analysisText: string;
  title: string;
  date?: string;
  companyName?: string;
}

/**
 * A component to display a nicely formatted safety analysis for printing and PDF export
 */
const SafetyAnalysisPreview = forwardRef<HTMLDivElement, SafetyAnalysisPreviewProps>(
  ({ analysisText, title, date, companyName }, ref) => {
    // Process the analysis text to create a more structured document
    const processAnalysisText = (text: string): React.ReactNode => {
      try {
        // Check if the text is in JSON format and parse it
        const jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        
        if (jsonMatch) {
          try {
            const jsonData = JSON.parse(jsonMatch[1]);
            return renderStructuredAnalysis(jsonData);
          } catch (e) {
            console.error("Error parsing JSON analysis:", e);
            // Fall back to text formatting if JSON parsing fails
          }
        }
        
        // Format plain text with headings and sections
        return formatPlainTextAnalysis(text);
      } catch (error) {
        console.error('Error processing analysis text:', error);
        return <div className="whitespace-pre-wrap">{text}</div>;
      }
    };

    // Render a structured analysis when we have parsed JSON data
    const renderStructuredAnalysis = (data: any): React.ReactNode => {
      return (
        <div>
          {data.risks && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2">
                <ShieldCheck className="inline-block w-5 h-5 mr-2 text-blue-700" />
                Identified Risks
              </h2>
              <div className="space-y-4">
                {data.risks.map((risk: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-md text-gray-800 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                      {risk.hazard || risk.description}
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                        {risk.severity} {risk.probability && `/ ${risk.probability}`}
                      </span>
                    </h3>
                    {risk.impact && <p className="text-gray-700 mb-2">{risk.impact}</p>}
                    {risk.mitigation && (
                      <div className="mt-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Mitigation Measures:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          {risk.mitigation.map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.recommendations && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2">
                Recommendations
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {data.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </section>
          )}

          {data.requiredPPE && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2">
                <HardHat className="inline-block w-5 h-5 mr-2 text-blue-700" />
                Required PPE
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {data.requiredPPE.map((ppe: string, index: number) => (
                  <li key={index}>{ppe}</li>
                ))}
              </ul>
            </section>
          )}

          {data.emergencyProcedures && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2">
                Emergency Procedures
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {data.emergencyProcedures.map((proc: string, index: number) => (
                  <li key={index}>{proc}</li>
                ))}
              </ul>
            </section>
          )}

          {data.weatherConsiderations && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2">
                Weather Considerations
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {data.weatherConsiderations.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {data.summary && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2">
                Summary
              </h2>
              <p className="text-gray-700">{data.summary}</p>
            </section>
          )}
        </div>
      );
    };

    // Format plain text to better structured content
    const formatPlainTextAnalysis = (text: string): React.ReactNode => {
      // Split by double newlines to find paragraphs
      const paragraphs = text.split(/\n\n+/);
      
      return (
        <div>
          {paragraphs.map((paragraph, index) => {
            // Check if paragraph looks like a heading
            if (/^#{1,6}\s+/.test(paragraph) || 
                /^[A-Z][A-Z\s]+:/.test(paragraph) || 
                paragraph.length < 50 && paragraph.toUpperCase() === paragraph) {
              // It's likely a heading
              const cleanHeading = paragraph.replace(/^#{1,6}\s+/, '').replace(/:$/, '');
              return (
                <h2 key={index} className="text-xl font-bold text-blue-800 mt-6 mb-3 border-b border-blue-200 pb-2">
                  {cleanHeading}
                </h2>
              );
            }
            
            // Check if paragraph contains bullet points
            if (paragraph.includes('- ') || paragraph.includes('* ') || paragraph.includes('• ')) {
              const listItems = paragraph
                .split(/\n/)
                .filter(line => line.trim().match(/^[-*•]\s+/))
                .map(line => line.trim().replace(/^[-*•]\s+/, ''));
              
              if (listItems.length > 0) {
                return (
                  <ul key={index} className="list-disc pl-5 mb-4 text-gray-700">
                    {listItems.map((item, i) => (
                      <li key={i} className="mb-1">{item}</li>
                    ))}
                  </ul>
                );
              }
            }
            
            // Regular paragraph
            return (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            );
          })}
        </div>
      );
    };

    return (
      <div ref={ref} className="bg-white text-black">
        <SafetyReportLayout
          title={title}
          date={date}
          company={companyName}
        >
          <div className="prose max-w-none">
            <div className="flex items-center mb-6">
              <Sparkles className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-blue-700">AI Safety Analysis</h2>
            </div>
            
            {processAnalysisText(analysisText)}
          </div>
        </SafetyReportLayout>
      </div>
    );
  }
);

SafetyAnalysisPreview.displayName = 'SafetyAnalysisPreview';

export default SafetyAnalysisPreview;