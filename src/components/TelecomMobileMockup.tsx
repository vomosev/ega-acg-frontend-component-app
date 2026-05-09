"use client";

import { useEffect, useState } from "react";

import {
  Smartphone,
  Activity,
  Radio,
  Cpu,
  Signal,
  Gauge,
  Server,
  Zap,
  MapPin,
} from "lucide-react";

import TelecomQoSCard from "./TelecomQoSCard";
import TelecomEdgeClusterCard from "./TelecomEdgeClusterCard";
import TelecomSignalWidget from "./TelecomSignalWidget";
import TelecomLatencyChart from "./TelecomLatencyChart";

interface BackendResponse {
  success: boolean;
  workloadId: number;
  assignedCluster: any;
  qosSession: any;
  deployment: any;
}

export default function TelecomMobileMockup() {

  const [loading, setLoading] = useState(false);

  const [response, setResponse] =
    useState<BackendResponse | null>(null);

  const [deviceInfo, setDeviceInfo] =
    useState<any>(null);

  useEffect(() => {

    const loadDeviceInfo = async () => {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/device/context`
        );

        const data = await res.json();

        setDeviceInfo(data);

      } catch (err) {
        console.error(err);
      }
    };

    loadDeviceInfo();

  }, []);

  const startInference = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/edge/inference-request`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            workloadType: "radiology-ai",
            verticalType: "healthcare",
            modelName: "radiology-model",
            requiredLatencyMs: 10,
            requiredBandwidthMbps: 500,
            priorityLevel: 10
          })
        }
      );

      const data = await res.json();

      setResponse(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      <div className="flex justify-center">

        <div className="w-[390px] h-[800px] rounded-[50px] border-[12px] border-black bg-black shadow-2xl overflow-hidden relative">

          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[140px] h-[32px] bg-black rounded-full z-50 border border-gray-800" />

          <div className="h-full bg-[#F4F7FB] overflow-y-auto">

            <div className="bg-[#5871A7] px-5 pt-14 pb-5 text-white">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-2xl font-bold">
                    AI Edge Device
                  </h2>

                  <p className="text-sm text-blue-100 mt-1">
                    CAMARA QoD Active
                  </p>
                </div>

                <Smartphone size={34} />
              </div>
            </div>

            <div className="p-5 space-y-5">

              <div className="grid grid-cols-2 gap-3">

                <TelecomSignalWidget
                  icon={<Signal size={18} />}
                  label="Signal"
                  value="5G SA"
                />

                <TelecomSignalWidget
                  icon={<Gauge size={18} />}
                  label="Latency"
                  value={
                    response?.assignedCluster?.latencyMs
                      ? `${response.assignedCluster.latencyMs}ms`
                      : "--"
                  }
                />

                <TelecomSignalWidget
                  icon={<Radio size={18} />}
                  label="Slice"
                  value="LOW_LATENCY"
                />

                <TelecomSignalWidget
                  icon={<Cpu size={18} />}
                  label="GPU"
                  value={
                    response?.deployment?.gpuEnabled
                      ? "Enabled"
                      : "--"
                  }
                />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={startInference}
                className="w-full bg-[#5871A7] hover:bg-[#4560A0] text-white rounded-3xl py-4 font-semibold transition-all shadow-lg"
              >
                {loading
                  ? "Deploying AI Workload..."
                  : "Launch Edge Inference"}
              </button>

              {response?.qosSession && (
                <TelecomQoSCard
                  qos={response.qosSession}
                />
              )}

              {response?.assignedCluster && (
                <TelecomEdgeClusterCard
                  cluster={response.assignedCluster}
                />
              )}

              {response && (
                <TelecomLatencyChart />
              )}

            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">

        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">

          <div className="flex items-center gap-2 mb-4">
            <Server className="text-[#5871A7]" />
            <h3 className="text-xl font-bold">
              Edge Orchestration Status
            </h3>
          </div>

          {response ? (
            <div className="space-y-4 text-sm">

              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-gray-500">
                  Workload ID
                </span>
                <span className="font-bold">
                  #{response.workloadId}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-gray-500">
                  Cluster
                </span>
                <span className="font-bold text-[#5871A7]">
                  {response.assignedCluster?.name}
                </span>
              </div>

            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              No active workloads.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
