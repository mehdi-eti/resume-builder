// This utility relies on html2canvas and jspdf loaded from CDN in index.html
declare const html2canvas: any;
// Declare jspdf as a global constant, consistent with how html2canvas is used.
declare const jspdf: any;


export const exportToPdf = async (elementId: string, fileName: string): Promise<void> => {
    const input = document.getElementById(elementId);
    if (!input) {
        console.error(`Element with id ${elementId} not found.`);
        return;
    }

    // A4 paper dimensions in mm: 210 x 297
    const a4Width = 210;
    const a4Height = 297;

    try {
        // Defensive check in case the script fails to load for any reason
        if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
            alert('The PDF generation library could not be loaded. Please check your network connection or ad-blocker and try again.');
            console.error("Error generating PDF: jspdf library not found.");
            return;
        }

        const canvas = await html2canvas(input, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = a4Width;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Access the jsPDF class from the global jspdf object.
        const { jsPDF } = jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= a4Height;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= a4Height;
        }

        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};
