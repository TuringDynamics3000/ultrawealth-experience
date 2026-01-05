import { createContext, useContext, useState, ReactNode } from "react";

type AccountContext = "personal" | "business";

interface AccountContextType {
  context: AccountContext;
  setContext: (context: AccountContext) => void;
  cash: {
    personal: number;
    business: number;
  };
  crypto: {
    BTC: number;
    ETH: number;
  };
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<AccountContext>("personal");

  // Mock data - in production this would come from API
  const cash = {
    personal: 18420,
    business: 45230,
  };

  const crypto = {
    BTC: 0.25,
    ETH: 3.0,
  };

  return (
    <AccountContext.Provider value={{ context, setContext, cash, crypto }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
