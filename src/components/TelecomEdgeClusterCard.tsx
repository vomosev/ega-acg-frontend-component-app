export default function TelecomEdgeClusterCard({ cluster }: any) {

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm">

      <h3 className="font-bold text-[#5871A7] mb-4">
        Edge Cluster
      </h3>

      <div className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-500">
            Cluster
          </span>
          <span className="font-semibold">
            {cluster.name}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Region
          </span>
          <span className="font-semibold">
            {cluster.region}
          </span>
        </div>

      </div>
    </div>
  );
}
