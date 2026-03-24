import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#0284C7' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    to: '/track',
    label: 'Track',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#0284C7' : 'none'} stroke={active ? '#0284C7' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
      </svg>
    ),
  },
  {
    to: '/checkin',
    label: 'Check-In',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#0284C7' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    to: '/learn',
    label: 'Learn',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#0284C7' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
  },
  {
    to: '/more',
    label: 'More',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#0284C7' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
  },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-morning-mist z-40">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 min-h-[56px] min-w-[56px] justify-center transition-colors ${
                isActive ? 'text-still-water' : 'text-text-secondary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.icon(isActive)}
                <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
