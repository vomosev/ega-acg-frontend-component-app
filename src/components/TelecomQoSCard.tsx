export default function TelecomQoSCard({ qos }: any) {

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm">

      <div className="flex items-center justify-between mb-4">

        <h3 className="font-bold text-[#5871A7]">
          QoS Session
        </h3>

        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
          ACTIVE
        </span>
      </div>

      <div className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-500">
            Session ID
          </span>
          <span className="font-semibold">
            {qos.sessionId}
          </span>
        </div>

      </div>
    </div>
  );
}
