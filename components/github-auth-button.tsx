'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from './ui/button';
import { Icons } from './icons';
import { Suspense } from 'react';
function GitHubSignInButtonComponent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        signIn('github', { callbackUrl: callbackUrl ?? '/dashboard' })
      }
    >
      <Icons.gitHub className="ml-2 h-4 w-4" />
      با گیت هاب وارد شوید
    </Button>
  );
}

export default function GitHubSignInButton() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GitHubSignInButtonComponent />
    </Suspense>
  );
}
