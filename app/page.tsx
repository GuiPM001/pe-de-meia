"use client";

import { useState } from "react";
import Calendar from "./components/calendar";
import Sidebar from "./components/sidebar";
import { getMonthNameByMonth } from "./utils/date";
import { TbCirclePlusFilled, TbInfoCircleFilled, TbSettingsFilled } from "react-icons/tb";
import { IconButton } from "@chakra-ui/react";

export default function Home() {
  const [monthSelected, setMonthSelected] = useState<number>(
    new Date().getMonth()
  );
  const [yearSelected, setYearSelected] = useState<number>(
    new Date().getFullYear()
  );

  return (
    <div className="w-screen h-screen font-nunito flex flex-row py-6 px-6 overflow-x-hidden">
      <Sidebar
        monthSelected={monthSelected}
        setMonthSelected={setMonthSelected}
        yearSelected={yearSelected}
        setYearSelected={setYearSelected}
      />

      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row gap-5 items-center">
          <span className="capitalize font-black text-3xl">
            {getMonthNameByMonth(yearSelected, monthSelected)}
          </span>
          <IconButton aria-label="Add transaction">
            <TbCirclePlusFilled size="22px" />
          </IconButton>
          <IconButton aria-label="Configure profile">
            <TbSettingsFilled size="22px"  />
          </IconButton>
          <IconButton aria-label="Info">
            <TbInfoCircleFilled  size="22px"  />
          </IconButton>
        </div>

        <Calendar month={monthSelected} year={yearSelected} />
      </div>
    </div>
  );
}
