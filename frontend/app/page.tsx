
import { redirect } from "next/navigation"; // App Router

// Root route now sends users to the login page instead of dashboard
export default function Home() {
  redirect("/login");
}
