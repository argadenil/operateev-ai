"use client";

// Reuse the existing GPU resources page component so /gpu-resources and /gpu-resources/[id] share UI.
// If later you need ID-specific fetching, read params.id here and pass it down or trigger a fetch.
import GPUResourcesPage from "../page";

export default function GPUResourcesById() {
  return <GPUResourcesPage />;
}
