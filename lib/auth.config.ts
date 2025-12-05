import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isStaticFile =
        nextUrl.pathname.startsWith('/uploads') ||
        nextUrl.pathname.startsWith('/_next/static') ||
        nextUrl.pathname.startsWith('/_next/image');

      if (isStaticFile) {
        return true; // اجازه دسترسی به فایل‌های استاتیک
      }
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },

  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
