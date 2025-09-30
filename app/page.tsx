"use client";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { signOut } from "@/firebase/auth";
import { ProtectedRoute } from "@/components/protectedRoutes";
import { useEffect, useRef, useState } from "react";
import { parseCsv, type ParsedCsvColumns } from "@/utils/parseCsv";
import CsvMapper from "../components/csvMapper";

export default function Home() {
  const hiddenFileInput: any = useRef(null);
  const [isCsvUploaded, setIsCsvUploaded] = useState<boolean>(false);
  const [csvData, setCsvData] = useState<ParsedCsvColumns | null>(null);
  const [uploadedFileBuffer, setUploadedFileBuffer] =
    useState<ArrayBuffer | null>(null);
  useEffect(() => {
    if (isCsvUploaded) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isCsvUploaded]);
  const handleInputBtnClick = () => {
    hiddenFileInput?.current?.click();
  };
  const handleInputChange = async (event: any): Promise<void> => {
    const fileUploaded = event.target.files && event.target.files[0];
    if (!fileUploaded) return;
    const isCsv =
      fileUploaded.type === "text/csv" ||
      fileUploaded.name?.toLowerCase().endsWith(".csv");
    if (!isCsv) {
      alert("Please upload a CSV file (.csv)");
      event.target.value = "";
      setIsCsvUploaded(false);
      return;
    }
    const buffer = await fileUploaded.arrayBuffer();
    setUploadedFileBuffer(buffer);
    setIsCsvUploaded(true);
    // handleCsvUpload(fileUploaded);
  };
  const router = useRouter();
  const handleSignout = async (): Promise<void> => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      alert(error);
    }
  };
  return (
    <ProtectedRoute>
      <div className="relative">
        {/* Main content */}
        <div className={isCsvUploaded ? "blur-sm pointer-events-none" : ""}>
          <button className="bg-black text-white" onClick={handleSignout}>
            sign out
          </button>
          <h1>Hello World</h1>
          <div onClick={handleInputBtnClick}>
            <p>Please Upload File</p>
            <input
              type="file"
              data-testid="file-input"
              className="hidden"
              accept=".csv,text/csv"
              onChange={handleInputChange}
              ref={hiddenFileInput}
            />
          </div>
        </div>

        {/* CsvMapper overlay */}
        {isCsvUploaded && (
          <div className="absolute top-[46px] bottom-[46px] left-[240px] right-[240px] h-fit w-fit flex items-center justify-center z-50">
            <CsvMapper
              handleCloseModal={() => setIsCsvUploaded(false)}
              fileBuffer={uploadedFileBuffer}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
