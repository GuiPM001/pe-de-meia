import Calendar from "./components/calendar";

export default function Home() {
  return (
    <div className="w-screen h-screen font-nunito flex flex-row py-6 px-6">
      <div className="w-80 bg-green-200 h-full"></div>

      <div className="flex flex-col w-full h-full">
        <div className="h-8 bg-red-200"></div>

        <Calendar month={4} />
      </div>
    </div>
  );
}
