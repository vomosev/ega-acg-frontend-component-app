import Link from "next/link";

export default function HomePage() {

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="text-center">

        <h1 className="heading-clgeodrops text-5xl font-bold text-[#5871A7]">
          EGA Autonomous AI Edge
        </h1>

        <p className="heading-clgeodrops mt-4 text-gray-500">
          CAMARA QoD + Edge AI + Telecom Analytics
        </p>

        <Link
          href="/user"
          className="button-clgeodrops inline-block mt-8 px-6 py-4 bg-[#5871A7] rounded-2xl"
        >
          User Dashboard
        </Link>
        
        {" "}
        
        <Link
          href="/telecom"
          className="button-clgeodrops inline-block mt-8 px-6 py-4 bg-[#5871A7] rounded-2xl"
        >
          Telecom Dashboard
        </Link>

      </div>
    </div>
  );
}
