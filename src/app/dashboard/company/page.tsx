import { CompanyPrepClient } from "./CompanyPrepClient";

export default function CompanyPrepPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Company Prep</h1>
        <p className="text-neutral-400">Search for specific companies to get tailored interview structures and focus areas.</p>
      </div>
      <CompanyPrepClient />
    </div>
  );
}
