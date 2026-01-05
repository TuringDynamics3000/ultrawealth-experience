import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useAccount } from "@/contexts/AccountContext";
import { ChevronRight, FileText, Settings, Target, AlertCircle, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, CreditCard, Bitcoin } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "trade" | "rule" | "goal" | "system" | "funds_added" | "funds_withdrawn" | "transfer" | "fee" | "crypto";
  title: string;
  description: string;
  timestamp: string;
  context?: "personal" | "business" | "both";
}

interface ActivityGroup {
  date: string;
  items: ActivityItem[];
}

const ACTIVITY_DATA: ActivityGroup[] = [
  {
    date: "Today",
    items: [
      {
        id: "act-839210",
        type: "funds_added",
        title: "Funds added",
        description: "$5,000 deposited via bank transfer",
        timestamp: "2:15 PM",
        context: "personal",
      },
      {
        id: "act-839204",
        type: "trade",
        title: "Trade placed by you",
        description: "Buy 25 units of VAS · Settled via Cash",
        timestamp: "10:41 AM",
        context: "personal",
      },
    ],
  },
  {
    date: "Yesterday",
    items: [
      {
        id: "act-839200",
        type: "crypto",
        title: "Crypto trade settled",
        description: "Buy 0.05 BTC · Settled via Cash",
        timestamp: "4:30 PM",
        context: "personal",
      },
      {
        id: "act-839198",
        type: "rule",
        title: "Rule applied",
        description: "Maximum allocation enforced",
        timestamp: "3:22 PM",
        context: "personal",
      },
      {
        id: "act-839196",
        type: "transfer",
        title: "Transfer completed",
        description: "$10,000 · Personal → Business",
        timestamp: "1:00 PM",
        context: "both",
      },
      {
        id: "act-839195",
        type: "goal",
        title: "Goal updated by you",
        description: "Home Deposit target changed",
        timestamp: "11:15 AM",
        context: "personal",
      },
    ],
  },
  {
    date: "3 Jan 2026",
    items: [
      {
        id: "act-839185",
        type: "fee",
        title: "Fee charged",
        description: "Platform fee · $9.50",
        timestamp: "5:00 PM",
        context: "business",
      },
      {
        id: "act-839180",
        type: "trade",
        title: "Trade placed by you",
        description: "Sell 10 units of IOO · Settled via Cash",
        timestamp: "2:30 PM",
        context: "business",
      },
      {
        id: "act-839178",
        type: "funds_withdrawn",
        title: "Funds withdrawn",
        description: "$2,000 to linked bank account",
        timestamp: "11:00 AM",
        context: "personal",
      },
      {
        id: "act-839175",
        type: "system",
        title: "System action",
        description: "Dividend reinvested automatically",
        timestamp: "9:00 AM",
        context: "personal",
      },
    ],
  },
  {
    date: "2 Jan 2026",
    items: [
      {
        id: "act-839165",
        type: "crypto",
        title: "Crypto trade settled",
        description: "Buy 1.5 ETH · Settled via Cash",
        timestamp: "5:45 PM",
        context: "personal",
      },
      {
        id: "act-839160",
        type: "rule",
        title: "Action blocked by rule",
        description: "Trade exceeded allocation limit",
        timestamp: "4:15 PM",
        context: "personal",
      },
      {
        id: "act-839155",
        type: "goal",
        title: "Goal created by you",
        description: "Home Deposit — $150,000 by Dec 2028",
        timestamp: "10:00 AM",
        context: "personal",
      },
    ],
  },
];

const getIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "trade":
      return FileText;
    case "rule":
      return Settings;
    case "goal":
      return Target;
    case "system":
      return AlertCircle;
    case "funds_added":
      return ArrowDownLeft;
    case "funds_withdrawn":
      return ArrowUpRight;
    case "transfer":
      return ArrowLeftRight;
    case "fee":
      return CreditCard;
    case "crypto":
      return Bitcoin;
    default:
      return FileText;
  }
};

export default function ActivityTimeline() {
  const [, setLocation] = useLocation();
  const { context } = useAccount();

  // Filter activity by current context
  const filteredData = ACTIVITY_DATA.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.context || item.context === context || item.context === "both"
    ),
  })).filter((group) => group.items.length > 0);

  const handleViewDetails = (activityId: string) => {
    setLocation(`/activity/${activityId}`);
  };

  const contextLabel = context === "personal" ? "Personal" : "Business";

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto px-5 py-8">
        
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-black mb-2">
          Activity
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Showing {contextLabel} activity
        </p>

        {/* Activity Timeline */}
        <div className="space-y-8">
          {filteredData.map((group) => (
            <div key={group.date}>
              {/* Date Header */}
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
                {group.date}
              </p>

              {/* Activity Items */}
              <div className="space-y-3">
                {group.items.map((item) => {
                  const Icon = getIcon(item.type);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleViewDetails(item.id)}
                      className="w-full bg-gray-50 rounded-2xl p-4 text-left hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>

                        {/* Content */}
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium text-black mb-0.5">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {item.description}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-gray-400">
                            {item.timestamp}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No activity yet</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
