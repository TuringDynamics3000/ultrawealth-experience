import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AccountProvider } from "./contexts/AccountContext";

// New Spec Pages
import Home from "./pages/Home";
import InvestingIntent from "./pages/InvestingIntent";
import GoalCreation from "./pages/GoalCreation";
import RuleRegistration from "./pages/RuleRegistration";
import GoalBuilder from "./pages/GoalBuilder";
import Portfolio from "./pages/Portfolio";
import TradeTicket from "./pages/TradeTicket";
import TradeReview from "./pages/TradeReview";
import OrderStatus from "./pages/OrderStatus";
import ActivityTimeline from "./pages/ActivityTimeline";
import ActivityDetail from "./pages/ActivityDetail";
import Business from "./pages/Business";
import Transfer from "./pages/Transfer";
import SurplusCashAmount from "./pages/SurplusCashAmount";


function Router() {
  return (
    <Switch>
      {/* Screen 0 — Landing */}
      <Route path={"/"} component={Home} />
      
      {/* Business Landing */}
      <Route path={"/business"} component={Business} />
      
      {/* Screen 1 — Investing Intent */}
      <Route path={"/invest"} component={InvestingIntent} />
      
      {/* Surplus Cash Amount Input */}
      <Route path={"/invest/surplus-amount"} component={SurplusCashAmount} />
      
      {/* Screen 2 — Goal Creation */}
      <Route path={"/goals/new"} component={GoalCreation} />
      
      {/* Screen 3 — Goal Builder (Constraint Authoring) */}
      <Route path={"/goals/:id/builder"} component={GoalBuilder} />
      
      {/* Screen 4 — Rule Registration */}
      <Route path={"/goals/:id/registered"} component={RuleRegistration} />
      
      {/* Screen 4 — Portfolio Context */}
      <Route path={"/portfolio"} component={Portfolio} />
      
      {/* Screen 5 — Trade Ticket */}
      <Route path={"/trade"} component={TradeTicket} />
      
      {/* Screen 6 — Pre-Trade Review */}
      <Route path={"/trade/review"} component={TradeReview} />
      
      {/* Screen 7 — Execution Status */}
      <Route path={"/orders/:id"} component={OrderStatus} />
      
      {/* Activity Timeline */}
      <Route path={"/activity"} component={ActivityTimeline} />
      
      {/* Activity Detail */}
      <Route path={"/activity/:id"} component={ActivityDetail} />
      
      {/* Transfer */}
      <Route path={"/transfer"} component={Transfer} />
      
      {/* Profile placeholder */}
      <Route path={"/profile"} component={Portfolio} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <AccountProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AccountProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
