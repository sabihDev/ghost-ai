import { SignIn } from "@clerk/nextjs";

import { AuthPageShell } from "@/components/auth/auth-page-shell";

export default function SignInPage() {
  return (
    <AuthPageShell>
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/editor"
      />
    </AuthPageShell>
  );
}
