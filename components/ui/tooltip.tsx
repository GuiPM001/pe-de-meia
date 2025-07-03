import React from "react";

interface TooltipProps {
  position: "left" | "bottom";
  label: string;
}

export default function Tooltip({ label, position }: TooltipProps) {
  if (position === "left") {
    return (
      <div className="hidden group-hover:block absolute whitespace-nowrap right-full top-1/2 z-20 mr-3 -translate-y-1/2 rounded bg-black py-2 px-4 text-sm text-white">
        <span className="absolute right-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 bg-black"></span>
        <p className="text-right">
          {label.split("\n").map((line, index) => (
            <React.Fragment key={`${line}-${index}`}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>
    );
  }
  return (
    <div className="hidden group-hover:block absolute whitespace-nowrap top-full left-1/2 z-20 mt-2 -translate-x-1/2 rounded bg-black py-2 px-4 text-sm text-white">
      <span className="absolute top-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 bg-black"></span>
      <p className="text-bottom">{label}</p>
    </div>
  );
}
