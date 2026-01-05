import { WowGoalCard as WowGoalCardType } from "@/data/wowCards.data";
import { ArrowUpRight, CheckCircle2, ShieldCheck, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WowGoalCardProps {
  card: WowGoalCardType;
  className?: string;
}

const EVENT_ICONS = {
  contribution: ArrowUpRight,
  allocation: CheckCircle2,
  rebalance: ShieldCheck,
  policy: FileText
};

export function WowGoalCard({ card, className }: WowGoalCardProps) {
  const Icon = EVENT_ICONS[card.eventPill.icon];

  return (
    <div className={cn(
      "relative w-full h-[480px] rounded-[32px] overflow-hidden group select-none",
      "transition-transform duration-300 hover:-translate-y-1",
      className
    )}>
      {/* Background Image */}
      <img 
        src={card.backgroundImage.src} 
        alt={card.backgroundImage.alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Gradient Overlay - Top to Bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* Content Container */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        
        {/* Top Section */}
        <div className="flex flex-col gap-1">
          <span className="text-white/80 text-xs font-medium tracking-wide uppercase">
            {card.labelTop}
          </span>
          
          {/* Primary Metric */}
          <div className="text-white font-bold text-4xl tracking-tight mt-1">
            {card.primaryMetric.kind === "progressPercent" && `${card.primaryMetric.value}% funded`}
            {card.primaryMetric.kind === "status" && card.primaryMetric.value}
            {card.primaryMetric.kind === "targetYear" && `Target ${card.primaryMetric.value}`}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4">
          
          {/* CTA Chip */}
          <div className="self-start">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 flex items-center gap-2 text-white font-medium text-sm transition-colors hover:bg-white/30 cursor-pointer">
              {card.ctaChip.label}
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Event Pill */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6F6A63]">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#111827] text-sm font-semibold leading-tight">
                  {card.eventPill.title}
                </span>
                <span className="text-[#6B7280] text-xs font-medium">
                  {card.eventPill.subtitle}
                </span>
              </div>
            </div>
            
            {/* Delta Text (Optional) */}
            {card.eventPill.deltaText && (
              <div className="text-[#059669] text-sm font-bold bg-[#ECFDF5] px-2 py-1 rounded-md">
                {card.eventPill.deltaText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
