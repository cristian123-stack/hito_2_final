import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/common/Badge';
import { mockOrders } from '../../services/mockData';
// TODO: import { orderService } from '../../services/api';

const statusVariant = { delivered: 'success', shipped: 'info', processing: 'warning', cancelled: 'error' };

const AdminOrders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatPrice = (p) =>
    p?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = [
    { value: 'all', label: 'Todos' },
    { value: 'processing', label: 'Procesando' },
    { value: 'shipped', label: 'En camino' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  return (
    <AdminLayout>
      <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between px-gutter py-sm shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Gestión de Pedidos</h1>
      </header>
      <main className="p-lg space-y-md overflow-y-auto">
        {/* Stats rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          {statuses.filter(s => s.value !== 'all').map((s) => (
            <div key={s.value} className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] text-center">
              <p className="font-body-sm text-body-sm text-on-surface-variant">{s.label}</p>
              <p className="font-headline-sm text-headline-sm text-on-surface">{orders.filter(o => o.status === s.value).length}</p>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-md flex flex-col md:flex-row gap-sm border-b border-outline-variant">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-base">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por ID de pedido..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant bg-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="py-2 px-3 rounded-lg border border-outline-variant bg-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary">
              {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-low">
                <tr>
                  {['ID Pedido', 'Fecha', 'Productos', 'Total', 'Estado', 'Acciones'].map((h) => (
                    <th key={h} className="px-md py-sm text-left font-label-md text-label-md text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-md py-sm font-label-md text-label-md text-primary">{order.id}</td>
                    <td className="px-md py-sm font-body-sm text-body-sm text-on-surface-variant">{new Date(order.date).toLocaleDateString('es-CL')}</td>
                    <td className="px-md py-sm font-body-sm text-body-sm text-on-surface">{order.items.length} ítem(s)</td>
                    <td className="px-md py-sm font-label-md text-label-md text-on-surface">{formatPrice(order.total)}</td>
                    <td className="px-md py-sm"><Badge label={order.statusLabel} variant={statusVariant[order.status]} /></td>
                    <td className="px-md py-sm">
                      <button className="text-primary font-label-sm text-label-sm hover:underline">Ver detalle</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminOrders;
