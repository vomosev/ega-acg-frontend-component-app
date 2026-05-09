import Link from "next/link";

export default function HomePage() {

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-5xl font-bold text-[#5871A7]">
          EGA Autonomous AI Edge
        </h1>

        <p className="mt-4 text-gray-500">
          CAMARA QoD + Edge AI + Telecom Analytics
        </p>

        <Link
          href="/telecom"
          className="inline-block mt-8 px-6 py-4 bg-[#5871A7] text-white rounded-2xl"
        >
          Open Dashboard
        </Link>

      </div>
    </div>
  );
}
