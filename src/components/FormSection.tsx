import { useState } from "react";
import CSVForm from "./form/CSVForm/CSVForm";
import CalculatorForm from "./form/CalculatorForm/CalculatorForm";

const FormSection = () => {
  const [csvImport, setCsvImport] = useState(false);

  return (
    <section className="form-section">
      <div className="flex flex-col items-start justify-center">
        <div className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            id="importCsv"
            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            checked={csvImport}
            onChange={() => setCsvImport((prev) => !prev)}
          />
          <label
            htmlFor="importCsv"
            className="text-sm md:text-lg text-secondary cursor-pointer"
          >
            Import with CSV file
          </label>
        </div>
        {csvImport ? <CSVForm /> : <CalculatorForm />}
      </div>
    </section>
  );
};

export default FormSection;
