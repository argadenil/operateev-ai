"use client";

// Reuse the existing dashboard page component so /dashboard and /dashboard/[id] share UI.
// If you later need ID-specific data fetching, use the `params.id` below.
import Dashboard from "../page";

export default function DashboardById({ params }: { params: { id: string } }) {
  // Placeholder: you can pass the ID down or trigger a fetch using params.id.
  // console.log('Dashboard ID route param:', params.id);
  return <Dashboard />;
}
