import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PublicLayout from '../../components/layout/PublicLayout';
import UserSidebar from '../../components/layout/UserSidebar';
import Badge from '../../components/common/Badge';
import { mockOrders } from '../../services/mockData';

const statusVariant = {
  delivered: 'success',
  shipped: 'info',
  processing: 'warning',
  cancelled: 'error',
};

const MyOrders = () => {
  const { isAuthenticated } = useApp();
  const [filter, setFilter] = useState('all');
  // TODO: reemplazar mockOrders por orderService.getMyOrders()
  const orders = mockOrders;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const formatPrice = (p) =>
    p?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  const tabs = [
    { value: 'all', label: 'Todos' },
    { value: 'processing', label: 'En proceso' },
    { value: 'shipped', label: 'En camino' },
    { value: 'delivered', label: 'Entregados' },
  ];

  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-72px)]">
        <UserSidebar />
        <main className="flex-1 p-lg pb-24 md:pb-lg">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
            <div>
              <h2 className="font-display-lg-mobile text-on-surface mb-xs">Mis Pedidos</h2>
              <p className="text-on-surface-variant font-body-md text-body-md">{orders.length} pedidos en total</p>
            </div>
          </header>

          {/* Tabs */}
          <div className="flex gap-xs mb-md overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-md py-sm rounded-lg font-label-md text-label-md whitespace-nowrap transition-all ${
                  filter === tab.value
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant">
            <div className="p-md border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Historial de Compras</h3>
            </div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-xl text-center">
                <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-md">receipt_long</span>
                <p className="text-on-surface-variant font-body-md text-body-md">No hay pedidos en esta categoría</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant">
                {filtered.map((order) => (
                  <div key={order.id} className="p-md hover:bg-surface-container-low transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-sm">
                      <div>
                        <p className="font-headline-sm text-headline-sm text-on-surface">{order.id}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {new Date(order.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <div className="mt-xs space-y-0.5">
                          {order.items.map((item, i) => (
                            <p key={i} className="font-body-sm text-body-sm text-on-surface-variant">
                              {item.qty}x {item.name}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-xs">
                        <Badge label={order.statusLabel} variant={statusVariant[order.status]} />
                        <span className="font-headline-sm text-headline-sm text-primary">{formatPrice(order.total)}</span>
                        <button className="font-label-sm text-label-sm text-primary hover:underline">Ver detalle</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </PublicLayout>
  );
};

export default MyOrders;
