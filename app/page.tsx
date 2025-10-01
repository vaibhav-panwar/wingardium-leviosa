"use client";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { signOut } from "@/firebase/auth";
import { ProtectedRoute } from "@/components/protectedRoutes";
import React, { useEffect, useRef, useState } from "react";
import { parseCsv, type ParsedCsvColumns } from "@/utils/parseCsv";
import CsvMapper from "../components/csvMapper";
import { getDocuments } from "@/firebase/firestore";

export default function Home() {
  const hiddenFileInput: any = useRef(null);
  const [isCsvUploaded, setIsCsvUploaded] = useState<boolean>(false);
  const [contacts, setContacts] = useState<any>([]);
  const [isContactsLoading, setIsContactsLoading] = useState<boolean>(false);
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
  useEffect(() => {
    let cancelled = false;
    const getContactsData = async (): Promise<void> => {
      setIsContactsLoading(true);
      try {
        const data = await getDocuments(
          "company/A5eWer5YT4GtsAClx90o/contacts"
        );
        if (!cancelled) {
          setContacts(data);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(`Failed to fetch contacts: ${message}`);
        }
      } finally {
        if (!cancelled) {
          setIsContactsLoading(false);
        }
      }
    };
    if (!isCsvUploaded) {
      getContactsData();
    }
    return () => {
      cancelled = true;
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
        <div className={isCsvUploaded ? "blur-sm pointer-events-none" : ""}>
          <div className="header w-full flex item-center justify-between bg-black py-[14px] px-[80px]">
            <h1 className="text-white font-[Geist Variable] text-[28px]">
              Kendal
            </h1>
            <div className="flex items-cent justify-center gap-[28px]">
              <button
                className="bg-white text-black py-[8px] px-[8px] text-[18px] rounded-[8px]"
                onClick={handleSignout}
              >
                Sign out
              </button>
              <div
                className="flex items-center justify-center cursor-pointer bg-white rounded-[12px] px-[8px] "
                onClick={handleInputBtnClick}
              >
                <p className="text-black">Upload File</p>
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
          </div>
        </div>

        {/* Contacts Table */}
        {!isCsvUploaded && (
          <div className="px-[80px] py-6">
            {isContactsLoading ? (
              <p className="text-gray-600">Loading contacts…</p>
            ) : contacts?.length === 0 ? (
              <p className="text-gray-600">No contacts found.</p>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        First Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agent Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((c: any, idx: number) => (
                      <tr key={c.id || idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {c?.firstName || ""}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {c?.lastName || ""}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {c?.phoneNo || ""}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {c?.email || ""}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {c?.agentEmail || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CsvMapper overlay */}
        {isCsvUploaded && (
          <div className="absolute top-[46px] bottom-[46px] left-[240px] right-[240px] h-fit w-fit flex items-center justify-center z-50">
            <CsvMapper
              handleCloseModal={() => {
                setIsCsvUploaded(false);
                setUploadedFileBuffer(null);
                // Reset the file input to allow re-uploading the same file
                if (hiddenFileInput.current) {
                  hiddenFileInput.current.value = "";
                }
              }}
              fileBuffer={uploadedFileBuffer}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
