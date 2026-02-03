interface ResultCardProps {
  img: string;
  result: string;
  label: string;
}

export const ResultCard = ({ img, result, label }: ResultCardProps) => {
  return (
    <div className="w-full h-full flex flex-col gap-3 rounded-lg py-3 px-4 md:px-6 shadow-lg items-center justify-between text-center">
      <p className="font-medium text-md md:text-lg">{label}</p>

      <img src={img} className="w-16 h-16 md:w-20 md:h-20" />

      <p className="text-md md:text-lg">{result}</p>
    </div>
  );
};
