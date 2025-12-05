import { usePathname } from 'next/navigation';

export default function useCheckActiveNav() {
  const path: string = usePathname();

  const checkActiveNav = (nav: string) => {
    return path === nav;
  };

  return { checkActiveNav };
}
