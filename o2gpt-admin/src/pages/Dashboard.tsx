import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import {
  Users,
  MessageSquare,
  Zap,
  DollarSign,
  Activity,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: adminApi.getDashboard,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border-red-200">
        <p className="text-red-700">Ошибка загрузки данных</p>
      </div>
    );
  }

  const modelData = data?.usage?.top_models
    ? Object.entries(data.usage.top_models).map(([name, count]) => ({
        name: name.split('/').pop() || name,
        value: count,
      }))
    : [];

  const userRoleData = data?.users?.by_role
    ? Object.entries(data.users.by_role).map(([name, count]) => ({
        name,
        value: count,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Обзор системы O2GPT</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Всего пользователей"
          value={data?.users?.total || 0}
          icon={Users}
          color="bg-blue-500"
          subtitle={`${data?.users?.active || 0} активных`}
        />
        <StatCard
          title="Запросов сегодня"
          value={data?.usage?.total_requests_today || 0}
          icon={Activity}
          color="bg-green-500"
        />
        <StatCard
          title="Токенов сегодня"
          value={(data?.usage?.total_tokens_today || 0).toLocaleString()}
          icon={Zap}
          color="bg-amber-500"
        />
        <StatCard
          title="Стоимость сегодня"
          value={`$${(data?.usage?.total_cost_today_usd || 0).toFixed(2)}`}
          icon={DollarSign}
          color="bg-purple-500"
        />
      </div>

      {/* Статистика чата */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard
          title="Пользователей чата"
          value={data?.librechat?.total_users || 0}
          icon={Users}
          color="bg-indigo-500"
          subtitle={`${data?.librechat?.active_users_today || 0} активных сегодня`}
        />
        <StatCard
          title="Всего диалогов"
          value={data?.librechat?.total_conversations || 0}
          icon={MessageSquare}
          color="bg-pink-500"
          subtitle={`${data?.librechat?.conversations_today || 0} сегодня`}
        />
        <StatCard
          title="Всего сообщений"
          value={(data?.librechat?.total_messages || 0).toLocaleString()}
          icon={TrendingUp}
          color="bg-teal-500"
          subtitle={`${data?.librechat?.messages_today || 0} сегодня`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Models Usage */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Использование моделей
          </h3>
          {modelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Нет данных
            </div>
          )}
        </div>

        {/* User Roles */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Распределение по ролям
          </h3>
          {userRoleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {userRoleData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Нет данных
            </div>
          )}
        </div>
      </div>

      {/* Top Users */}
      {data?.usage?.top_users && data.usage.top_users.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Топ пользователей по запросам
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    User ID
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    Запросы
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    Токены
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.usage.top_users.map((user) => (
                  <tr
                    key={user.user_id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {user.user_id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-right">
                      {user.requests.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-right">
                      {user.tokens.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
