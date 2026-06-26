import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/common/Badge';
import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../services/mockData';
// TODO: import { userService } from '../../services/api';

const AdminUsers = () => {
  const { showNotification } = useApp();
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    showNotification('Usuario eliminado', 'info');
    // TODO: userService.delete(id)
  };

  return (
    <AdminLayout>
      <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md px-gutter py-sm shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <h1 className="font-display-lg-mobile text-on-surface">Gestión de Usuarios</h1>
      </header>
      <main className="p-lg overflow-y-auto">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant">
          <div className="p-md flex flex-col md:flex-row gap-sm border-b border-outline-variant">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-base">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o correo..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant bg-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="py-2 px-3 rounded-lg border border-outline-variant bg-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">Todos los roles</option>
              <option value="user">Clientes</option>
              <option value="admin">Administradores</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-low">
                <tr>
                  {['Usuario', 'Correo', 'Rol', 'Pedidos', 'Registrado', 'Acciones'].map((h) => (
                    <th key={h} className="px-md py-sm text-left font-label-md text-label-md text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-md py-sm">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-primary-container text-base">person</span>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-md py-sm font-body-sm text-body-sm text-on-surface-variant">{user.email}</td>
                    <td className="px-md py-sm">
                      <Badge label={user.role === 'admin' ? 'Admin' : 'Cliente'} variant={user.role === 'admin' ? 'default' : 'success'} />
                    </td>
                    <td className="px-md py-sm font-body-sm text-body-sm text-on-surface">{user.orders}</td>
                    <td className="px-md py-sm font-body-sm text-body-sm text-on-surface-variant">{new Date(user.joined).toLocaleDateString('es-CL')}</td>
                    <td className="px-md py-sm">
                      <div className="flex gap-xs">
                        <button className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all" title="Editar">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-all" title="Eliminar">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-md py-sm flex justify-between items-center bg-surface-container-low border-t border-outline-variant">
            <span className="font-body-sm text-body-sm text-on-surface-variant">{filtered.length} usuarios</span>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminUsers;
