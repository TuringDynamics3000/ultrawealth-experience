import { LucideIcon, ArrowUpRight, CheckCircle2, ShieldCheck, FileText } from "lucide-react";

export type WowGoalCard = {
  id: string;
  labelTop: "Primary Goal" | "Goal Account";
  goalName: string;

  // Main display metric: choose ONE per card
  primaryMetric: {
    kind: "progressPercent" | "status" | "targetYear";
    value: number | "On track" | "Ahead" | "Behind" | string;
  };

  backgroundImage: {
    src: string;
    alt: string;
  };

  ctaChip: {
    label: string; // goal name or "View goal"
    href: string;  // can be "#", this is demo
  };

  eventPill: {
    icon: "contribution" | "allocation" | "rebalance" | "policy";
    title: "Contribution recorded" | "Income allocated" | "Automatic rebalance completed" | "Risk profile unchanged";
    subtitle: string; // e.g. "Today, 11:28"
    // delta is OPTIONAL and only allowed for contributions
    deltaText?: string; // e.g. "+$1,500"
  };
};

export const WOW_GOAL_CARDS: WowGoalCard[] = [
  {
    id: "card-1",
    labelTop: "Primary Goal",
    goalName: "Home Deposit",
    primaryMetric: {
      kind: "progressPercent",
      value: 38
    },
    backgroundImage: {
      src: "/images/card-lifestyle-1.jpg",
      alt: "Couple looking at laptop in sunlit kitchen"
    },
    ctaChip: {
      label: "Home Deposit",
      href: "#"
    },
    eventPill: {
      icon: "contribution",
      title: "Contribution recorded",
      subtitle: "Today, 09:41",
      deltaText: "+$1,500"
    }
  },
  {
    id: "card-2",
    labelTop: "Goal Account",
    goalName: "Europe Summer",
    primaryMetric: {
      kind: "status",
      value: "On track"
    },
    backgroundImage: {
      src: "/images/card-lifestyle-2.jpg",
      alt: "Man enjoying coffee in a cafe"
    },
    ctaChip: {
      label: "Europe Trip",
      href: "#"
    },
    eventPill: {
      icon: "allocation",
      title: "Income allocated",
      subtitle: "Yesterday, 14:20"
    }
  },
  {
    id: "card-3",
    labelTop: "Goal Account",
    goalName: "Early Retirement",
    primaryMetric: {
      kind: "targetYear",
      value: "2045"
    },
    backgroundImage: {
      src: "/images/card-lifestyle-3.jpg",
      alt: "Woman hiking in nature at sunset"
    },
    ctaChip: {
      label: "Retirement",
      href: "#"
    },
    eventPill: {
      icon: "rebalance",
      title: "Automatic rebalance completed",
      subtitle: "Mon, 10:00"
    }
  }
];
