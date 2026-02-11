import { useContext, useState } from "react";
import { CalculatorContext } from "../../../context/CalculatorContext";
import { CalculatorSchemaType } from "../CalculatorForm/calculatorSchema";

import countries from "../../../country/countries.json";

function ReadCSV() {
  const [data, setData] = useState<string[][]>([]);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;

      const rows = text
        .split("\n")
        .map((row) => row.trim())
        .filter(Boolean)
        .map((row) => row.split(","));

      setData(rows);
      setShowHint(false);
    };

    reader.readAsText(file);
  };

  const context = useContext(CalculatorContext);

  const knowsEnergyConsumed = true;

  // @ts-expect-error arrumar depois
  const handleCalculate = (body: CalculatorSchemaType, country) => {
    countries.forEach((c) => {
      if (c.name === country) {
        country = c;
      }
    });

    const country_formatted = {
      label: country.name,
      wue: country.wue,
      carbon_intensity: country.carbon_intensity,
    };

    console.log(country_formatted);

    context.calculateEnergyConsumed(
      body,
      knowsEnergyConsumed,
      null,
      null,
      null,
      null,
      country_formatted,
    );
  };

  const handleSubmit = (row: string[]) => {
    console.log("Form submitted");
    console.log("Selected row data:", row);

    const body = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      energyConsumed: Number(row[1]) || 0,
      PUE: Number(row[4]) || 1,
      onSiteWUE: Number(row[3]) || 0,
    };

    handleCalculate(body, row[2] || "Unknown");
  };

  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const [showHint, setShowHint] = useState(true);

  return (
    <form className="flex flex-col gap-5">
      <input type="file" accept=".csv" onChange={handleFile} />

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold">CSV format requirements</p>

          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-medium text-green hover:underline"
          >
            {showHint ? "Hide" : "Show"}
          </button>
        </div>

        {showHint && (
          <>
            <ul className="list-disc list-inside space-y-1">
              <li>The first row must be the header</li>
              <li>
                Columns must be in this order:
                <span className="font-mono ml-1">
                  id, energy_consumed, country, wue, pue
                </span>
              </li>
              <li>Values must be separated by commas (,)</li>
              <li>Use dot (.) as decimal separator</li>
              <li className="text-yellow-700">
                The <span className="font-medium">country</span> value must be
                one of the supported countries in the template.
              </li>
              <li>File encoding: UTF-8</li>
            </ul>

            <p className="mt-3 text-xs text-gray-500">
              Clicking a table row will automatically submit the form.
            </p>
          </>
        )}
      </div>

      <a
        href="/waiter-calculator/template.csv"
        download
        className="text-sm text-green hover:underline"
      >
        Download CSV template
      </a>

      <div className="">
        <table className="">
          <thead className="bg-grey">
            <tr>
              {data[0]?.map((cell, i) => (
                <th
                  key={i}
                  className="px-4 py-2 border border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.slice(1).map((row, i) => {
              const rowIndex = i + 1;
              const isSelected = selectedRow === rowIndex;

              return (
                <tr
                  key={rowIndex}
                  onClick={() => {
                    setSelectedRow(rowIndex);

                    handleSubmit(row);
                  }}
                  className={`
              cursor-pointer
              transition-colors
              ${isSelected ? "bg-green/20" : "odd:bg-white even:bg-gray-50"}
              hover:bg-green/10
            `}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-4 py-2 border border-gray-200 text-sm text-gray-700"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </form>
  );
}

export default ReadCSV;
