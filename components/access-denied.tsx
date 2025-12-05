import { Frown } from 'lucide-react';
import Link from 'next/link';

export default function AccessDenied() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <Frown className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">403 دسترسی ندارید!</h2>
      <p>شما اجازه دسترسی به این بخش را ندارید.</p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        بازگشت
      </Link>
    </main>
  );
}
