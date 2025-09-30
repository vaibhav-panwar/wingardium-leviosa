import { useEffect, useState } from "react";
import { SmartLoader } from "./loader";
import Image from "next/image";
import { mapCsvHeadersAI } from "@/utils/mapCsvHeaders";
import { parseCsv, type ParsedCsvColumns } from "@/utils/parseCsv";

type StepBoxProps = {
  step: number;
  title: string;
  subtitle: string;
  active: boolean;
  completed: boolean;
};

const StepBox = ({
  step,
  title,
  subtitle,
  active,
  completed,
}: StepBoxProps) => {
  return (
    <div className="flex justify-between items-center gap-[11.51px]">
      <div>
        {completed ? (
          <Image src="/rightTick.svg" alt="completed" width={42} height={42} />
        ) : (
          <div
            className={
              active
                ? "flex w-[42px] h-[42px] rounded-[8px] bg-[#0E4259] flex items-center justify-center font-[Geist Variable] font-medium text-[20px] leading-[100%] tracking-[0%] text-[#FFFFFF]"
                : "flex w-[42px] h-[42px] rounded-[8px] bg-[#EBF0F8] flex items-center justify-center font-[Geist Variable] font-medium text-[20px] leading-[100%] tracking-[0%] text-[#8C8DB0]"
            }
          >
            {step}
          </div>
        )}
      </div>
      <div className="cont-box flex flex-col justify-between h-[42px] items-start">
        <p className="font-[Geist Variable] font-medium text-[18px] text-[#0C5271] leading-[100%] tracking-[0]">
          {title}
        </p>
        <p className="font-[Geist Variable] font-normal text-[15px] text-[#89A6B2] leading-[120%] tracking-[0%]">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

const FieldMapping = ({
  sourceField,
  targetField,
  matchPercentage,
  sampleValues,
  textColor,
  bgColor,
  borderColor,
}: UIMapping) => {
  console.log(textColor, bgColor, borderColor);
  return (
    <div
      className={`w-full bg-white border-gray-200 border rounded-xl p-6 shadow-sm`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`bg-[${bgColor}] text-[${textColor}] px-3 py-1 border-[1px] border-[${borderColor}] rounded-md text-sm font-semibold`}
        >
          {matchPercentage}%
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-mono text-base">
            {sourceField}
          </span>

          <Image src="./linkBlue.svg" alt="" width={24} height={24} />

          <span className="text-blue-500 font-medium text-base">
            {targetField}
          </span>
        </div>
      </div>
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
  );
};

const RenderingStep1 = ({
  aiLoading = false,
  noOfColumns = 0,
}: {
  aiLoading?: boolean;
  noOfColumns?: number;
}) => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col p-[24px] w-full gap-[8px] items-start content-between">
        <p className="font-[Geist Variable] font-semibold text-[18px] leading-[100%] tracking-[0%] text-[#0E4259]">
          AI Column Detection...
        </p>
        <p className="font-[Geist Variable] font-normal text-[16px] leading-[120%] tracking-[0%] text-[#68818C]">
          Analyzing {noOfColumns} columns and matching with CRM fields using
          AI...
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <Image
          src="./step1Loading.svg"
          alt="loading"
          width={480}
          height={178}
          className="mb-[24px]"
        />
        <div className="w-full flex flex-col items-center justify-center gap-[16px]">
          <p className="font-[Geist Variable] font-medium text-[20px] leading-[100%] tracking-[-1%] text-center text-[#5883C9]">
            Auto Detecting Field Mapping...
          </p>
          <p className="font-[Geist Variable] font-normal text-[16px] leading-[150%] tracking-[-0.15px] text-center align-middle text-[#7782AD]">
            Matching spreasheets columns to CRM fields using intelligent pattern
            recognition...
          </p>
          <div className="w-full px-[200px]">
            <SmartLoader isLoading={aiLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

type UIMapping = {
  sourceField: string;
  targetField: string;
  matchPercentage: number;
  sampleValues: string[];
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
};

const RenderingStep2 = ({
  mappings,
  fieldsDetected = 0,
  highConfidenceFields = 0,
  customFields = 0,
}: {
  mappings: UIMapping[];
  fieldsDetected: number;
  highConfidenceFields: number;
  customFields: number;
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col items-start justify-center upper-box p-[24px] pb-[12px] gap-[20px] flex-shrink-0">
        <div className="flex flex-col items-start justify-center gap-[8px]">
          <p className="font-[Geist Variable] font-semibold text-[18px] leading-[100%] tracking-[0%] text-[#0E4259]">
            Column Detection Results
          </p>
          <p className="font-[Geist Variable] font-normal text-[17px] leading-[120%] tracking-[0%] text-[#68818C]">
            Our intelligent mapping has mapped 19 fields in this entry with the
            CRM Contact Fields
          </p>
        </div>
        <div className="w-full flex items-center content-between gap-[15px]">
          <div className="bg-[#E7FFEA] border-[#0000000D] flex rounded-[12px] items-center justify-center w-full h-[48px] border-2 gap-2 opacity-100 pt-[12px] pr-[32px] pb-[12px] pl-[24px]">
            <Image src="./searchLogo.svg" alt="" width={24} height={24} />
            <p className="font-[Geist Variable] font-medium text-[18px] leading-[100%] tracking-[0%] text-[#087025]">
              {fieldsDetected} Fields Detected
            </p>
          </div>
          <div className="bg-[#F6F6FF] border-[#0000000D] flex rounded-[12px] items-center justify-center w-full h-[48px] border-2 gap-2 opacity-100 pt-[12px] pr-[32px] pb-[12px] pl-[24px]">
            <Image
              src="./highConfidenceLogo.svg"
              alt=""
              width={24}
              height={24}
            />
            <p className="font-[Geist Variable] font-medium text-[18px] leading-[100%] tracking-[0%] text-[#5740DF]">
              {highConfidenceFields} High Confidence
            </p>
          </div>
          <div className="bg-[#FFF1FC] border-[#0000000D] flex rounded-[12px] items-center justify-center w-full h-[48px] border-2 gap-2 opacity-100 pt-[12px] pr-[32px] pb-[12px] pl-[24px]">
            <Image src="./customFieldLogo.svg" alt="" width={24} height={24} />
            <p className="font-[Geist Variable] font-medium text-[18px] leading-[100%] tracking-[0%] text-[#B71897]">
              {customFields} Custom Fields
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex-1 min-h-0 flex flex-col items-start justify-start gap-[16px] pt-[12px] px-[24px] pb-[24px] overflow-y-auto">
        {mappings.map((mapping, index) => (
          <FieldMapping key={index} {...mapping} />
        ))}
      </div>
    </div>
  );
};

const RenderingStep3 = ({}) => {
  return (
    <div className="w-full h-full">
      <div className="upper-bo flex flex-col items-start justify-center w-full p-[24px] pb-[12px] gap-[16px]">
        <p className="font-[Geist Variable] font-semibold text-[18px] leading-[100%] tracking-[0%] text-[#0E4259]">
          Smart Field Mapping
        </p>
        <p className="font-[Geist Variable] font-normal text-[17px] leading-[150%] tracking-[0%] text-[#68818C]">
          Review and adjust the AI-powered field mappings below. Click "Edit"
          next to any mapping to change it. You can map to existing CRM fields
          or create custom fields with different data types.
        </p>
      </div>
    </div>
  );
};

export default function CsvMapper({
  handleCloseModal,
  fileBuffer,
}: {
  handleCloseModal: () => void;
  fileBuffer?: ArrayBuffer | null;
}) {
  const [headerCurrentStep, setHeaderCurrentStep] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [numberOfColumns, setNumberOfColumns] = useState<number>(0);
  const [parsedCsv, setParsedCsv] = useState<ParsedCsvColumns | null>(null);
  const [aiMappings, setAiMappings] = useState<any[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [highConfidenceMappings, setHighConfidenceMappings] =
    useState<number>(0);
  const [mediumConfidenceMappings, setMediumConfidenceMappings] =
    useState<number>(0);
  const [lowConfidenceMappings, setLowConfidenceMappings] = useState<number>(0);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileBuffer) {
      setParsedCsv(null);
      return;
    }
    try {
      const text = new TextDecoder("utf-8").decode(new Uint8Array(fileBuffer));
      const parsed = parseCsv(text);
      setParsedCsv(parsed);
      setNumberOfColumns(Object.keys(parsed).length);
      console.log(parseCsv);
      console.log("CsvMapper parsed CSV:", parsed);
    } catch (err) {
      console.error("Failed to parse CSV in modal:", err);
      setParsedCsv(null);
    }
  }, [fileBuffer]);

  useEffect(() => {
    const runAI = async () => {
      if (!parsedCsv) return;
      try {
        setAiError(null);
        setAiLoading(true);
        const mappings = await mapCsvHeadersAI(parsedCsv);
        let above90Mappings = 0;
        let above60Mappings = 0;
        let below60Mappings = 0;
        mappings.forEach((mapping: UIMapping) => {
          if (mapping.matchPercentage >= 90) {
            above90Mappings++;
            mapping.textColor = "#008D0E";
            mapping.bgColor = "#E8FFE6";
            mapping.borderColor = "#B0F0C2";
          } else if (
            mapping.matchPercentage < 90 &&
            mapping.matchPercentage >= 60
          ) {
            above60Mappings++;
            mapping.textColor = "#8C5E04";
            mapping.bgColor = "#FFF8DD";
            mapping.borderColor = "#F6CD7E";
          } else {
            below60Mappings++;
            mapping.textColor = "#555555";
            mapping.bgColor = "#F2F2F2";
            mapping.borderColor = "#BDBDBD";
          }
        });
        console.log("xxxxxxxx",mappings);
        setHighConfidenceMappings(above90Mappings);
        setMediumConfidenceMappings(above60Mappings);
        setLowConfidenceMappings(below60Mappings);
        setAiMappings(mappings);
      } catch (err) {
        setAiError("Failed to get AI mappings");
        setAiMappings(null);
      } finally {
        setAiLoading(false);
      }
    };
    runAI();
  }, [parsedCsv]);

  // When AI mappings are ready, move to step 2
  useEffect(() => {
    if (!aiLoading && aiMappings && aiMappings.length > 0) {
      setHeaderCurrentStep(2);
      setCurrentStep(2);
    }
  }, [aiLoading, aiMappings]);

  let steps = [
    {
      number: 1,
      title: "Detect Fields",
      subtitle: "Review data structure",
      active: headerCurrentStep === 1,
      completed: headerCurrentStep > 1,
    },
    {
      number: 2,
      title: "Map Fields",
      subtitle: "Connect to CRM Fields",
      active: headerCurrentStep === 2,
      completed: headerCurrentStep > 2,
    },
    {
      number: 3,
      title: "Final Checks",
      subtitle: "For Duplicates or Errors",
      active: headerCurrentStep === 3,
      completed: headerCurrentStep > 3,
    },
  ];

  return (
    <div className="w-[1032px] flex items-start p-[1px] shadow-2xl rounded-xl bg-white animate-[zoomIn_0.2s_ease-out_forwards]">
      <div className="relative w-full flex flex-col items-start border border-gray-200 rounded-[12px]">
        {/* const header begins */}
        <div className="header w-full flex justify-between items-center p-[16px] border-b border-gray-200">
          <div className="left-box flex justify-between items-center gap-[11.51px]">
            <Image
              src="/modalHeaderImg.svg"
              alt="Logo"
              width={48}
              height={48}
            />
            <div className="cont-box flex flex-col justify-between h-[48px] items-start">
              <p className="font-[Geist Variable] font-medium text-[18px] text-[#0C5271] leading-[100%] tracking-[0]">
                Move Entry to Contact Section
              </p>
              <p className="font-[Geist Variable] font-normal text-[15px] text-[#89A6B2] leading-[120%] tracking-[0%]">
                Step {currentStep} of 4
              </p>
            </div>
          </div>
          <button className="right-box" onClick={handleCloseModal}>
            <Image
              src="/minimiseButton.svg"
              alt="close"
              width={32}
              height={32}
            />
          </button>
        </div>
        {/* const header ends */}
        {/* step box begins */}
        <div className="header w-full flex justify-between items-center py-[20px] px-[24px] border-b border-gray-200">
          {steps.map((step, idx) => (
            <StepBox
              step={step.number}
              title={step.title}
              subtitle={step.subtitle}
              active={step?.active}
              completed={step.completed}
            />
          ))}
        </div>
        {/* step box ends */}
        {/* main shit begins */}
        <div className="header w-full flex justify-between items-center border-b border-gray-200 h-[540px]">
          {aiLoading || !aiMappings ? (
            <RenderingStep1
              aiLoading={aiLoading}
              noOfColumns={numberOfColumns}
            />
          ) : (
            <RenderingStep2
              mappings={aiMappings as UIMapping[]}
              fieldsDetected={numberOfColumns}
              highConfidenceFields={highConfidenceMappings}
              customFields={lowConfidenceMappings}
            />
          )}
        </div>
        {/* main shit ends */}
        {/* footer begins */}
        <div className="header w-full flex justify-between items-center py-[20px] px-[16px] bg-[#FBFBFF] rounded-b-[12px]">
          <button
            className="rounded-[6px] border border-solid border-[#EEEEEE] bg-[#FFFFFF] gap-2 p-[10px_16px] opacity-100 font-[Geist Variable] text-[#222222] font-normal text-[16px] leading-[100%] tracking-[0%]"
            onClick={handleCloseModal}
          >
            Cancel
          </button>
          <div className="flex items-center justify-center gap-[12px]">
            <button className="rounded-[6px] border border-solid border-[#EEEEEE] bg-[#FFFFFF] gap-2 p-[10px_16px] opacity-100 font-[Geist Variable] text-[#222222] font-normal text-[16px] leading-[100%] tracking-[0%]">
              Previous
            </button>
            <button className="rounded-[6px] border border-solid bg-[#0E4259] gap-2 p-[10px_16px] opacity-100 font-[Geist Variable] font-normal text-[16px] leading-[100%] tracking-[0%] text-[#FFFFFF]">
              Next
            </button>
          </div>
        </div>
        {/* footer ends */}
      </div>
    </div>
  );
}
