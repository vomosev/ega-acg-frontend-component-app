"use client";

import UserMobileMockup from "@/components/UserMobileMockup";

export default function UserPage() {

  return (
    <div className="registration-page-template1 min-h-screen p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        <div>
          <h1 className="text-4xl font-semibold heading-clgeodrops">
            Autonomous AI Edge Platform
          </h1>

          <p className="text-clgeodrops mt-2">
            User QoD
          </p>
        </div>

        <UserMobileMockup />

      </div>
    </div>
  );
}