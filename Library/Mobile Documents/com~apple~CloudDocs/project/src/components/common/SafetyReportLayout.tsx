import React from 'react';
import { FileText, Calendar } from 'lucide-react';

interface SafetyReportLayoutProps {
  title: string;
  date?: string;
  company?: string;
  logo?: string;
  children: React.ReactNode;
}

/**
 * A professional layout component for safety reports, suitable for printing, PDF export, and sharing
 */
const SafetyReportLayout: React.FC<SafetyReportLayoutProps> = ({
  title,
  date = new Date().toLocaleDateString(),
  company = 'Safety Companion',
  logo,
  children
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 shadow-lg rounded-lg print:shadow-none print:p-0">
      {/* Report Header */}
      <header className="flex justify-between items-center border-b border-blue-500 pb-4 mb-6">
        <div className="flex items-center">
          {logo ? (
            <img src={logo} alt={company} className="h-12 mr-4" />
          ) : (
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-4">
              <FileText className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-blue-700">{company}</h1>
            <p className="text-sm text-gray-500">Safety Assessment Report</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="font-bold text-lg">{title}</h2>
          <div className="text-sm text-gray-500 flex items-center justify-end">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{date}</span>
          </div>
        </div>
      </header>
      
      {/* Report Content */}
      <div className="py-4">
        {children}
      </div>
      
      {/* Report Footer */}
      <footer className="mt-8 pt-4 border-t border-gray-300 text-sm text-gray-500 flex justify-between">
        <span>© {new Date().getFullYear()} {company}</span>
        <span>CONFIDENTIAL</span>
      </footer>
    </div>
  );
};

export default SafetyReportLayout;