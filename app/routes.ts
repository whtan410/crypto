import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("navigation-demo", "routes/navigation-demo.tsx"),
  route("deposit-history", "routes/deposit-history.tsx"),
  route("accounts", "routes/accounts.tsx"),
  route("mock-transaction", "routes/mock-transaction.tsx"),
  route("mock-balance-update", "routes/mock-balance-update.tsx"),
  route("mock-withdrawal-request", "routes/mock-withdrawal-request.tsx"),
  route("mock-deposit-request", "routes/mock-deposit-request.tsx"),
  route("mock-freeze", "routes/mock-freeze.tsx"),
] satisfies RouteConfig;
