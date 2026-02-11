import { useForm } from "react-hook-form";
import { FormField } from "../FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatorSchema, CalculatorSchemaType } from "./calculatorSchema";
import Select from "react-select";

import processors from "../../../hardware/processors.json";
import graphic_cards from "../../../hardware/graphic_cards.json";
import countries from "../../../country/countries.json";

import { useContext, useEffect, useState } from "react";
import { Label } from "../Label";
import { Input } from "../Input";
import { CalculatorContext } from "../../../context/CalculatorContext";

const CalculatorForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CalculatorSchemaType>({
    resolver: zodResolver(calculatorSchema),
  });

  const context = useContext(CalculatorContext);

  const cpuBrandOptions = Object.keys(processors).map((brand) => ({
    value: brand,
    label: brand === "amd" ? "AMD" : "Intel",
  }));

  const gpuBrandOptions = Object.keys(graphic_cards).map((brand) => ({
    value: brand,
    label: brand === "amd" ? "AMD" : "NVIDIA",
  }));

  const [cpuBrand, setCPUBrand] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [gpuBrand, setGPUBrand] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [cpuGeneration, setCPUGeneration] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [gpuGeneration, setGPUGeneration] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [processor, setProcessor] = useState<{
    value: string;
    label: string;
    tdp: string;
  } | null>(null);

  const [graphicCard, setGraphicCard] = useState<{
    value: string;
    label: string;
    tdp: string;
  } | null>(null);

  useEffect(() => {
    setCPUGeneration(null);
    setProcessor(null);
  }, [cpuBrand]);

  useEffect(() => {
    setGPUGeneration(null);
    setGraphicCard(null);
  }, [cpuBrand]);

  useEffect(() => {
    setProcessor(null);
  }, [cpuGeneration]);

  useEffect(() => {
    setGraphicCard(null);
  }, [gpuGeneration]);

  const cpuGenerationOptions = () => {
    if (!cpuBrand) return [];

    const selectedCPUBrand = cpuBrand.value;

    const cpuGenerations =
      selectedCPUBrand === "amd" ? processors.amd : processors.intel;

    return cpuGenerations.map((gen) => ({
      value: gen.generation,
      label: gen.generation,
    }));
  };

  const processorsOptions = () => {
    if (!cpuBrand || !cpuGeneration) return [];
    const selectedCPUBrand = cpuBrand.value;
    const cpuGenerations =
      selectedCPUBrand === "amd" ? processors.amd : processors.intel;

    const processorsList = cpuGenerations.find(
      (gen) =>
        gen.generation.toLocaleLowerCase() ===
        cpuGeneration?.value.toLocaleLowerCase(),
    );

    if (!processorsList) return [];

    return (
      processorsList.models.map((proc) => ({
        value: proc["Name"],
        label: proc["Name"],
        tdp: proc["TDP"],
      })) ?? []
    );
  };

  const gpuGenerationOptions = () => {
    if (!gpuBrand) return [];

    const selectedGPUBrand = gpuBrand.value;

    const gpuGenerations =
      selectedGPUBrand === "amd" ? graphic_cards.amd : graphic_cards.nvidia;

    return gpuGenerations.map((gen) => ({
      value: gen.generation,
      label: gen.generation,
    }));
  };

  const graphicCardsOptions = () => {
    if (!gpuBrand || !gpuGeneration) return [];
    const selectedGPUBrand = gpuBrand.value;
    const gpuGenerations =
      selectedGPUBrand === "amd" ? graphic_cards.amd : graphic_cards.nvidia;

    const processorsList = gpuGenerations.find(
      (gen) =>
        gen.generation.toLocaleLowerCase() ===
        gpuGeneration?.value.toLocaleLowerCase(),
    );

    if (!processorsList) return [];

    return (
      processorsList.models.map((proc) => ({
        value: proc.name,
        label: proc.name,
        tdp: proc.tdp,
      })) ?? []
    );
  };

  const countriesOptions = countries.map((c) => ({
    value: c.id,
    label: c.name,
    wue: c.wue,
    carbon_intensity: c.carbon_intensity,
  }));
  const [country, setCountry] = useState<{
    value: number;
    label: string;
    wue: string;
    carbon_intensity: string;
  } | null>(null);

  const handleCalculate = (body: CalculatorSchemaType) => {
    context.calculateEnergyConsumed(
      body,
      knowsEnergyConsumed,
      // @ts-expect-error arrumar depois
      cpuBrand,
      processor,
      gpuBrand,
      graphicCard,
      country,
    );
  };

  const [knowsEnergyConsumed, setKnowsEnergyConsumed] = useState(false);

  return (
    <form onSubmit={handleSubmit(handleCalculate)} className="w-80 md:w-96">
      <div className="flex w-full mb-6">
        <p className="text-sm md:text-lg text-secondary mb-3">
          Do you already know the energy consumed by the system?
        </p>
        <label className="text-dark-grey text-sm md:text-lg">
          <input
            type="radio"
            className="ml-3"
            checked={knowsEnergyConsumed}
            onClick={() => {
              setKnowsEnergyConsumed(true);
            }}
          />{" "}
          Yes
        </label>
        <label className="text-dark-grey text-sm md:text-lg">
          <input
            type="radio"
            className="ml-2"
            defaultChecked={true}
            checked={!knowsEnergyConsumed}
            onClick={() => {
              setKnowsEnergyConsumed(false);
            }}
          />{" "}
          No
        </label>
      </div>
      {!knowsEnergyConsumed && (
        <div>
          <div className="flex items-center justify-between w-full mb-4">
            <div className="w-[800px]">
              <Label>Tempo: </Label>
              <Label>(DD HH:MM:SS)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Input
                mask={{ mask: "__", replacement: { _: /[0-9]/ } }}
                {...register("days")}
              />
              <p></p>
              <Input
                mask={{ mask: "__", replacement: { _: /[0-9]/ } }}
                {...register("hours")}
              />
              <p>:</p>
              <Input
                mask={{ mask: "__", replacement: { _: /[0-9]/ } }}
                {...register("minutes")}
              />
              <p>:</p>
              <Input
                mask={{ mask: "__", replacement: { _: /[0-9]/ } }}
                {...register("seconds")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 items-start">
            <div className="flex w-full gap-3 items-center">
              <Label>CPU: </Label>
              <Select
                className="w-full"
                options={cpuBrandOptions}
                onChange={setCPUBrand}
                value={cpuBrand}
              />
            </div>

            {cpuBrand && (
              <Select
                className="w-full"
                options={cpuGenerationOptions()}
                placeholder="Select Generation"
                onChange={setCPUGeneration}
                value={cpuGeneration}
                isDisabled={!cpuBrand}
              />
            )}

            {cpuBrand && cpuGeneration && (
              <Select
                className="w-full"
                options={processorsOptions()}
                placeholder="Select CPU"
                value={processor}
                onChange={setProcessor}
                isDisabled={!cpuBrand || !cpuGeneration}
              />
            )}

            {cpuBrand && (
              <button
                className="hover:underline"
                onClick={() => {
                  setCPUBrand(null);
                  setCPUGeneration(null);
                  setProcessor(null);
                }}
              >
                <p className="text-dark-grey">{"->"} limpar campos</p>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 items-start mt-5">
            <div className="flex w-full gap-3 items-center">
              <Label>GPU: </Label>
              <Select
                className="w-full"
                options={gpuBrandOptions}
                onChange={setGPUBrand}
                value={gpuBrand}
              />
            </div>

            {gpuBrand && (
              <Select
                className="w-full"
                options={gpuGenerationOptions()}
                placeholder="Select Generation"
                onChange={setGPUGeneration}
                value={gpuGeneration}
                isDisabled={!gpuBrand}
              />
            )}

            {gpuBrand && gpuGeneration && (
              <Select
                className="w-full"
                options={graphicCardsOptions()}
                placeholder="Select CPU"
                value={graphicCard}
                onChange={setGraphicCard}
                isDisabled={!gpuBrand || !gpuGeneration}
              />
            )}

            {gpuBrand && (
              <button
                className="hover:underline"
                onClick={() => {
                  setGPUBrand(null);
                  setGPUGeneration(null);
                  setGraphicCard(null);
                }}
              >
                <p className="text-dark-grey">{"->"} limpar campos</p>
              </button>
            )}
          </div>
        </div>
      )}

      {knowsEnergyConsumed && (
        <FormField
          label="Energy Consumed (kWh)"
          placeholder="Enter energy consumed"
          errorMessage={errors.energyConsumed?.message}
          {...register("energyConsumed")}
        />
      )}

      <div className="flex gap-3 my-4 items-center">
        <Label>Country:</Label>
        <Select
          className="w-full"
          options={countriesOptions}
          value={country}
          onChange={setCountry}
        />
      </div>

      <FormField
        label="on-site WUE"
        placeholder="on-site WUE (Default: 0)"
        errorMessage={errors.onSiteWUE?.message}
        helperMessage="Water Usage Effectiveness (WUE) is a measure of how efficiently a data center uses water"
        {...register("onSiteWUE")}
      />

      <FormField
        label="PUE"
        placeholder="PUE (Default: 1)"
        errorMessage={errors.PUE?.message}
        helperMessage="Power Usage Effectiveness (PUE) is a measure of how efficiently a data center uses energy"
        {...register("PUE")}
      />

      {/* <div className="my-10">
          {radioValue === "NÃO" && <p>TDP = {processor?.tdp}</p>}
          <p>WUE = {country ? Number(country.wue) * 3.785 : ""}</p>
          <p>Intensidade Carbônica = {country?.carbon_intensity}</p>
        </div> */}

      <button className="bg-light-green py-3 w-full rounded font-bold text-sm md:text-lg hover:transform hover:scale-[1.02] hover:bg-green transition-all">
        Calculate
      </button>
    </form>
  );
};

export default CalculatorForm;
