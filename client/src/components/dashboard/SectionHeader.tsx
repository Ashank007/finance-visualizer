"use client";
import { MdRefresh } from 'react-icons/md';


export default function SectionHeader({
  title,
  subtitle,
  onRefresh,
  className = "",
}: {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${className} pb-3`}>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 text-sm text-cyan-300 hover:text-white px-3 py-1 rounded-md"
          aria-label="Refresh"
        >
          <MdRefresh className="h-5 w-5" />
          Refresh
        </button>
      )}
    </div>
  );
}
