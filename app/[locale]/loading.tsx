import Image from "next/image";
import logo from "@/app/assets/logo.png";

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-white">
      <Image src={logo} alt="Logo" width={240} height={240} priority />

      <div className="flex items-center text-8xl -mt-20 gap-1 text-gray-800">
        <span className="animate-pulse [animation-delay:0ms]">.</span>
        <span className="animate-pulse [animation-delay:400ms]">.</span>
        <span className="animate-pulse [animation-delay:800ms]">.</span>
      </div>
    </div>
  );
}
