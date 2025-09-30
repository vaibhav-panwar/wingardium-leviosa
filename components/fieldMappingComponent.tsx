import React, { useState } from "react";

export default function FieldMappingComponent({
  outerBorderColor = "#EEEEEE",
  shadowBoxColor,
  matchPercentage,
  bgColor,
  textColor,
  borderColor,
  sourceField
}: {
  outerBorderColor?: string;
  shadowBoxColor?: string;
  matchPercentage: number;
  bgColor?:string;
  textColor?:string;
  borderColor?:string;
  sourceField:string;
}) {
  return (
    <div
      className={`w-full flex items-center justify-center px-[24px] py-[20px] rounded-[16px] border-1px border-[${outerBorderColor}] ${
        shadowBoxColor ? "shadow-[0px_0px_24px_0px_#E1070714]" : ""
      }`}
    >
      <div className="w-full flex items-center justify-center gap-[12px]">
        <div className="leftBox flex flex-col items-start justify-between">
          <div className="left flex items-center gap-[6px]">
            <p className="py-[4px] px-[8px] rounded-[8px] border-[1px] border-[#FFB7F4] bg-[#FBEBFF] font-[Geist_Variable] font-medium text-[12px] leading-[136%] tracking-[1px] text-[#920C7A]">DATABASE FIELD</p>
            <p className={`bg-[${bgColor}] text-[${textColor}] px-3 py-1 border-[1px] border-[${borderColor}] rounded-md text-sm font-semibold`}>{matchPercentage}%</p>
          </div>
          <p className="font-[Geist_Variable] font-semibold text-[20px] leading-[100%] tracking-[0] text-[#0E4259]">{sourceField}</p>
        </div>
      </div>
    </div>
  );
}
