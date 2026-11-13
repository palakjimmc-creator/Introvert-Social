import {BATTERY_STATUS_COPY} from '../data/loungeData';

interface SocialBatteryWidgetProps {
  level: number;
  onSetLevel: (nextLevel: number, reason: string) => void;
  compact?: boolean;
}

export function SocialBatteryWidget({level, onSetLevel, compact = false}: SocialBatteryWidgetProps) {
  const segments = 10;
  const activeSegments = Math.round(level / 10);
  const status = BATTERY_STATUS_COPY(level);

  const getSegmentColor = (index: number, isFilled: boolean) => {
    if (!isFilled) return 'bg-[#F7F5F0] border-[#E2DDD5]';
    if (level <= 25) return 'bg-[#E07A5F] border-[#C86147]';
    if (index >= 7) return 'bg-[#8FA89B] border-[#728D80]';
    if (index >= 3) return 'bg-[#728D80] border-[#627B6E]';
    return 'bg-[#E07A5F] border-[#C86147]';
  };

  return (
    <div className="bg-[#EFECE6] border border-[#E2DDD5] rounded-md p-5">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5A585F]">
            Social Battery Barometer
          </p>
          <h3 className="font-serif text-xl font-medium text-[#1E1E24] mt-0.5">
            {status.title}
          </h3>
        </div>
        <span
          className={`tabular-nums text-lg font-semibold ${
            status.low ? 'text-[#C86147]' : 'text-[#486156]'
          }`}
        >
          {level}%
        </span>
      </div>

      <div
        className="grid grid-cols-10 gap-1.5 mb-3"
        role="group"
        aria-label="Set social battery level"
      >
        {Array.from({length: segments}, (_, idx) => {
          const targetPercent = (idx + 1) * 10;
          const isFilled = idx < activeSegments;
          return (
            <button
              key={targetPercent}
              type="button"
              onClick={() => onSetLevel(targetPercent, `Manual check-in (${targetPercent}%)`)}
              aria-label={`Set social battery to ${targetPercent}%`}
              className={`h-7 sm:h-8 rounded-full border transition-all duration-150 cursor-pointer hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#728D80] ${getSegmentColor(
                idx,
                isFilled
              )}`}
            />
          );
        })}
      </div>

      {!compact && (
        <p className="text-[14px] leading-relaxed text-[#5A585F]">
          {status.note}
        </p>
      )}
    </div>
  );
}
