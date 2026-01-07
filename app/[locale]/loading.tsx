import Image from "next/image";
import logo from "@/app/assets/logo.png";

export default function Loading() {
  return (
    <div style={styles.container}>
      <Image
        src={logo}
        alt="Logo"
        width={240}
        height={240}
        priority
      />

      <div style={styles.dots}>
        <span style={{ ...styles.dot, animationDelay: "0ms" }}>.</span>
        <span style={{ ...styles.dot, animationDelay: "400ms" }}>.</span>
        <span style={{ ...styles.dot, animationDelay: "800ms" }}>.</span>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.2; }
          50% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed" as const,
    inset: 0,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "#ffffff",
  },
  dots: {
    display: "flex",
    alignItems: "center",
    marginTop: -80,
    fontSize: 96,
    color: "#1f2937",
    lineHeight: 1,
  },
  dot: {
    animation: "pulse 1.2s infinite ease-in-out",
  },
};
