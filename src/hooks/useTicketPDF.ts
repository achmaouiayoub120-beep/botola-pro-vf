import { useCallback } from "react";
import jsPDF from "jspdf";

interface TicketData {
    ticketId: string;
    homeName: string;
    awayName: string;
    homeShort: string;
    awayShort: string;
    stadiumName: string;
    stadiumCity: string;
    date: string;
    time: string;
    zone: string;
    quantity: number;
    totalPrice: number;
}

export function useTicketPDF() {
    const generatePDF = useCallback((data: TicketData) => {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });

        const w = doc.internal.pageSize.getWidth();
        const centerX = w / 2;

        // Background
        doc.setFillColor(244, 246, 249);
        doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), "F");

        // Header bar
        doc.setFillColor(0, 166, 81);
        doc.rect(0, 0, w, 25, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("BOTOLA TICKET", centerX, 16, { align: "center" });

        // Match info
        doc.setTextColor(26, 26, 26);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(`${data.homeShort}  VS  ${data.awayShort}`, centerX, 42, { align: "center" });

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(107, 114, 128);
        doc.text(data.homeName, centerX, 50, { align: "center" });
        doc.text("vs", centerX, 56, { align: "center" });
        doc.text(data.awayName, centerX, 62, { align: "center" });

        // Separator
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.3);
        doc.line(20, 70, w - 20, 70);

        // Details
        doc.setTextColor(26, 26, 26);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const details = [
            { label: "📅 Date", value: data.date },
            { label: "🕐 Heure", value: data.time },
            { label: "🏟️ Stade", value: `${data.stadiumName}, ${data.stadiumCity}` },
            { label: "🎫 Zone", value: data.zone },
            { label: "📝 Quantité", value: `${data.quantity} billet(s)` },
            { label: "💰 Total", value: `${data.totalPrice} MAD` },
        ];

        let yPos = 80;
        details.forEach(({ label, value }) => {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(107, 114, 128);
            doc.text(label, 20, yPos);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(26, 26, 26);
            doc.text(value, w - 20, yPos, { align: "right" });
            yPos += 9;
        });

        // Separator
        doc.line(20, yPos + 2, w - 20, yPos + 2);

        // Ticket ID
        yPos += 14;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(107, 114, 128);
        doc.text("N° Billet", centerX, yPos, { align: "center" });
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 166, 81);
        doc.text(data.ticketId, centerX, yPos + 8, { align: "center" });

        // QR code placeholder text
        yPos += 20;
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.setFont("helvetica", "normal");
        doc.text("Scan QR code à l'entrée du stade", centerX, yPos, { align: "center" });

        // Footer
        const footerY = doc.internal.pageSize.getHeight() - 12;
        doc.setFontSize(7);
        doc.setTextColor(107, 114, 128);
        doc.text("Billet vérifié · Non remboursable · Botola Pro Inwi 2025-2026", centerX, footerY, { align: "center" });
        doc.text("© 2026 Botola Ticket. Tous droits réservés.", centerX, footerY + 4, { align: "center" });

        // Save
        doc.save(`botola-ticket-${data.ticketId}.pdf`);
    }, []);

    return { generatePDF };
}
