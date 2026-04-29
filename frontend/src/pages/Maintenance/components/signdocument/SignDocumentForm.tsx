import { useState, useEffect } from "react";
import { generateBienBanKeHoachPdf } from "../../config";
import SharedSignDocumentForm from "../../../../components/SignDocument/SharedSignDocumentForm";

interface SignDocumentFormProps {
  selectedIds: string[];
  onCancel: () => void;
  onSign: (data: any[], assetHandover: any) => void;
  fullscreen?: boolean;
  showSignerSidebar?: boolean;
  plan: any;
  allUnits?: any[];
  staffs?: any[];
  departments?: any[];
  positions?: any[];
  document?: File | string | any;
  bangKe?: File | string | any;
  previewDocument?: boolean;
  isEdit?: boolean;
  title?: string;
  showHeader?: boolean;
}

export default function SignDocumentForm({
  selectedIds,
  onCancel,
  onSign,
  fullscreen = true,
  showSignerSidebar = true,
  plan,
  allUnits = [],
  staffs = [],
  departments = [],
  positions = [],
  document: documentUrl,
  bangKe,
  previewDocument = false,
  isEdit,
  title,
  showHeader = true,
}: SignDocumentFormProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [sourcePdfBytes, setSourcePdfBytes] = useState<Uint8Array | null>(null);

  useEffect(() => {
    const preparePdf = async () => {
      try {
        let finalBytes: Uint8Array | null = null;

        finalBytes = await generateBienBanKeHoachPdf(
          plan,
          allUnits,
          staffs || [],
          departments || [],
          positions || [],
        );

        if (finalBytes) {
          setSourcePdfBytes(finalBytes);
          const newBlob = new Blob([finalBytes.buffer as ArrayBuffer], {
            type: "application/pdf",
          });
          setPdfUrl(URL.createObjectURL(newBlob));
        }
      } catch (err) {
        console.error("Lỗi chuẩn bị PDF:", err);
      }
    };

    preparePdf();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [plan]);

  return (
    <SharedSignDocumentForm
      idTaiLieu={selectedIds[0]}
      pdfUrl={pdfUrl}
      onSign={async (data, pdfBlob) => {}}
      onCancel={onCancel}
      title={title}
      staffs={staffs || []}
      canUserSign={(type, currentSignatures) => true}
      fullscreen={fullscreen}
      showSignerSidebar={showSignerSidebar}
      sourcePdfBytes={sourcePdfBytes}
      showHeader={showHeader}
    />
  );
}
