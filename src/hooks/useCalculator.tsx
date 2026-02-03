import { useState } from "react";
import { CalculatorSchemaType } from "./../components/form/CalculatorForm/calculatorSchema";

export function useCalculator() {
  const [time, setTime] =
    useState({ days: 0, hours: 0, minutes: 0, seconds: 0 }) || null;
  const [cpuInfo, setCpuInfo] = useState<string | null>(null);
  const [gpuInfo, setGpuInfo] = useState<string | null>(null);
  const [country, setCountry] = useState("");
  const [energy_consumed, setEnergyConsumed] = useState(0);
  const [carbon_footprint, setCarbonFootprint] = useState(0);
  const [water_consumed, setWaterConsumed] = useState(0);

  const calculateEnergyConsumed = (
    body: CalculatorSchemaType,
    knowsEnergyConsumed: boolean,
    cpuBrand: { label: string } | null,
    processor: { label: string; tdp: string } | null,
    gpuBrand: { label: string } | null,
    graphicCard: { label: string; tdp: string } | null,
    country: { label: string; wue: string; carbon_intensity: string } | null,
  ) => {
    let onSiteWUE = 0;
    let pue = 1;
    let cpuTDP = 0;
    let gpuTDP = 0;

    let energy = 0;

    if (!knowsEnergyConsumed) {
      const time =
        (body.days * 24 * 60 * 60 +
          body.hours * 60 * 60 +
          body.minutes * 60 +
          body.seconds) /
        3600; // h

      setTime({
        days: body.days,
        hours: body.hours,
        minutes: body.minutes,
        seconds: body.seconds,
      });

      pue = body.PUE || 1;

      if (processor) {
        cpuTDP = parseInt(processor.tdp.replace(" W", "")) / 1000 || 0; // kw
        setCpuInfo(`${cpuBrand?.label} ${processor.label}`);
      }
      if (graphicCard) {
        gpuTDP = parseInt(graphicCard.tdp.replace(" W", "")) / 1000 || 0; // kw
        setGpuInfo(`${gpuBrand?.label} ${graphicCard.label}`);
      }

      onSiteWUE = body.onSiteWUE || 0;

      energy = time * (cpuTDP + gpuTDP) * pue;
    } else {
      setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      energy = body.energyConsumed; // kWh
      onSiteWUE = body.onSiteWUE || 0;
      pue = body.PUE || 1;
    }

    let waterOffSiteWUE = 0;
    if (country) {
      waterOffSiteWUE = Number(country.wue) * 3.785 || 0; // L/kWh
    }

    const carbon_intensity = Number(country?.carbon_intensity) / 1000 || 0;

    const carbon = energy * carbon_intensity; // kgCO2e
    const water = energy * (onSiteWUE + waterOffSiteWUE * pue); // L

    setCountry(country!.label);
    setEnergyConsumed(energy);
    setCarbonFootprint(carbon);
    setWaterConsumed(water);

    return {
      time,
      country,
      energy_consumed: energy,
      carbon_footprint: carbon,
      water_consumed: water,
    };
  };

  return {
    time,
    cpuInfo,
    gpuInfo,
    country,
    energy_consumed,
    carbon_footprint,
    water_consumed,
    calculateEnergyConsumed,
  };
}
