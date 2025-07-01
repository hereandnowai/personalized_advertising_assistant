
import jsPDF from 'jspdf';
import { StructuredResponse } from '../types';

// Helper to fetch image and convert to base64
const getImageBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText} from ${url}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching or converting image to base64:", error);
    return ""; // Return empty string or a placeholder if image fetch fails
  }
};

export const generateReportPdf = async (
  response: StructuredResponse,
  companyName: string,
  slogan: string,
  logoUrl: string
): Promise<void> => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 15; // Initial Y position
  const lineSpacing = 7;
  const sectionSpacing = 10;
  const textMaxWidth = pageWidth - 30; // 15 margin on each side

  // Brand Colors (approximations for PDF)
  const primaryColor = '#FFDF00'; // Yellow
  const secondaryColor = '#004040'; // Teal

  // 1. Add Logo and Header
  const logoBase64 = await getImageBase64(logoUrl);
  if (logoBase64) {
    try {
        const imgProps = doc.getImageProperties(logoBase64);
        const imgWidth = 30; // Desired width of logo
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        doc.addImage(logoBase64, 'PNG', 15, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 5;
    } catch (e) {
        console.error("Error adding logo to PDF: ", e);
        // Fallback: draw a placeholder or skip logo
         doc.setFontSize(10);
         doc.text("Logo could not be loaded.", 15, yPos + 5);
         yPos += 10;
    }
  } else {
    yPos += 10; // Space if no logo
  }


  doc.setFontSize(18);
  doc.setTextColor(secondaryColor); 
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, 15, yPos);
  yPos += lineSpacing;

  doc.setFontSize(10);
  doc.setTextColor(100); // Gray
  doc.setFont('helvetica', 'italic');
  doc.text(`"${slogan}"`, 15, yPos);
  yPos += sectionSpacing * 1.5;

  doc.setDrawColor(primaryColor); 
  doc.setLineWidth(0.5);
  doc.line(15, yPos -5, pageWidth - 15, yPos - 5);


  // Helper function to add a section
  const addSection = (title: string, content?: string) => {
    if (!content) return;
    if (yPos + sectionSpacing > pageHeight - 20) { // Check for page break
      doc.addPage();
      yPos = 15;
    }
    doc.setFontSize(14);
    doc.setTextColor(secondaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, yPos);
    yPos += lineSpacing;

    doc.setFontSize(10);
    doc.setTextColor(50); // Dark Gray
    doc.setFont('helvetica', 'normal');
    const splitContent = doc.splitTextToSize(content, textMaxWidth);
    doc.text(splitContent, 15, yPos);
    yPos += (splitContent.length * (lineSpacing * 0.7)) + sectionSpacing;
  };
  
  // 2. Add Report Sections
  addSection("Audience Insights", response.audienceInsights);
  addSection("Personalization Strategy", response.personalizationStrategy);
  addSection("Creative Suggestions", response.creativeSuggestions);
  addSection("Channel Recommendations", response.channelRecommendations);
  addSection("Success Metrics (KPIs)", response.successMetrics);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount} | ${companyName}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  // 3. Save PDF
  doc.save(`${companyName.replace(/\s+/g, '_')}_Advertising_Report.pdf`);
};
