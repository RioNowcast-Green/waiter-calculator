import React, { createContext } from "react";
import { useCalculator } from "../hooks/useCalculator";
// import { CalculatorSchemaType } from "../components/form/CalculatorForm/calculatorSchema";

interface CalculatorContextData {
  time: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null;
  cpuInfo: string | null;
  gpuInfo: string | null;
  country: string;
  energy_consumed: number;
  carbon_footprint: number;
  water_consumed: number;
  calculateEnergyConsumed: (
    body: {
      hours: number;
      minutes: number;
      seconds: number;
      onSiteWUE: number;
      PUE: number;
      energyConsumed: number;
    },
    knowsEnergyConsumed: boolean,
    processor: { tdp: string } | null,
    graphicCard: { tdp: string } | null,
    cpuBrand: { label: string } | null,
    gpuBrand: { label: string } | null,

    country: { wue: string; carbon_intensity: string } | null,
  ) => void;
}

export const CalculatorContext = createContext<CalculatorContextData>(
  {} as CalculatorContextData,
);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    time,
    cpuInfo,
    gpuInfo,
    country,
    energy_consumed,
    carbon_footprint,
    water_consumed,
    calculateEnergyConsumed,
  } = useCalculator();

  return (
    <CalculatorContext.Provider
      value={{
        time,
        cpuInfo,
        gpuInfo,
        country,
        energy_consumed,
        carbon_footprint,
        water_consumed,
        // @ts-expect-error arrumar depois
        calculateEnergyConsumed,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};
