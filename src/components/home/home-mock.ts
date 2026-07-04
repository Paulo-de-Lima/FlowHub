export type HomeBillingPreview = {
  region: string;
  subtitle: string;
};

export type HomeMockData = {
  finance: {
    revenue: number;
    expenses: number;
    profit: number;
  };
  kpis: {
    clients: number;
    billings: number;
    criticalStock: number;
  };
  nextBilling: HomeBillingPreview | null;
  pendingMaintenanceCount: number;
};

export const HOME_MOCK: HomeMockData = {
  finance: {
    revenue: 0,
    expenses: 0,
    profit: 0,
  },
  kpis: {
    clients: 0,
    billings: 0,
    criticalStock: 0,
  },
  nextBilling: null,
  pendingMaintenanceCount: 0,
};
