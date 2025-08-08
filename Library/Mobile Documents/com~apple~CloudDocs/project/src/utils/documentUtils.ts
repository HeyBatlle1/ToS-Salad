import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DocumentOptions {
  filename?: string;
  pageSize?: string;
  margin?: number | [number, number, number, number];
  includeHeader?: boolean;
  includeFooter?: boolean;
  companyName?: string;
  companyLogo?: string;
}

/**
 * Creates a professional PDF document from an HTML element
 */
export const generatePDF = async (
  element: HTMLElement,
  options: DocumentOptions = {}
): Promise<Blob> => {
  const {
    filename = 'safety-analysis.pdf',
    pageSize = 'a4',
    margin = [15, 15, 15, 15],
    includeHeader = true,
    includeFooter = true,
    companyName = 'Safety Companion',
    companyLogo = ''
  } = options;

  // Clone the element to avoid modifying the original
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // Create a container for the PDF content
  const container = document.createElement('div');
  container.style.padding = '20px';
  
  // Add professional header if requested
  if (includeHeader) {
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '20px';
    header.style.borderBottom = '2px solid #3B82F6';
    header.style.paddingBottom = '10px';
    
    // Logo side
    const logoDiv = document.createElement('div');
    if (companyLogo) {
      const logo = document.createElement('img');
      logo.src = companyLogo;
      logo.style.height = '50px';
      logoDiv.appendChild(logo);
    } else {
      // Create a text-based logo
      const logoText = document.createElement('div');
      logoText.style.fontWeight = 'bold';
      logoText.style.fontSize = '24px';
      logoText.style.color = '#3B82F6';
      logoText.textContent = companyName;
      logoDiv.appendChild(logoText);
    }
    header.appendChild(logoDiv);
    
    // Date and document type
    const infoDiv = document.createElement('div');
    infoDiv.style.textAlign = 'right';
    
    const docType = document.createElement('div');
    docType.textContent = 'SAFETY ANALYSIS REPORT';
    docType.style.fontWeight = 'bold';
    docType.style.fontSize = '16px';
    
    const date = document.createElement('div');
    date.textContent = new Date().toLocaleDateString();
    date.style.fontSize = '14px';
    
    infoDiv.appendChild(docType);
    infoDiv.appendChild(date);
    header.appendChild(infoDiv);
    
    container.appendChild(header);
  }
  
  // Add the main content
  container.appendChild(clonedElement);
  
  // Add professional footer if requested
  if (includeFooter) {
    const footer = document.createElement('div');
    footer.style.marginTop = '20px';
    footer.style.borderTop = '1px solid #CBD5E1';
    footer.style.paddingTop = '10px';
    footer.style.fontSize = '12px';
    footer.style.color = '#64748B';
    footer.style.display = 'flex';
    footer.style.justifyContent = 'space-between';
    
    const companyInfo = document.createElement('div');
    companyInfo.textContent = companyName;
    footer.appendChild(companyInfo);
    
    const pageInfo = document.createElement('div');
    pageInfo.textContent = `Generated on ${new Date().toLocaleDateString()} | Confidential`;
    footer.appendChild(pageInfo);
    
    container.appendChild(footer);
  }
  
  // Create PDF options
  const pdfOptions = {
    margin,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
  };
  
  // Generate PDF with proper styling for print
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    * {
      font-family: Arial, sans-serif;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #1E293B;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    p {
      margin-bottom: 1em;
      line-height: 1.5;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }
    th {
      background-color: #F1F5F9;
      text-align: left;
      padding: 8px;
      font-weight: bold;
      border: 1px solid #CBD5E1;
    }
    td {
      padding: 8px;
      border: 1px solid #CBD5E1;
    }
    ul, ol {
      padding-left: 1.5em;
      margin-bottom: 1em;
    }
    li {
      margin-bottom: 0.5em;
    }
  `;
  container.appendChild(styleElement);
  
  // Temporarily add to document to generate PDF
  document.body.appendChild(container);
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  
  // Generate PDF
  const pdfBlob = await html2pdf()
    .set(pdfOptions)
    .from(container)
    .outputPdf('blob');
  
  // Clean up
  document.body.removeChild(container);
  
  return pdfBlob;
};

/**
 * Opens the browser print dialog with proper formatting
 */
export const printDocument = (element: HTMLElement, title?: string): void => {
  // Create a printable version
  const printContent = document.createElement('div');
  printContent.innerHTML = `
    <style>
      @media print {
        @page {
          size: A4;
          margin: 1.5cm;
        }
        body {
          font-family: Arial, sans-serif;
          color: #000;
          background: #fff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #3B82F6;
          padding-bottom: 10px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #3B82F6;
        }
        .doc-info {
          text-align: right;
        }
        .doc-title {
          font-weight: bold;
          font-size: 16px;
        }
        .date {
          font-size: 14px;
        }
        .footer {
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid #CBD5E1;
          font-size: 12px;
          color: #64748B;
          display: flex;
          justify-content: space-between;
        }
        .section {
          margin-bottom: 15px;
        }
        h1, h2, h3 {
          color: #1E293B;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        p {
          margin-bottom: 0.5em;
          line-height: 1.5;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
        }
        th {
          background-color: #F1F5F9;
          text-align: left;
          padding: 8px;
          font-weight: bold;
          border: 1px solid #CBD5E1;
        }
        td {
          padding: 8px;
          border: 1px solid #CBD5E1;
        }
        ul, ol {
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        li {
          margin-bottom: 0.5em;
        }
        .no-print {
          display: none !important;
        }
      }
    </style>
  `;
  
  // Add header
  const header = document.createElement('div');
  header.className = 'header';
  
  const logoDiv = document.createElement('div');
  logoDiv.className = 'logo';
  logoDiv.textContent = 'Safety Companion';
  header.appendChild(logoDiv);
  
  const docInfo = document.createElement('div');
  docInfo.className = 'doc-info';
  
  const docTitle = document.createElement('div');
  docTitle.className = 'doc-title';
  docTitle.textContent = title || 'SAFETY ANALYSIS REPORT';
  docInfo.appendChild(docTitle);
  
  const date = document.createElement('div');
  date.className = 'date';
  date.textContent = new Date().toLocaleDateString();
  docInfo.appendChild(date);
  
  header.appendChild(docInfo);
  printContent.appendChild(header);
  
  // Clone the content
  const contentClone = element.cloneNode(true) as HTMLElement;
  printContent.appendChild(contentClone);
  
  // Add footer
  const footer = document.createElement('div');
  footer.className = 'footer';
  
  const companyInfo = document.createElement('div');
  companyInfo.textContent = 'Safety Companion';
  footer.appendChild(companyInfo);
  
  const pageInfo = document.createElement('div');
  pageInfo.textContent = `Generated on ${new Date().toLocaleDateString()} | Confidential`;
  footer.appendChild(pageInfo);
  
  printContent.appendChild(footer);
  
  // Create a print window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print this document');
    return;
  }
  
  // Set the document title for the print dialog
  printWindow.document.title = title || 'Safety Analysis Report';
  
  // Write the content
  printWindow.document.write('<!DOCTYPE html><html><head><title>' + 
    (title || 'Safety Analysis Report') + 
    '</title></head><body>' + 
    printContent.innerHTML + 
    '</body></html>');
  
  // Add script to automatically close window after print
  const script = printWindow.document.createElement('script');
  script.textContent = `
    window.onafterprint = function() { window.close(); };
    window.onload = function() { 
      setTimeout(() => { window.print(); }, 300);
    };
  `;
  printWindow.document.body.appendChild(script);
  
  printWindow.document.close();
};

/**
 * Creates a shareable format of the document
 */
export const createShareableContent = (
  element: HTMLElement, 
  title?: string
): { text: string; html: string } => {
  // Clone the element to work with
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Extract plain text content
  const plainText = `${title || 'SAFETY ANALYSIS REPORT'}\n\nDate: ${new Date().toLocaleDateString()}\n\n${clone.innerText}`;
  
  // Create HTML version with minimal styling
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #3B82F6; padding-bottom: 10px; margin-bottom: 20px;">
        <div style="font-weight: bold; font-size: 24px; color: #3B82F6;">Safety Companion</div>
        <div style="text-align: right;">
          <div style="font-weight: bold; font-size: 16px;">${title || 'SAFETY ANALYSIS REPORT'}</div>
          <div>${new Date().toLocaleDateString()}</div>
        </div>
      </div>
      ${clone.innerHTML}
      <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #CBD5E1; font-size: 12px; color: #64748B; display: flex; justify-content: space-between;">
        <div>Safety Companion</div>
        <div>Generated on ${new Date().toLocaleDateString()} | Confidential</div>
      </div>
    </div>
  `;
  
  return {
    text: plainText,
    html: htmlContent
  };
};

/**
 * Creates a file download
 */
export const downloadFile = (content: Blob | string, filename: string): void => {
  const a = document.createElement('a');
  
  if (typeof content === 'string') {
    a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
  } else {
    a.href = URL.createObjectURL(content);
  }
  
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  if (typeof content !== 'string') {
    URL.revokeObjectURL(a.href);
  }
};

/**
 * Helper to copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};