import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface ReceiptData {
  id: string;
  type: "cotisation" | "don";
  donateur?: string;
  montant: number;
  date: Date;
  description?: string;
  email?: string;
  telephone?: string;
  notes?: string;
}

interface ReceiptGeneratorProps {
  data: ReceiptData;
  organizationName?: string;
  organizationEmail?: string;
  organizationAddress?: string;
}

export function ReceiptGenerator({
  data,
  organizationName = "Les Bâtisseurs Engagés",
  organizationEmail = "contact.lesbatisseursengages@gmail.com",
  organizationAddress = "N'djaména, Tchad",
}: ReceiptGeneratorProps) {
  const generatePDF = () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // En-tête
      pdf.setFontSize(20);
      pdf.setTextColor(59, 130, 246); // Bleu primaire
      pdf.text(organizationName, margin, yPosition);
      yPosition += 15;

      // Informations organisation
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Email: ${organizationEmail}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Adresse: ${organizationAddress}`, margin, yPosition);
      yPosition += 10;

      // Titre du reçu
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(
        data.type === "cotisation" ? "REÇU DE COTISATION" : "REÇU DE DON",
        margin,
        yPosition
      );
      yPosition += 15;

      // Numéro et date du reçu
      pdf.setFontSize(11);
      pdf.text(`Numéro de reçu: ${data.id}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Date: ${new Date(data.date).toLocaleDateString("fr-FR")}`, margin, yPosition);
      yPosition += 12;

      // Informations du donateur/cotisant
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Reçu de:", margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(11);
      if (data.donateur) {
        pdf.text(data.donateur, margin + 5, yPosition);
        yPosition += 6;
      }
      if (data.email) {
        pdf.text(`Email: ${data.email}`, margin + 5, yPosition);
        yPosition += 6;
      }
      if (data.telephone) {
        pdf.text(`Téléphone: ${data.telephone}`, margin + 5, yPosition);
        yPosition += 6;
      }
      yPosition += 6;

      // Détails du paiement
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Détails du paiement:", margin, yPosition);
      yPosition += 10;

      // Tableau des détails
      const tableData = [
        ["Description", "Montant"],
        [data.description || (data.type === "cotisation" ? "Cotisation annuelle" : "Don"), `${data.montant} FCFA`],
      ];

      pdf.setFontSize(10);
      let xPos = margin;
      let colWidth = (pageWidth - 2 * margin) / 2;

      // En-têtes du tableau
      pdf.setFillColor(59, 130, 246);
      pdf.setTextColor(255, 255, 255);
      pdf.rect(xPos, yPosition, colWidth, 8, "F");
      pdf.text("Description", xPos + 5, yPosition + 6);
      pdf.rect(xPos + colWidth, yPosition, colWidth, 8, "F");
      pdf.text("Montant", xPos + colWidth + 5, yPosition + 6);
      yPosition += 8;

      // Données du tableau
      pdf.setTextColor(0, 0, 0);
      pdf.rect(xPos, yPosition, colWidth, 8);
      pdf.text(tableData[1][0], xPos + 5, yPosition + 6);
      pdf.rect(xPos + colWidth, yPosition, colWidth, 8);
      pdf.text(tableData[1][1], xPos + colWidth + 5, yPosition + 6);
      yPosition += 12;

      // Total
      pdf.setFontSize(12);
      pdf.setTextColor(59, 130, 246);
      pdf.text("MONTANT TOTAL:", margin, yPosition);
      pdf.text(`${data.montant} FCFA`, pageWidth - margin - 40, yPosition);
      yPosition += 12;

      // Notes
      if (data.notes) {
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text("Notes:", margin, yPosition);
        yPosition += 6;
        const splitNotes = pdf.splitTextToSize(data.notes, pageWidth - 2 * margin);
        pdf.text(splitNotes, margin, yPosition);
        yPosition += splitNotes.length * 5 + 5;
      }

      // Pied de page
      yPosition = pageHeight - 30;
      pdf.setFontSize(9);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        "Ce reçu certifie que le montant indiqué a été reçu par l'association.",
        margin,
        yPosition
      );
      yPosition += 5;
      pdf.text(
        `Généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`,
        margin,
        yPosition
      );

      // Télécharger le PDF
      pdf.save(`recu-${data.id}-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Reçu PDF généré avec succès !");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du reçu");
    }
  };

  return (
    <Button
      onClick={generatePDF}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <FileText className="h-4 w-4" />
      Générer Reçu PDF
    </Button>
  );
}
