import React from "react";

export default function CalendarHeader() {
  const className = "border border-t-0 border-gray-200 text-center font-black py-1 self-end mt-4";
  
  return (
    <>
      <div className={className}>
        DOM.
      </div>
      <div className={className}>
        SEG.
      </div>
      <div className={className}>
        TER.
      </div>
      <div className={className}>
        QUA.
      </div>
      <div className={className}>
        QUI.
      </div>
      <div className={className}>
        SEX.
      </div>
      <div className={className}>
        SAB.
      </div>
    </>
  );
}
