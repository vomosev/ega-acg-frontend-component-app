export default function TelecomSignalWidget({
  icon,
  label,
  value
}: any) {

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">

      <div className="flex items-center justify-between mb-2">

        <div className="text-[#5871A7]">
          {icon}
        </div>

        <span className="text-xs text-gray-400">
          LIVE
        </span>
      </div>

      <div>
        <div className="text-lg font-bold text-gray-800">
          {value}
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}
