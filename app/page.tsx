import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from "./components/calendar";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <div className="w-screen h-screen font-nunito flex flex-row py-6 px-6">
      <div className="w-80 bg-green-200 h-full"></div>

      <div className="flex flex-col w-full h-full">
        <div className="h-8 bg-red-200"></div>

        <Calendar month={4} />

        <div className=" flex flex-row gap-14">
          <span className="flex flex-row gap-1 text-sm/7 lin">
            <FontAwesomeIcon
              icon={faSortDown}
              style={{ color: "#57BB8A", height: "18px" }}
            />
            Entrada
          </span>

          <span className="flex flex-row gap-1 text-sm/7 lin">
            <FontAwesomeIcon
              icon={faSortDown}
              style={{ color: "#E67C73", height: "18px" }}
            />
            Saída
          </span>

          <span className="flex flex-row gap-1 text-sm/7 lin">
            <FontAwesomeIcon
              icon={faSortDown}
              style={{ color: "#FFE599", height: "18px" }}
            />
            Diário
          </span>
        </div>
      </div>
    </div>
  );
}
