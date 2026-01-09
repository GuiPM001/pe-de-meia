import React from "react";

interface TooltipProps {
  position: "left" | "bottom" | "top";
  label: string;
}

const positionStyles = {
  left: {
    container:
      "right-full top-1/2 mr-3 -translate-y-1/2",
    arrow:
      "right-[-3px] top-1/2 -translate-y-1/2",
    text: "text-right",
  },
  bottom: {
    container:
      "top-full left-1/2 mt-2 -translate-x-1/2",
    arrow:
      "top-[-3px] left-1/2 -translate-x-1/2",
    text: "text-center",
  },
  top: {
    container:
      "bottom-full left-1/2 mb-2 -translate-x-1/2",
    arrow:
      "bottom-[-3px] left-1/2 -translate-x-1/2",
    text: "text-center",
  },
};

export default function Tooltip({ label, position }: TooltipProps) {
  const styles = positionStyles[position];

  return (
    <div
      className={`hidden group-hover:block group-focus-within:block absolute whitespace-nowrap z-20 rounded bg-black py-2 px-4 text-sm text-white ${styles.container}`}
    >
      <span
        className={`absolute -z-10 h-2 w-2 rotate-45 bg-black ${styles.arrow}`}
      />

      <p className={styles.text}>
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
