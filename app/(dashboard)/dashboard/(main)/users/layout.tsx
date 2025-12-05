import Authorization from '@/components/HOC/authorization';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn',
};

interface UsersLayoutProps {
  children: React.ReactNode;
}

const UsersLayout: React.FC<UsersLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

const Layout: React.FC<UsersLayoutProps> = (props) => {
  return (
    <Authorization routeSlug="users">
      <UsersLayout>{props.children}</UsersLayout>
    </Authorization>
  );
};

export default Layout;
