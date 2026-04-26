import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Sign In</h1>
        <p className="text-sm text-muted-foreground">
          Connect NextAuth provider and replace this page with secure login flow.
        </p>
        <Button asChild>
          <Link href="/dashboard">Continue to Dashboard</Link>
        </Button>
      </Card>
    </div>
  );
}
