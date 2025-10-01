import React, { useEffect, useMemo, useState } from "react";
import { SmartLoader } from "./loader";
import Image from "next/image";
import { mapCsvHeadersAI } from "@/utils/mapCsvHeaders";
import { parseCsv, type ParsedCsvColumns } from "@/utils/parseCsv";
import FieldMappingComponent from "./fieldMappingComponent";
import {
  addDocument,
  getDocuments,
  updateDocument,
} from "../firebase/firestore";
import { useAuth } from "@/context/authContext";
import { motion } from "framer-motion";
import {
  StepBoxProps,
  UIMapping,
  DEFAULT_CRM_FIELDS,
} from "@/interface/mappingInterface";

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
  return (
    <div
      className={`w-full bg-white border-gray-200 border rounded-xl p-6 shadow-sm`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="px-3 py-1 border rounded-md text-sm font-semibold"
          style={{ backgroundColor: bgColor, color: textColor, borderColor }}
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
            key={`${sourceField}-${index}`}
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
  isLoading = false,
  title1,
  subtitle1,
  imageSrc,
  title2,
  subtitle2,
}: {
  isLoading?: boolean;
  title1: string;
  subtitle1: string;
  imageSrc: string;
  title2: string;
  subtitle2: string;
}) => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col p-[24px] w-full gap-[8px] items-start content-between">
        <p className="font-[Geist Variable] font-semibold text-[18px] leading-[100%] tracking-[0%] text-[#0E4259]">
          {title1}
        </p>
        <p className="font-[Geist Variable] font-normal text-[16px] leading-[120%] tracking-[0%] text-[#68818C]">
          {subtitle1}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full ">
        <motion.div
          initial={{ opacity: 0.8, scale: 0.95 }}
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <Image
            src={imageSrc}
            alt="loading"
            width={280}
            height={178}
            className="mb-[24px]"
          />
        </motion.div>
        <div className="w-full flex flex-col items-center justify-center gap-[16px]">
          <p className="font-[Geist Variable] font-medium text-[20px] leading-[100%] tracking-[-1%] text-center text-[#5883C9]">
            {title2}
          </p>
          <p className="font-[Geist Variable] font-normal text-[16px] leading-[150%] tracking-[-0.15px] text-center align-middle text-[#7782AD]">
            {subtitle2}
          </p>
          <div className="w-full px-[200px]">
            <SmartLoader isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
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
          <FieldMapping key={`${mapping.sourceField}-${index}`} {...mapping} />
        ))}
      </div>
    </div>
  );
};

