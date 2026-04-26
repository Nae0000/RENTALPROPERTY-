type SyncPayload = {
  month: number;
  year: number;
  incomeTotal: number;
  expenseTotal: number;
  occupancyRate: number;
};

export async function syncMonthlySummaryToGoogleSheets(payload: SyncPayload) {
  // Stubbed adapter for first delivery. Replace with googleapis client in production.
  return {
    ok: true,
    provider: "google-sheets",
    syncedAt: new Date().toISOString(),
    payload
  };
}
