import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { mockDashboardStats, mockProducts, mockOrders } from '../../services/mockData';

const StatCard = ({ icon, label, value, color = 'bg-primary-container text-on-primary-container' }) => (
  <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-sm">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant">{label}</p>
    <h3 className="text-headline-md font-bold text-on-surface">{value}</h3>
  </div>
);

const Dashboard = () => {
  const stats = mockDashboardStats;
  const formatPrice = (p) =>
    p?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  return (
    <AdminLayout>
      <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between px-gutter py-sm shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <h1 className="font-headline-md text-headline-md text-on-surface">Panel de Control</h1>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </header>

      <main className="p-lg space-y-lg overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          <StatCard icon="payments" label="Ingresos del mes" value={formatPrice(stats.totalRevenue)} color="bg-primary-container text-on-primary-container" />
          <StatCard icon="receipt_long" label="Pedidos totales" value={stats.totalOrders} color="bg-secondary-container text-on-secondary-container" />
          <StatCard icon="group" label="Usuarios activos" value={stats.totalUsers.toLocaleString()} color="bg-tertiary-container text-on-tertiary-container" />
          <StatCard icon="trending_up" label="Conversión" value={`${stats.conversionRate}%`} color="bg-green-100 text-green-800" />
        </div>

        {/* Más vendidos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Más Vendidos</h2>
            <div className="space-y-sm">
              {mockProducts.slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center gap-sm py-sm border-b border-outline-variant last:border-0">
                  <span className="font-bold text-primary w-6 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md text-on-surface truncate">{p.name}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{p.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-md text-label-md text-primary">{formatPrice(p.price)}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">★ {p.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pedidos recientes */}
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Pedidos Recientes</h2>
            <div className="space-y-sm">
              {mockOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-sm border-b border-outline-variant last:border-0">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">{order.id}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {new Date(order.date).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-md text-label-md text-primary">{formatPrice(order.total)}</p>
                    <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-lg ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>{order.statusLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default Dashboard;
