import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("navigation-demo", "routes/navigation-demo.tsx"),
  route("account", "routes/account.tsx"),
  route("role", "routes/role.tsx"),
  route("deposit-history", "routes/deposit-history.tsx"),
  route("withdrawal-history", "routes/withdrawal-history.tsx"),
  route("bank-transaction", "routes/bank-transaction.tsx"),
  route("merchant-profile", "routes/merchant-profile.tsx"),
  route("success-rate", "routes/success-rate.tsx"),
  route("manual-match", "routes/manual-match.tsx"),
  route("activity-log", "routes/activity-log.tsx"),
  route("accounts", "routes/accounts.tsx"),
  route("mock-tabs", "routes/mock-tabs.tsx"),
  route("mock-transaction", "routes/mock-transaction.tsx"),
  route("mock-balance-update", "routes/mock-balance-update.tsx"),
  route("mock-withdrawal-request", "routes/mock-withdrawal-request.tsx"),
  route("mock-deposit-request", "routes/mock-deposit-request.tsx"),
  route("mock-freeze", "routes/mock-freeze.tsx"),
] satisfies RouteConfig;
