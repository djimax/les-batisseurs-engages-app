import { Button } from "@/components/ui/button";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface FinanceData {
  type: "cotisation" | "don" | "depense";
  description: string;
  montant: number;
  date: Date;
  statut?: string;
  categorie?: string;
  notes?: string;
}

interface FinanceExportProps {
  data: FinanceData[];
  fileName?: string;
}

export function FinanceExport({ data, fileName = "finances" }: FinanceExportProps) {
  const exportToExcel = () => {
    try {
      // Préparer les données
      const formattedData = data.map((item) => ({
        Type: item.type === "cotisation" ? "Cotisation" : item.type === "don" ? "Don" : "Dépense",
        Description: item.description,
        Montant: `${item.montant} FCFA`,
        Date: new Date(item.date).toLocaleDateString("fr-FR"),
        Statut: item.statut || "-",
        Catégorie: item.categorie || "-",
        Notes: item.notes || "-",
      }));

      // Créer un workbook
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Finances");

      // Ajouter des colonnes de largeur automatique
      const colWidths = [15, 25, 15, 15, 15, 15, 25];
      worksheet["!cols"] = colWidths.map((width) => ({ wch: width }));

      // Télécharger le fichier
      XLSX.writeFile(workbook, `${fileName}-${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("Fichier Excel exporté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'export Excel:", error);
      toast.error("Erreur lors de l'export Excel");
    }
  };

  const exportToCSV = () => {
    try {
      // Préparer les données
      const headers = ["Type", "Description", "Montant", "Date", "Statut", "Catégorie", "Notes"];
      const rows = data.map((item) => [
        item.type === "cotisation" ? "Cotisation" : item.type === "don" ? "Don" : "Dépense",
        item.description,
        `${item.montant} FCFA`,
        new Date(item.date).toLocaleDateString("fr-FR"),
        item.statut || "-",
        item.categorie || "-",
        item.notes || "-",
      ]);

      // Créer le contenu CSV
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Créer un blob et télécharger
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Fichier CSV exporté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
      toast.error("Erreur lors de l'export CSV");
    }
  };

  const exportToJSON = () => {
    try {
      const jsonData = data.map((item) => ({
        type: item.type,
        description: item.description,
        montant: item.montant,
        date: new Date(item.date).toISOString(),
        statut: item.statut,
        categorie: item.categorie,
        notes: item.notes,
      }));

      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}-${new Date().toISOString().split("T")[0]}.json`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Fichier JSON exporté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'export JSON:", error);
      toast.error("Erreur lors de l'export JSON");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={exportToExcel}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Exporter Excel
      </Button>
      <Button
        onClick={exportToCSV}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Exporter CSV
      </Button>
      <Button
        onClick={exportToJSON}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <FileJson className="h-4 w-4" />
        Exporter JSON
      </Button>
    </div>
  );
}
