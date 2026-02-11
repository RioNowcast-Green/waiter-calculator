import { useContext } from "react";
import { CalculatorContext } from "../context/CalculatorContext";
import { ResultCard } from "../components/ResultCard";
import Header from "../components/Header";

import co2Icon from "../../public/icons/co2.png";
import energyIcon from "../../public/icons/energy.png";
import waterIcon from "../../public/icons/water.png";
import lightBulbIcon from "../../public/icons/light-bulb.png";
import carIcon from "../../public/icons/car.png";
import bottleIcon from "../../public/icons/bottle.png";
import treeIcon from "../../public/icons/tree.png";

import logo from "../../public/icons/logo.svg";
import FormSection from "../components/FormSection";

export const Home = () => {
  const context = useContext(CalculatorContext);

  const hoursDecimal = Number(context.energy_consumed.toFixed(2)) / 0.06;
  const hours = Math.floor(hoursDecimal);
  const minutes = Math.round((hoursDecimal - hours) * 60);

  return (
    <div>
      <Header />
      <div className="flex flex-wrap items-center justify-around mt-5 mb-20">
        <FormSection />

        <div className="flex flex-col w-full items-stretch gap mx-2 md:mx-5 gap-10 max-w-[300px] sm:max-w-[400px] md:max-w-[900px] mt-4 md:mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full">
            <ResultCard
              img={energyIcon}
              label={"Energy Consumed"}
              result={`${context.energy_consumed.toFixed(2)} kWh`}
            />
            <ResultCard
              img={co2Icon}
              label={"Carbon Footprint"}
              result={`${context.carbon_footprint.toFixed(2)} kgCO2e`}
            />
            <div className="col-span-2 md:col-span-1">
              <ResultCard
                img={waterIcon}
                label={"Water Footprint"}
                result={`${context.water_consumed.toFixed(2)} L`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-[1500px]">
            <ResultCard
              img={lightBulbIcon}
              label={"Light Bulb (60W)"}
              result={`${hours}h ${minutes}min`}
            />
            <ResultCard
              img={carIcon}
              label={"Carbon Footprint"}
              result={`${Math.floor(
                Number(context.carbon_footprint.toFixed(2)) / 0.096,
              )} km`}
            />
            <ResultCard
              img={bottleIcon}
              label={"Bottle of Water"}
              result={`${Math.floor(
                Number(context.water_consumed.toFixed(2)) * 2,
              )} units`}
            />
            <ResultCard
              img={treeIcon}
              label={"Tree Decarbonization"}
              result={`${Math.floor(
                Number(context.carbon_footprint.toFixed(2) * (12 / 44)) /
                  0.03754,
              )} trees in 1 day`}
            />
          </div>
          <div className="rounded-lg py-3 px-10 shadow-lg flex flex-col ">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <h1 className="text-xl font-bold">How to Cite</h1>
                <p className="text-sm md:text-base">
                  This experiment{" "}
                  {context.time &&
                  context.time.hours +
                    context.time.minutes +
                    context.time.seconds >
                    0 ? (
                    <>
                      ran for {context.time?.hours} hours and{" "}
                      {context.time?.minutes} minutes on{" "}
                      {context.cpuInfo && context.gpuInfo ? (
                        <>
                          {context.cpuInfo} and {context.gpuInfo}
                        </>
                      ) : (
                        context.cpuInfo || context.gpuInfo
                      )}{" "}
                      consuming {context.energy_consumed.toFixed(2)} kWh
                    </>
                  ) : (
                    <>consumed {context.energy_consumed.toFixed(2)} kWh</>
                  )}
                  , with an estimated footprint of{" "}
                  {context.carbon_footprint.toFixed(2)} kgCO₂e and{" "}
                  {context.water_consumed.toFixed(2)} L of water in{" "}
                  {context.country}, as calculated with wAIter (beta version)
                  <a
                    href="https://doi.org/10.5281/zenodo.17238926"
                    className="text-link underline hover:text-link hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    (Breder & Ferro, 2025)
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg py-3 px-10 shadow-lg flex flex-col ">
            <div className="flex flex-col gap-5">
              <div className="md:flex gap-10">
                <img src={logo} className="w-40 hidden md:block" />
                <div className="flex flex-col gap-3">
                  <h1 className="text-xl font-bold text-center md:text-left">
                    About Us
                  </h1>
                  <img src={logo} className="md:hidden w-32 md:w-40 m-auto" />
                  <p className="text-sm md:text-base">
                    The{" "}
                    <a
                      href="https://ia-etica.uff.br/nucleo-de-ia-etica/"
                      className="text-link underline hover:text-link hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ethical and Sustainable AI
                    </a>{" "}
                    Group at the Federal Fluminense University explores
                    responsible and environmentally conscious approaches to
                    Artificial Intelligence.
                  </p>
                  <p className="text-sm md:text-base">
                    This Work was developed by{" "}
                    <strong>
                      <a
                        href="https://www.linkedin.com/in/gabriel-breder/"
                        className="text-link underline hover:text-link hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Gabriel B. Breder
                      </a>
                    </strong>{" "}
                    and{" "}
                    <strong>
                      <a
                        href="https://www.linkedin.com/in/mariza-ferro-9b4568112/"
                        className="text-link underline hover:text-link hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Mariza Ferro
                      </a>
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
