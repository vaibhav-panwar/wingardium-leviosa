import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function FieldMappingComponent({
  outerBorderColor = "#EEEEEE",
  shadowBoxColor,
  matchPercentage,
  bgColor,
  textColor,
  borderColor,
  sourceField,
  sampleValues,
  targetField,
  availableFields = [],
  onChangeMapping = () => {},
  onRemoveMapping = () => {},
  mappedBy = {},
}: {
  outerBorderColor?: string;
  shadowBoxColor?: string;
  matchPercentage: number;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  sourceField: string;
  sampleValues: any[];
  targetField: string;
  availableFields?: string[];
  onChangeMapping?: (nextField: string) => void;
  onRemoveMapping?: () => void;
  mappedBy?: Record<string, string | undefined>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string>(targetField);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedField(targetField);
  }, [targetField]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(next: string) {
    setSelectedField(next);
    setIsOpen(false);
    onChangeMapping(next);
  }

  return (
    <div
      className={`w-full bg-[#FDFDFD] flex flex-col items-center justify-center ${
        matchPercentage < 60 ? " pb-[0px] px-[0px]" : " "
      } rounded-[16px] border-[1px]`}
      style={{
        borderColor: outerBorderColor,
        boxShadow: shadowBoxColor
          ? `0px 0px 24px 0px ${shadowBoxColor}`
          : undefined,
      }}
    >
      <div className="w-full flex items-start justify-between gap-[24px] px-[24px] py-[20px]">
        <div className="w-full flex flex-col items-start justify-between gap-[12px] gap-[12px]">
          <div className="flex items-center gap-[6px]">
            <p className="py-[4px] px-[8px] rounded-[8px] border-[1px] border-[#FFB7F4] bg-[#FBEBFF] font-[Geist_Variable] font-medium text-[12px] leading-[136%] tracking-[1px] text-[#920C7A]">
              DATABASE FIELD
            </p>
            <p
              className="px-3 py-1 border rounded-md text-sm font-semibold"
              style={{
                backgroundColor: bgColor,
                color: textColor,
                borderColor,
              }}
            >
              {matchPercentage}%
            </p>
          </div>
          <p className="font-[Geist_Variable] font-semibold text-[20px] leading-[100%] tracking-[0] text-[#0E4259]">
            {sourceField}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-600 text-sm">Sample</span>
            {sampleValues.map((value, index) => (
              <span
                key={index}
                className="rounded-[4px] gap-2 opacity-100 px-2 py-1 bg-[#F4F5F6] text-gray-600 text-sm"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
        <Image src="./linkBlue.svg" alt="link" width={32} height={32} />
        <div className="w-full flex flex-col items-start justify-between gap-[12px]">
          <div className="w-full flex items-center justify-between">
            <p className="py-[4px] px-[8px] rounded-[8px] border-[1px] border-[#AACCFF] bg-[#E7F5FB] font-[Geist_Variable] font-medium text-[12px] leading-[136%] tracking-[1px] text-[#0959D1]">
              CRM FIELD
            </p>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen((p) => !p)}
                className="text-[#6D657E] text-sm font-semibold border border-[#D8DDE4] rounded-md px-3 py-1 flex items-center gap-2 hover:bg-[#F8FAFB]"
              >
                {selectedField || "Select"}
                <span className="inline-block rotate-0">▾</span>
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-[320px] max-h-[320px] overflow-auto rounded-[12px] border border-[#E6E8EC] bg-white shadow-[0_8px_24px_rgba(16,24,40,0.12)] z-20">
                  <div className="p-2 border-b border-[#F0F2F5]">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onRemoveMapping();
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-[#FFF4F2] text-[#D74141] text-sm"
                    >
                      Don’t import this field
                    </button>
                  </div>
                  <div className="py-2">
                    <p className="px-3 pb-1 text-[12px] text-[#6B7280] font-medium">
                      Available Fields
                    </p>
                    <ul className="max-h-[220px] overflow-auto">
                      {(availableFields.length
                        ? availableFields
                        : [selectedField]
                      ).map((field) => (
                        <li key={field}>
                          <button
                            className={`w-full px-3 py-2 text-sm hover:bg-[#F4F6FA] flex items-center justify-between ${
                              selectedField === field
                                ? "text-[#0051CC] font-semibold"
                                : "text-[#0F172A]"
                            }`}
                            onClick={() => handleSelect(field)}
                          >
                            <span className="text-left">{field}</span>
                            <span className="ml-4 text-xs text-[#6B7280]">
                              {mappedBy[field] ? mappedBy[field] : ""}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="font-[Geist_Variable] font-semibold text-[20px] leading-[100%] tracking-[0] text-[#0051CC]">
            {selectedField}
          </p>
        </div>
      </div>
      {matchPercentage < 60 && (
        <div className="w-full flex items-center py-[8px] justify-center bg-[#FFF2EF] rounded-b-[16px]">
          <p className="font-[Geist_Variable] font-medium text-[14px] leading-[136%] tracking-[-0.41px] text-[#D74141] rounded-b-[16px]">
            Manual Review Recommended
          </p>
        </div>
      )}
    </div>
  );
}
