import Link from 'next/link';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <Link 
      href={href} 
      className="text-gray-700 font-medium hover:text-[#00D1FF] transition-colors"
    >
      {children}
    </Link>
  );
};