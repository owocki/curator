interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
}

export function StatCard({ label, value, subValue }: StatCardProps) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
    </div>
  );
}
