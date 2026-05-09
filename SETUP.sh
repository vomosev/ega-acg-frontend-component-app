#!/bin/bash

# =============================================================================
# EGA Autonomous AI Edge Frontend Installer
# =============================================================================

APP_DIR="/var/www/html/ega-acg-frontend-component-app"

echo "======================================================="
echo "Creating frontend application..."
echo "======================================================="

mkdir -p $APP_DIR

cd $APP_DIR || exit

# =============================================================================
# INITIALISE NEXT.JS APP
# =============================================================================

echo "======================================================="
echo "Initialising Next.js application..."
echo "======================================================="

npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm

# =============================================================================
# INSTALL DEPENDENCIES
# =============================================================================

echo "======================================================="
echo "Installing dependencies..."
echo "======================================================="

npm install \
  lucide-react \
  recharts \
  react-hot-toast

# =============================================================================
# CREATE FOLDERS
# =============================================================================

mkdir -p src/app/telecom
mkdir -p src/components
mkdir -p src/styles

# =============================================================================
# ENV FILE
# =============================================================================

echo "======================================================="
echo "Creating .env.local..."
echo "======================================================="

cat > .env.local <<'EOF'
NEXT_PUBLIC_API_URL=https://nodejs.gridiron-app.com
NEXT_PUBLIC_MAPS_API_KEY=AIzaSyD4tOa3WyCovqis2DzMLbX6PmSYyZKvLO8
EOF

# =============================================================================
# PAGE.TSX
# =============================================================================

cat > src/app/telecom/page.tsx <<'EOF'
"use client";

import TelecomMobileMockup from "@/components/TelecomMobileMockup";

export default function TelecomDashboardPage() {

  return (
    <div className="registration-page-template1 min-h-screen p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        <div>
          <h1 className="text-4xl font-semibold text-clgeodrops">
            Autonomous AI Edge Platform
          </h1>

          <p className="text-gray-500 mt-2">
            CAMARA QoD + Open Gateway + AI Edge Orchestration
          </p>
        </div>

        <TelecomMobileMockup />

      </div>
    </div>
  );
}
EOF

# =============================================================================
# TELECOM MOBILE MOCKUP
# =============================================================================

cat > src/components/TelecomMobileMockup.tsx <<'EOF'
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

          <divclassName="h-fulloverflow-y-autoregistration-page-template1bg-[#F4F7FB]dark:bg-[#0B1120]">

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
EOF

# =============================================================================
# TELECOM SIGNAL WIDGET
# =============================================================================

cat > src/components/TelecomSignalWidget.tsx <<'EOF'
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
EOF

# =============================================================================
# TELECOM QOS CARD
# =============================================================================

cat > src/components/TelecomQoSCard.tsx <<'EOF'
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
EOF

# =============================================================================
# TELECOM EDGE CLUSTER CARD
# =============================================================================

cat > src/components/TelecomEdgeClusterCard.tsx <<'EOF'
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
EOF

# =============================================================================
# LATENCY CHART
# =============================================================================

cat > src/components/TelecomLatencyChart.tsx <<'EOF'
"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "12:00", latency: 8 },
  { time: "12:05", latency: 6 },
  { time: "12:10", latency: 5 },
  { time: "12:15", latency: 7 },
  { time: "12:20", latency: 4 },
];

export default function TelecomLatencyChart() {

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm">

      <h3 className="font-bold text-[#5871A7] mb-4">
        Live Latency Analytics
      </h3>

      <div className="h-[180px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <XAxis dataKey="time" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="latency"
              stroke="#5871A7"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>
      </div>
    </div>
  );
}
EOF

# =============================================================================
# RUN
# =============================================================================

echo "======================================================="
echo "Frontend created successfully"
echo "======================================================="
echo ""
echo "Application Path:"
echo "$APP_DIR"
echo ""
echo "Run:"
echo "cd $APP_DIR"
echo "npm run dev"
echo ""
echo "Open:"
echo "https://telco.geo-drops.com/telecom"
echo ""
