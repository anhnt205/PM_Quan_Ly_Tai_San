import { useState, useEffect } from "react";
import { ToolHandoverData, SignaturesData } from "../types";
import { canUserSign, generateBienBanPdf } from "../config";
import S3Service from "../../../services/S3Service";
import SharedSignDocumentForm from "../../../components/SignDocument/SharedSignDocumentForm";

interface SignDocumentFormProps {
  selectedIds: string[];
  onCancel: () => void;
  onSign: (data: SignaturesData[], toolHandover: ToolHandoverData) => void;
  fullscreen?: boolean;
  showSignerSidebar?: boolean;
  toolHandover: ToolHandoverData;
  allUnits?: any[];
  staffs?: any[];
  departments?: any[];
  positions?: any[];
  document?: File | string | any;
  bangKe?: File | string | any;
  previewDocument?: boolean;
  isEdit?: boolean;
  title?: string;
}

export default function SignDocumentForm({
  selectedIds,
  onCancel,
  onSign,
  fullscreen = true,
  showSignerSidebar = true,
  toolHandover,
  allUnits = [],
  staffs = [],
  departments = [],
  positions = [],
  document: documentUrl,
  bangKe,
  previewDocument = false,
  isEdit,
  title,
}: SignDocumentFormProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [sourcePdfBytes, setSourcePdfBytes] = useState<Uint8Array | null>(null);

  useEffect(() => {
    const preparePdf = async () => {
      try {
        let finalBytes: Uint8Array | null = null;

        if (previewDocument) {
          if (documentUrl instanceof File || documentUrl instanceof Blob) {
            const buffer = await documentUrl.arrayBuffer();
            finalBytes = new Uint8Array(buffer);
          } else if (typeof documentUrl === "string" && documentUrl !== "") {
            const blob = await S3Service.preview(documentUrl);
            finalBytes = new Uint8Array(await blob.arrayBuffer());
          }
        } else {
          if (!isEdit) {
            if (bangKe && typeof bangKe === "string") {
              const blob = await S3Service.preview(bangKe);
              finalBytes = new Uint8Array(await blob.arrayBuffer());
            }
          } else {
            finalBytes = await generateBienBanPdf(
              toolHandover,
              allUnits,
              staffs || [],
              departments || [],
              positions || [],
            );
          }
        }

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
  }, [documentUrl, previewDocument, isEdit, toolHandover, bangKe]);

  const handleSignComplete = async (newSignatures: SignaturesData[], pdfBlob: Blob) => {
    await onSign(newSignatures, toolHandover);
    await S3Service.updatePresignedPutUrl(bangKe, pdfBlob);
    onCancel();
  };

  return (
    <SharedSignDocumentForm
      idTaiLieu={selectedIds[0]}
      pdfUrl={pdfUrl}
      onSign={handleSignComplete}
      onCancel={onCancel}
      title={title}
      staffs={staffs || []}
      canUserSign={canUserSign}
      fullscreen={fullscreen}
      showSignerSidebar={showSignerSidebar}
      sourcePdfBytes={sourcePdfBytes}
    />
  );
}
