import { NewPassword } from "@/components";
import { Suspense } from "react";

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPassword />
    </Suspense>
  );
}
