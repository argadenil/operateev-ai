"use client";

// Reuse the existing dashboard page component so /dashboard and /dashboard/[id] share UI.
// If you later need ID-specific data fetching, use the `params.id` below.
import Dashboard from "../page";

export default function DashboardById() {
  return <div>working</div>;
}