const RenderingStep4 = ({
  totalContactsImported,
  contactsMerged,
  errors,
  isWriting,
}: {
  totalContactsImported: number;
  contactsMerged: number;
  errors: number;
  isWriting?: boolean;
}) => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col p-[24px] w-full gap-[8px] items-start content-between">
        <p className="font-[Geist Variable] font-semibold text-[18px] leading-[100%] tracking-[0%] text-[#0E4259]">
          Final Checks Complete
        </p>
        <p className="font-[Geist Variable] font-normal text-[16px] leading-[120%] tracking-[0%] text-[#68818C]">
          Your data is clean and ready to import.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <motion.div
          initial={{ opacity: 0.8, scale: 0.95 }}
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <Image
            src="./checkComplete.svg"
            alt="loading"
            width={280}
            height={178}
            className="mb-[24px]"
          />
        </motion.div>
        <div className="w-full flex flex-col items-center justify-center gap-[16px]">
          <p className="font-[Geist Variable] font-medium text-[20px] leading-[100%] tracking-[-1%] text-center text-[#5883C9]">
            This Database entries are good to move to contacts section.
          </p>
          <div className="flex items-center justify-center rounded-[12px] border border-[0.5px] gap-2 opacity-100 pt-[7px] pr-2 pb-[7px] pl-2 border-[#EEEEEE]">
            <div className="w-[208px] flex flex-col items-center justify-center rounded-[12px] gap-2 opacity-100 pt-3 pr-2 pb-3 pl-[6px] bg-[#F2FFED]">
              <p className="font-chivo font-medium text-sm leading-[120%] tracking-normal text-[#008D0E]">
                Total Contacts Imported
              </p>
              <p className="font-chivo font-semibold text-2xl leading-none tracking-normal text-[#008D0E]">
                {totalContactsImported}
              </p>
            </div>
            <div className="w-[208px] flex flex-col items-center justify-center rounded-[12px] gap-2 opacity-100 pt-3 pr-2 pb-3 pl-[6px] bg-[#FFF7EA]">
              <p className="font-chivo font-medium text-sm leading-[120%] tracking-normal text-[#B67C0C]">
                Contacts Merged
              </p>
              <p className="font-chivo font-semibold text-2xl leading-none tracking-normal text-[#B67C0C]">
                {contactsMerged}
              </p>
            </div>
            <div className="w-[208px] flex flex-col items-center justify-center rounded-[12px] gap-2 opacity-100 pt-3 pr-2 pb-3 pl-[6px] bg-[#FFEDED]">
              <p className="font-chivo font-medium text-sm leading-[120%] tracking-normal text-[#C4494B]">
                Errors
              </p>
              <p className="font-chivo font-semibold text-2xl leading-none tracking-normal text-[#C4494B]">
                {errors}
              </p>
            </div>
          </div>
          <div className="w-full px-[200px] mt-2">
            <SmartLoader isLoading={!!isWriting} />
          </div>
        </div>
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
  const { currentUser } = useAuth();
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
  const [hasInitializedFromAI, setHasInitializedFromAI] =
    useState<boolean>(false);

  const [errorContacts, setErrorContacts] = useState<any[]>([]);
  const [contactsToAdd, setContactsToAdd] = useState<any[]>([]);
  const [contactsMerged, setContactsMerged] = useState<any[]>([]);
  const [checksLoading, setChecksLoading] = useState<boolean>(false);
  const [isWriting, setIsWriting] = useState<boolean>(false);

  const REQUIRED_TARGET_FIELDS = useMemo(
    () => new Set(["firstName", "lastName", "phoneNo", "email", "agentEmail"]),
    []
  );

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
            mapping.outerBorderColor = "#FFD3D3";
            mapping.shadowBoxColor = "#E1070714";
          }
        });
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

  useEffect(() => {
    if (
      !aiLoading &&
      aiMappings &&
      aiMappings.length > 0 &&
      !hasInitializedFromAI
    ) {
      setHeaderCurrentStep(2);
      setCurrentStep(2);
      setHasInitializedFromAI(true);
    }
  }, [aiLoading, aiMappings, hasInitializedFromAI]);

  const steps = useMemo(
    () => [
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
    ],
    [headerCurrentStep]
  );

  const checkBeforeNextMove = (mappings: any[]) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "phoneNo",
      "email",
      "agentEmail",
    ];
    const mappedFields = mappings
      .map((mapping) => mapping.targetField)
      .filter(Boolean);

    const missingFields = requiredFields.filter(
      (field) => !mappedFields.includes(field)
    );

    if (missingFields.length > 0) {
      alert(`Missing required field mappings: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
  };

  const resetAllStatesAndCloseModal = () => {
    setHeaderCurrentStep(1);
    setCurrentStep(1);
    setNumberOfColumns(0);
    setParsedCsv(null);
    setAiMappings(null);
    setAiLoading(false);
    setHighConfidenceMappings(0);
    setMediumConfidenceMappings(0);
    setLowConfidenceMappings(0);
    setAiError(null);
    setHasInitializedFromAI(false);
    setErrorContacts([]);
    setContactsToAdd([]);
    setContactsMerged([]);
    setChecksLoading(false);
    handleCloseModal();
  };

  const writeContactsToDatabase = async () => {
    try {
      setIsWriting(true);
      const chunkContacts = (contacts: any[], chunkSize: number) => {
        const chunks = [];
        for (let i = 0; i < contacts.length; i += chunkSize) {
          chunks.push(contacts.slice(i, i + chunkSize));
        }
        return chunks;
      };

      const contactBatches = chunkContacts(contactsToAdd, 30);

      for (let i = 0; i < contactBatches.length; i++) {
        const batch = contactBatches[i];
        const batchPromises = batch.map((contact) => {
          const { id, ...data } = contact || {};
          if (id) {
            return updateDocument(
              "company/A5eWer5YT4GtsAClx90o/contacts",
              id,
              data,
              true
            );
          }
          return addDocument("company/A5eWer5YT4GtsAClx90o/contacts", data);
        });

        await Promise.all(batchPromises);
      }

      alert(
        `Successfully imported ${contactsToAdd.length} contacts to the database!`
      );

      resetAllStatesAndCloseModal();
    } catch (error) {
      console.error("Error writing contacts to database:", error);
      alert("Failed to write contacts to database. Please try again.");
    } finally {
      setIsWriting(false);
    }
  };

  const checksAndMappingFunctions = async (
    mappings: any[],
    parsedCsv: any
  ): Promise<any> => {
    setChecksLoading(true);
    const fieldMapping = new Map();
    mappings.forEach((mapping) => {
      if (mapping.sourceField && mapping.targetField) {
        fieldMapping.set(mapping.targetField, mapping.sourceField);
      }
    });

    const agentsSourceField = fieldMapping.get("agentEmail");
    const agentsData = parsedCsv[agentsSourceField] || [];
    const rowCount = agentsData.length;

    const chunkArray = (array: any[], chunkSize: number) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    };

    const emailPhonePairs = [];

    for (let i = 0; i < rowCount; i++) {
      const email = parsedCsv[fieldMapping.get("email")]?.[i] || "";
      const phone = parsedCsv[fieldMapping.get("phoneNo")]?.[i] || "";
      if (email && phone) {
        emailPhonePairs.push({ email, phoneNo: phone });
      }
    }

    const uniquePairs = Array.from(
      new Set(emailPhonePairs.map((pair) => `${pair.email}|${pair.phoneNo}`))
    ).map((pairString) => {
      const [email, phoneNo] = pairString.split("|");
      return { email, phoneNo };
    });

    const agentEmailChunks = chunkArray(agentsData, 30);
    const emailChunks = chunkArray(
      uniquePairs.map((pair) => pair.email),
      30
    );
    const phoneChunks = chunkArray(
      uniquePairs.map((pair) => pair.phoneNo),
      30
    );

    const [
      agentsDocsResults,
      existingContactsByEmail,
      existingContactsByPhone,
    ] = await Promise.all([
      Promise.all(
        agentEmailChunks.map((chunk) =>
          getDocuments("company/A5eWer5YT4GtsAClx90o/users", {
            where: [["email", "in", chunk]],
          })
        )
      ).then((results) => results.flat()),

      Promise.all(
        emailChunks.map((chunk) =>
          getDocuments("company/A5eWer5YT4GtsAClx90o/contacts", {
            where: [["email", "in", chunk]],
          })
        )
      ).then((results) => results.flat()),

      Promise.all(
        phoneChunks.map((chunk) =>
          getDocuments("company/A5eWer5YT4GtsAClx90o/contacts", {
            where: [["phoneNo", "in", chunk]],
          })
        )
      ).then((results) => results.flat()),
    ]);

    const agentsDocs = agentsDocsResults;

    const allExistingContacts = existingContactsByEmail.filter((contact) =>
      existingContactsByPhone.some(
        (phoneContact) => phoneContact.id === contact.id
      )
    );

    const emailToUidMap = new Map(
      agentsDocs.map((agent) => [agent.email, agent.uid])
    );
    const existingContactKeys = new Set(
      allExistingContacts.map(
        (contact) => `${contact.email}|${contact.phoneNo}`
      )
    );

    const contactsToWrite: any[] = [];
    const errors = [];
    const duplicates = [];
    const uniqueContactsToAdd = [];

    const currentTime = new Date().toISOString();

    for (let i = 0; i < rowCount; i++) {
      const contact = {
        firstName: parsedCsv[fieldMapping.get("firstName")]?.[i] || "",
        lastName: parsedCsv[fieldMapping.get("lastName")]?.[i] || "",
        email: parsedCsv[fieldMapping.get("email")]?.[i] || "",
        phoneNo: parsedCsv[fieldMapping.get("phoneNo")]?.[i] || "",
        agentUid: emailToUidMap.get(agentsData[i]) || currentUser?.uid,
        agentEmail: emailToUidMap.get(agentsData[i])
          ? fieldMapping.get("agentEmail")?.[i]
          : currentUser?.email,
        createdOn: currentTime,
      };

      const missingFields = [];
      if (!contact.firstName.trim()) missingFields.push("firstName");
      if (!contact.lastName.trim()) missingFields.push("lastName");
      if (!contact.email.trim()) missingFields.push("email");
      if (!contact.phoneNo.trim()) missingFields.push("phoneNo");

      if (missingFields.length > 0) {
        errors.push({ row: i + 1, contact, missingFields });
      } else {
        const contactKey = `${contact.email}|${contact.phoneNo}`;
        if (existingContactKeys.has(contactKey)) {
          const matchingExisting = allExistingContacts.filter(
            (existing) =>
              existing.email === contact.email &&
              existing.phoneNo === contact.phoneNo
          );
          duplicates.push({ contact, existingContacts: matchingExisting });
          const existingId = matchingExisting[0]?.id;
          if (existingId) {
            contactsToWrite.push({ ...contact, id: existingId });
          }
        } else {
          uniqueContactsToAdd.push(contact);
          contactsToWrite.push(contact);
        }
      }
    }
    setErrorContacts(errors);
    setContactsMerged(duplicates);
    setContactsToAdd(contactsToWrite);
    setChecksLoading(false);
  };

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
          <button className="right-box" onClick={resetAllStatesAndCloseModal}>
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
          {steps.map((step) => (
            <StepBox
              key={step.number}
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
              isLoading={aiLoading}
              title1="AI Column Detection..."
              subtitle1={`Analyzing ${numberOfColumns} columns and matching with CRM fields using AI...`}
              imageSrc="./aiLoading.svg"
              title2="Auto Detecting Field Mapping..."
              subtitle2="Matching spreasheets columns to CRM fields using intelligent pattern
            recognition..."
            />
          ) : checksLoading ? (
            <RenderingStep1
              isLoading={checksLoading}
              title1="Checking for Duplicates & Errors…"
              subtitle1="Reviewing the entry data to ensure no duplicate contacts or invalid data slip through."
              imageSrc="./shield_svg.svg"
              title2="Running Final Checks…"
              subtitle2="Scanning entries for duplicates, missing details, or errors before the move to contact section completes…"
            />
          ) : currentStep === 2 ? (
            <RenderingStep2
              mappings={aiMappings as UIMapping[]}
              fieldsDetected={numberOfColumns}
              highConfidenceFields={highConfidenceMappings}
              customFields={lowConfidenceMappings}
            />
          ) : currentStep === 3 ? (
            <div className="w-full h-full flex flex-col">
              <div className="flex flex-col items-start justify-center w-full p-[24px] pb-[12px] gap-[16px] flex-shrink-0">
                <p className="font-[Geist Variable] font-semibold text-[18px] leading-[100%] tracking-[0%] text-[#0E4259]">
                  Smart Field Mapping
                </p>
                <p className="font-[Geist Variable] font-normal text-[17px] leading-[150%] tracking-[0%] text-[#68818C]">
                  Review and adjust the AI-powered field mappings below. Click
                  &quot;Edit&quot; next to any mapping to change it. You can map
                  to existing CRM fields.
                </p>
              </div>
              <div className="w-full flex-1 min-h-0 flex flex-col items-start justify-start gap-[16px] pt-[12px] px-[24px] pb-[24px] overflow-y-auto">
                {(aiMappings as UIMapping[]).map((mapping, index) => {
                  const mappedBy: Record<string, string> = (
                    aiMappings as UIMapping[]
                  ).reduce((acc: Record<string, string>, m: UIMapping) => {
                    if (m.targetField) acc[m.targetField] = m.sourceField;
                    return acc;
                  }, {});
                  const available = Array.from(
                    new Set([
                      ...DEFAULT_CRM_FIELDS,
                      ...((aiMappings as UIMapping[])
                        .map((m) => m.targetField)
                        .filter(Boolean) as string[]),
                    ])
                  );

                  const handleSwapOrSet = (nextField: string) => {
                    setAiMappings((prev) => {
                      if (!prev) return prev;
                      const copy = [...prev];
                      const current = copy[index];
                      const otherIndex = copy.findIndex(
                        (m, i) => i !== index && m.targetField === nextField
                      );
                      if (otherIndex !== -1) {
                        const temp = copy[otherIndex].targetField;
                        copy[otherIndex] = {
                          ...copy[otherIndex],
                          targetField: current.targetField,
                        };
                        copy[index] = { ...current, targetField: temp };
                      } else {
                        copy[index] = { ...current, targetField: nextField };
                      }
                      return copy;
                    });
                  };

                  const handleRemoveMapping = () => {
                    setAiMappings((prev) => {
                      if (!prev) return prev;
                      const copy = [...prev];
                      const current = copy[index];
                      if (REQUIRED_TARGET_FIELDS.has(current.targetField)) {
                        alert(
                          `Cannot remove required field: ${current.targetField}. You can swap it with another mapping instead.`
                        );
                        return prev;
                      }
                      copy[index] = { ...current, targetField: "" };
                      return copy;
                    });
                  };

                  return (
                    <FieldMappingComponent
                      key={index}
                      {...mapping}
                      availableFields={available}
                      onChangeMapping={handleSwapOrSet}
                      onRemoveMapping={handleRemoveMapping}
                      mappedBy={mappedBy}
                    />
                  );
                })}
              </div>
            </div>
          ) : currentStep === 4 ? (
            <RenderingStep4
              totalContactsImported={contactsToAdd.length}
              contactsMerged={contactsMerged.length}
              errors={errorContacts.length}
              isWriting={isWriting}
            />
          ) : null}
        </div>
        {/* main shit ends */}
        {/* footer begins */}
        <div className="header w-full flex justify-between items-center py-[20px] px-[16px] bg-[#FBFBFF] rounded-b-[12px]">
          <button
            className="rounded-[6px] border border-solid border-[#EEEEEE] bg-[#FFFFFF] gap-2 p-[10px_16px] opacity-100 font-[Geist Variable] text-[#222222] font-normal text-[16px] leading-[100%] tracking-[0%]"
            onClick={resetAllStatesAndCloseModal}
          >
            Cancel
          </button>
          <div className="flex items-center justify-center gap-[12px]">
            <button
              className={`rounded-[6px] border border-solid border-[#EEEEEE] gap-2 p-[10px_16px] opacity-100 font-[Geist Variable] font-normal text-[16px] leading-[100%] tracking-[0%] ${
                currentStep === 1 ||
                currentStep === 2 ||
                aiLoading ||
                checksLoading ||
                isWriting
                  ? "bg-[#F5F5F5] text-[#CCCCCC] cursor-not-allowed"
                  : "bg-[#FFFFFF] text-[#222222] hover:bg-[#F9F9F9]"
              }`}
              onClick={() => {
                if (currentStep > 1 && !aiLoading && !checksLoading) {
                  setCurrentStep(currentStep - 1);
                  if (currentStep === 3) {
                    setHeaderCurrentStep(2);
                  } else if (currentStep === 4) {
                    setHeaderCurrentStep(2);
                  }
                }
              }}
              disabled={
                currentStep === 1 ||
                currentStep === 2 ||
                aiLoading ||
                checksLoading
              }
            >
              Previous
            </button>
            <button
              className={`rounded-[6px] border border-solid gap-2 p-[10px_16px] opacity-100 font-[Geist Variable] font-normal text-[16px] leading-[100%] tracking-[0%] ${
                currentStep === 1 || aiLoading || checksLoading || isWriting
                  ? "bg-[#F5F5F5] text-[#CCCCCC] cursor-not-allowed border-[#EEEEEE]"
                  : "bg-[#0E4259] text-[#FFFFFF] hover:bg-[#0A3447]"
              }`}
              onClick={async () => {
                if (currentStep === 1 || aiLoading || checksLoading) {
                  return;
                } else if (currentStep === 2) {
                  setCurrentStep(3);
                  setHeaderCurrentStep(2);
                } else if (currentStep === 3) {
                  if (!checkBeforeNextMove(aiMappings || [])) {
                    return;
                  }

                  try {
                    await checksAndMappingFunctions(
                      aiMappings || [],
                      parsedCsv
                    );
                    setCurrentStep(4);
                    setHeaderCurrentStep(3);
                  } catch (error) {
                    console.error("Error during checks:", error);
                    setCurrentStep(3);
                    setHeaderCurrentStep(2);
                    setChecksLoading(false);
                    alert(
                      "An error occurred during the final checks. Please try again."
                    );
                  }
                } else if (currentStep === 4) {
                  await writeContactsToDatabase();
                }
              }}
              disabled={currentStep === 1 || aiLoading || checksLoading}
            >
              {currentStep === 4
                ? isWriting
                  ? "Writing..."
                  : "Move to Contacts"
                : "Next"}
            </button>
          </div>
        </div>
        {/* footer ends */}
      </div>
    </div>
  );
}
