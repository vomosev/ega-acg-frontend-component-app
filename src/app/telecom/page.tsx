"use client";

import TelecomMobileMockup from "@/components/TelecomMobileMockup";

export default function TelecomPage() {

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0B1120] p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        <div>
          <h1 className="text-4xl font-bold text-[#5871A7]">
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