"use client";

import { useState } from "react";

import {
  Smartphone,
  Cpu,
  Signal,
  Radio,
  Gauge,
  Zap,
  Activity,
} from "lucide-react";

export default function TelecomMobileMockup() {

  const [deploying, setDeploying] =
    useState(false);

  const [deployment, setDeployment] =
    useState<any>(null);

  const launchInference = async () => {

    try {

      setDeploying(true);

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

      setDeployment(data);

    } catch (err) {

      console.error(err);

    } finally {

      setDeploying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* PHONE MOCKUP */}
      <div className="flex justify-center">

    <div className="
    geo-card
    relative
    w-[390px]
    h-[820px]
    rounded-[55px]
    overflow-hidden
    shadow-2xl
    border border-[#D4D8EA]
    dark:border-[#2E4066]
    ">

          {/* Dynamic island */}
          <div className="
            absolute
            top-3
            left-1/2
            -translate-x-1/2
            w-[150px]
            h-[34px]
            bg-black
            rounded-full
            z-50
          " />

          {/* Phone screen */}
          <div className="
            h-full
            overflow-y-auto
            bg-[#F4F7FB]
          ">

            {/* Header */}
            <div className="
            bg-clgeodrops
            text-white
            px-5
            pt-14
            pb-6
            ">
              <div className="
                flex
                items-center
                justify-between
              ">

                <div>
                  <h2 className="text-2xl font-bold">
                    Edge AI Device
                  </h2>

                  <p className="text-sm text-blue-100 mt-1">
                    CAMARA QoD Active
                  </p>
                </div>

                <Smartphone size={36} />
              </div>
            </div>

            {/* Main content */}
            <div className="p-5 space-y-5">

              {/* Status widgets */}
              <div className="
                grid
                grid-cols-2
                gap-4
              ">

                <Widget
                  icon={<Signal size={18} />}
                  label="Network"
                  value="5G SA"
                />

                <Widget
                  icon={<Gauge size={18} />}
                  label="Latency"
                  value={
                    deployment?.assignedCluster?.latencyMs
                      ? `${deployment.assignedCluster.latencyMs}ms`
                      : "5ms"
                  }
                />

                <Widget
                  icon={<Radio size={18} />}
                  label="Slice"
                  value="LOW_LATENCY"
                />

                <Widget
                  icon={<Cpu size={18} />}
                  label="GPU"
                  value={
                    deployment?.deployment?.gpuEnabled
                      ? "ACTIVE"
                      : "READY"
                  }
                />

              </div>

              {/* AI Action */}
              <div className="
                bg-white
                rounded-3xl
                p-5
                border
                border-[#E2E8F0]
                shadow-sm
              ">

                <div className="
                  flex
                  items-center
                  gap-2
                  mb-4
                ">

                  <Activity
                    className="text-[#5871A7]"
                    size={20}
                  />

                  <h3 className="font-bold text-lg">
                    AI Edge Inference
                  </h3>
                </div>

                <button
                  type="button"
                  disabled={deploying}
                  onClick={launchInference}
                    className="
                    geo-claim-button
                    rounded-full
                    w-full
                    bg-clgeodrops
                    hover:opacity-60
                    duration-200
                    ease-in-out
                    text-white
                    py-4
                    font-semibold
                    "
                >
                  {deploying
                    ? "Deploying AI..."
                    : "Launch AI Workload"}
                </button>

              </div>

              {/* Deployment result */}
              {deployment && (

                <div className="geo-card rounded-3xl p-5 space-y-4">

                  <div className="
                    flex
                    items-center
                    justify-between
                  ">

                    <h3 className="font-bold text-lg">
                      Deployment Status
                    </h3>

                    <span className="
                      px-3
                      py-1
                      rounded-full
                      bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400
                      text-xs
                      font-bold
                    ">
                      RUNNING
                    </span>
                  </div>

                  <InfoRow
                    label="Workload"
                    value={`#${deployment.workloadId}`}
                  />

                  <InfoRow
                    label="Cluster"
                    value={deployment.assignedCluster?.name}
                  />

                  <InfoRow
                    label="Region"
                    value={deployment.assignedCluster?.region}
                  />

                  <InfoRow
                    label="QoS"
                    value={deployment.qosSession?.qosProfile}
                  />

                  <InfoRow
                    label="Bandwidth"
                    value={`${deployment.qosSession?.bandwidthMbps} Mbps`}
                  />

                  <InfoRow
                    label="Latency"
                    value={`${deployment.qosSession?.latencyTargetMs} ms`}
                  />

                </div>
              )}

              {/* AI Analytics */}
              <div className="bg-clgeodrops rounded-3xl p-5 text-white">

                <div className="
                  flex
                  items-center
                  gap-2
                  mb-4
                ">

                  <Zap size={20} />

                  <h3 className="font-bold text-lg">
                    Live AI Analytics
                  </h3>
                </div>

                <div className="space-y-4 text-sm">

                  <AnalyticsBar
                    label="Cell Congestion"
                    value={42}
                  />

                  <AnalyticsBar
                    label="RF Quality"
                    value={91}
                  />

                  <AnalyticsBar
                    label="GPU Utilisation"
                    value={76}
                  />

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="space-y-5">

        <div className="geo-card rounded-3xl p-8">

          <h2 className="
            text-2xl
            font-bold
            text-[#5871A7]
            mb-4
          ">
            Autonomous Edge Orchestration
          </h2>

          <div className="
            text-gray-600
            leading-7
            space-y-3
          ">

            <p>
              This frontend simulates a real mobile
              phone connected to a telecom AI edge
              orchestration platform.
            </p>

            <p>
              AI workloads are dynamically deployed
              to GPU-enabled edge clusters using:
            </p>

            <ul className="
              list-disc
              pl-6
              space-y-2
            ">
              <li>CAMARA QoD APIs</li>
              <li>5G Network Slicing</li>
              <li>Open Gateway APIs</li>
              <li>QUBO Optimisation</li>
              <li>Kubernetes Edge AI</li>
              <li>GPU Orchestration</li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}

function Widget({
  icon,
  label,
  value
}: any) {

  return (
    <div className="geo-card p-4 rounded-2xl">

      <div className="
        flex
        items-center
        justify-between
        mb-2
      ">

        <div className="text-[#5871A7]">
          {icon}
        </div>

        <span className="
          text-[10px]
          text-green-600
          font-bold
        ">
          LIVE
        </span>
      </div>

      <div className="
        text-lg
        font-bold
      ">
        {value}
      </div>

      <div className="
        text-xs
        text-gray-500
        mt-1
      ">
        {label}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value
}: any) {

  return (
    <div className="
      flex
      items-center
      justify-between
      text-sm
      border-b
      pb-2
    ">

      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}

function AnalyticsBar({
  label,
  value
}: any) {

  return (
    <div>

      <div className="
        flex
        justify-between
        mb-1
      ">

        <span>{label}</span>

        <span>{value}%</span>
      </div>

      <div className="
        w-full
        bg-white/20
        rounded-full
        h-2
      ">

        <div
          className="
            bg-white
            h-2
            rounded-full
          "
          style={{
            width: `${value}%`
          }}
        />

      </div>
    </div>
  );
}