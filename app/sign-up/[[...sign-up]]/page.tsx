import { SignUp } from "@clerk/nextjs";

import { AuthPageShell } from "@/components/auth/auth-page-shell";

export default function SignUpPage() {
  return (
    <AuthPageShell>
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/editor"
      />
    </AuthPageShell>
  );
}
