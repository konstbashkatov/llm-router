import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Пользователи', href: '/users', icon: Users },
  { name: 'Чат', href: 'https://o2gpt.o2it.ru', icon: MessageSquare, external: true },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">O2GPT Admin</h1>
        <p className="text-sm text-gray-500 mt-1">Панель управления</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          item.external ? (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </a>
          ) : (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          )
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          O2GPT v1.0.0
        </p>
      </div>
    </aside>
  );
}
