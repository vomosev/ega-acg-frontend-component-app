"use client";

import { useEffect, useState } from "react";

import {
  Smartphone,
  Cpu,
  Signal,
  Radio,
  Gauge,
  Zap,
  Activity,
  Trash2
} from "lucide-react";

export default function TelecomMobileMockup() {

  const [deploying, setDeploying] =
    useState(false);

  const [terminating, setTerminating] =
    useState(false);

  const [deployment, setDeployment] =
    useState<any>(null);

  const [deploymentStatus, setDeploymentStatus] =
    useState<any>(null);

  const [deploymentLoading, setDeploymentLoading] =
    useState(false);
 
  const [aiResult, setAiResult] =
    useState("");

  const [analytics, setAnalytics] = useState({

    cellCongestion: 0,

    rfQuality: 0,

    gpuUtilisation: 0,
  });

  const [prompt, setPrompt] =
  useState(
    "Analyse telecom congestion"
  );

  // =====================================================
  // LOAD LIVE RAN ANALYTICS
  // =====================================================

  const loadAnalytics = async () => {

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/live-ran`
      );

      if (!res.ok) {

        throw new Error(
          `HTTP ${res.status}`
        );
      }

      const data = await res.json();

      setAnalytics({

        cellCongestion:
          data.cellCongestion ?? 0,

        rfQuality:
          data.rfQuality ?? 0,

        gpuUtilisation:
          data.gpuUtilisation ?? 0,
      });

    } catch (err) {

      console.error(
        "[Analytics Error]",
        err
      );
    }
  };

  // =====================================================
  // LOAD DEPLOYMENT STATUS
  // =====================================================

  const loadDeploymentStatus = async (
    workloadId: number
  ) => {

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/edge/inference-request/${workloadId}`
      );

      if (!res.ok) {

        throw new Error(
          `HTTP ${res.status}`
        );
      }

      const data = await res.json();

      setDeploymentStatus(data);

    } catch (err) {

      console.error(
        "[Deployment Status Error]",
        err
      );
    }
  };

  // =====================================================
  // CREATE AI INFERENCE REQUEST
  // =====================================================

  const launchInference = async () => {

    try {

      setDeploying(true);

      let workloadId: number;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/edge/inference-request`,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            workloadType:
              "radiology-ai",

            verticalType:
              "healthcare",

            modelName:
              "radiology-model",

            requiredLatencyMs:
              10,

            requiredBandwidthMbps:
              500,

            priorityLevel:
              10
          })
        }
      );

      if (!res.ok) {

        throw new Error(
          `HTTP ${res.status}`
        );
      }

      const data = await res.json();

      workloadId = data.workloadId;

      setDeployment(data);

      console.log(
        "[DEPLOYMENT]",
        data
      );

      setDeploymentStatus({

        inferenceStatus:
          "allocating",

        deployment:
          data.deployment
      });

      console.log("[/edge/run-inference]",data);

      try {

        const res =
          await fetch(

            `${process.env.NEXT_PUBLIC_API_URL}/edge/run-inference`,

            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({

                workloadId:
                  workloadId,

                prompt:
                  prompt
              })
            }
          );

        const outputdata =
          await res.json();

setAiResult(
  outputdata.result
);

console.log(
  "[AI]",
  outputdata
);

// =====================================================
// AUTO CLEANUP AFTER SUCCESSFUL AI RESPONSE
// =====================================================

if (workloadId) {

  try {

    await fetch(

      `${process.env.NEXT_PUBLIC_API_URL}/edge/inference-request/${workloadId}`,

      {
        method: "DELETE"
      }
    );

    console.log(
      "[AUTO TERMINATED]",
      workloadId
    );

    setDeploymentStatus({

      inferenceStatus:
        "terminated",

      deploymentName:
        data?.deployment?.deploymentName
    });

  } catch (cleanupErr) {

    console.error(
      "[AUTO TERMINATE ERROR]",
      cleanupErr
    );
  }
}

// =====================================================
// RESTORE UI STATE
// =====================================================

setDeployment(null);

setTerminating(false);

setDeploying(false);

console.log(
  "[Completed]",
  data
);

      } catch (err) {

        console.error(err);
      }

    } catch (err) {

      console.error(
        "[Deployment Error]",
        err
      );

    } finally {

      setDeploying(false);
    }
  };

  // =====================================================
  // TERMINATE DEPLOYMENT
  // =====================================================

  const terminateInference = async () => {

    try {

      if (!deployment?.workloadId) {
        return;
      }

      setTerminating(true);

      const res = await fetch(

        `${process.env.NEXT_PUBLIC_API_URL}/edge/inference-request/${deployment.workloadId}`,

        {
          method: "DELETE"
        }
      );

      if (!res.ok) {

        throw new Error(
          `HTTP ${res.status}`
        );
      }

      const data = await res.json();

      console.log(
        "[TERMINATED]",
        data
      );

      setDeploymentStatus({

        inferenceStatus:
          "terminated",

        deploymentName:
          deployment?.deployment?.deploymentName
      });

    } catch (err) {

      console.error(
        "[Terminate Error]",
        err
      );

    } finally {

      setTerminating(false);
    }
  };

  // =====================================================
  // ANALYTICS POLLING
  // =====================================================

  useEffect(() => {

    loadAnalytics();

    const interval = setInterval(
      loadAnalytics,
      5000
    );

    return () =>
      clearInterval(interval);

  }, []);

  // =====================================================
  // DEPLOYMENT STATUS POLLING
  // =====================================================

  useEffect(() => {

    if (!deployment?.workloadId) {
      return;
    }

    setDeploymentLoading(true);

    loadDeploymentStatus(
      deployment.workloadId
    );

    const interval = setInterval(() => {

      loadDeploymentStatus(
        deployment.workloadId
      );

    }, 3000);

    return () =>
      clearInterval(interval);

  }, [deployment?.workloadId]);

  return (

    <div className="
      grid
      grid-cols-1
      lg:grid-cols-2
      gap-10
    ">

      {/* ================================================= */}
      {/* PHONE MOCKUP */}
      {/* ================================================= */}

      <div className="flex justify-center">

        <div
          className="
            relative
            w-[390px]
            h-[820px]
            rounded-[55px]
            border-[12px]
            border-black
            bg-black
            overflow-hidden
            shadow-2xl
          "
        >

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

                  <h2 className="
                    text-2xl
                    text-clgeodrops
                    font-bold
                  ">
                    Edge AI Device
                  </h2>

                  <p className="
                    text-sm
                    text-clgeodrops
                    mt-1
                  ">
                    CAMARA QoD Active
                  </p>

                </div>

                <Smartphone size={36} />

              </div>
            </div>

            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div className="
              p-5
              space-y-5
            ">

              {/* Status Widgets */}

              {/* <div className="
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
                    deployment?.qosSession?.latencyTargetMs
                      ? `${deployment.qosSession.latencyTargetMs}ms`
                      : "TBC"
                  }
                />

                <Widget
                  icon={<Radio size={18} />}
                  label="Slice"
                  value={
                    deployment?.qosSession?.qosProfile
                      ? deployment.qosSession.qosProfile
                      : "TBC"
                  }
                />

                <Widget
                  icon={<Cpu size={18} />}
                  label="GPU"
                  value={
                    deployment?.deployment?.gpuEnabled
                      ? "ACTIVE"
                      : "TBC"
                  }
                />

              </div> */}

              {/* ================================================= */}
              {/* AI ACTION */}
              {/* ================================================= */}

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

                  <h3 className="
                    font-bold
                    text-lg
                  ">
                    Radiology AI
                  </h3>

                </div>

                <div className="
                  flex
                  flex-col
                  gap-3
                ">

                  <div className="
                    flex
                    flex-col
                    gap-2
                  ">

                    <label className="
                      text-sm
                      font-semibold
                      text-gray-700
                    ">
                      AI Prompt
                    </label>

                    <textarea
                      value={prompt}
                      onChange={(e) =>
                        setPrompt(
                          e.target.value
                        )
                      }
                      placeholder="Enter AI inference prompt..."
                      className="
                        w-full
                        min-h-[120px]
                        rounded-2xl
                        border
                        border-[#D4D8EA]
                        p-4
                        text-sm
                        outline-none
                        resize-none
                        focus:border-[#5871A7]
                        focus:ring-2
                        focus:ring-[#5871A7]/20
                        bg-white
                      "
                    />

                  </div>

                  <button
                    type="button"
                    disabled={deploying}
                    hidden={deployment && !aiResult}
                    onClick={launchInference}
                    className="
                      geo-claim-button
                      rounded-full
                      w-full
                      button-clgeodrops
                      hover:opacity-60
                      duration-200
                      ease-in-out
                      text-white
                      py-4
                      font-semibold
                    "
                  >

                    {
                      deploying
                        ? "Submitting..."
                        : "Submit Request"
                    }

                  </button>

                  {deployment && !aiResult && (

                    <button
                      type="button"
                      disabled={terminating}
                      onClick={terminateInference}
                      className="
                        rounded-full
                        w-full
                        bg-red-500
                        hover:bg-red-600
                        duration-200
                        ease-in-out
                        text-white
                        py-4
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >

                      <Trash2 size={18} />

                      {
                        terminating
                          ? "Canceling..."
                          : "Cancel Request"
                      }

                    </button>

                  )}

                </div>

              </div>

              {/* ================================================= */}
              {/* DEPLOYMENT STATUS */}
              {/* ================================================= */}

              {deployment && (

                <div className="
                  geo-card
                  rounded-3xl
                  p-5
                  space-y-4
                ">

                  <div className="
                    flex
                    items-center
                    justify-between
                  ">

                    <h3 className="
                      font-bold
                      text-lg
                    ">
                      Deployment Status
                    </h3>

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-bold

                        ${
                          deploymentStatus?.inferenceStatus === "running"
                            ? "bg-green-100 text-green-700"

                            : deploymentStatus?.inferenceStatus === "allocating"
                            ? "bg-yellow-100 text-yellow-700"

                            : deploymentStatus?.inferenceStatus === "terminated"
                            ? "bg-red-100 text-red-700"

                            : "bg-gray-100 text-gray-700"
                        }
                      `}
                    >

                      {
                        deploymentStatus?.inferenceStatus
                          ?.toUpperCase()

                          ||

                        "ALLOCATING"
                      }

                    </span>

                  </div>

                  <InfoRow
                    label="Workload"
                    value={`#${deploymentStatus?.id || deployment.workloadId}`}
                  />

                  <InfoRow
                    label="Deployment"
                    value={
                      deploymentStatus?.deploymentName
                        || "Pending"
                    }
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

              {/* ================================================= */}
              {/* LIVE AI ANALYTICS */}
              {/* ================================================= */}

              <div className="
                bg-clgeodrops
                rounded-3xl
                p-5
                text-white
              ">

                <div className="
                  flex
                  items-center
                  gap-2
                  mb-4
                ">

                  <Zap size={20} />

                  <h3 className="
                    font-bold
                    text-clgeodrops
                    text-lg
                  ">
                    Live AI Analytics
                  </h3>

                </div>

                <div className="
                  space-y-4
                  text-clgeodrops
                  text-sm
                ">

                  <AnalyticsBar
                    label="Cell Congestion"
                    value={analytics.cellCongestion}
                  />

                  <AnalyticsBar
                    label="RF Quality"
                    value={analytics.rfQuality}
                  />

                  <AnalyticsBar
                    label="GPU Utilisation"
                    value={analytics.gpuUtilisation}
                  />

                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* RIGHT PANEL */}
      {/* ================================================= */}

      <div className="space-y-5">

        <div className="
          geo-card
          rounded-3xl
          p-8
        ">

          <h2 className="
            text-2xl
            font-bold
            text-clgeodrops
            mb-4
          ">
            Autonomous Edge Orchestration
          </h2>

          <div className="
            text-clgeodrops
            leading-7
            space-y-3
          ">

            <p>
              The bursty nature of AI workloads means user demand will be vastly different from typical workloads that 5G networks were built for. This making them a perfect fit for edge computing, but also presents unique challenges for orchestration and management.
            </p>

            <p>
              Sending workload requests to the network edge removes the inefficiens of sending them all the way to the core, which would mean increased latency and response times, adversely affecting the user experience. This pages shows the user interface for an autonomous edge orchestration platform, which has been designed to address the aforementioned challenges.
            </p>

            <ul className="
              list-disc
              pl-6
              space-y-2
            ">

              <li>The request information button sends an AI inference request to the edge platform.</li>

              <li>This is assigned to a specific edge cluster.</li>

              <li>A specific workdload is deployed.</li>

              <li>The deployment is managed by Kubernetes.</li>

              <li>On completion data is returned.</li>

              <li>This can also be cancelled on demand.</li>

            </ul>

          {
            aiResult && (

              <div className="
                geo-card
                rounded-3xl
                p-5
                whitespace-pre-wrap
              ">

                <h3 className="
                  font-bold
                  mb-3
                ">
                  AI Result
                </h3>

                <p className="text-sm">
                  {aiResult}
                </p>

              </div>
            )
          }

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

    <div className="
      geo-card
      p-4
      rounded-2xl
    ">

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