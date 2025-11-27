import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Orders & Revenue
      const ordersSnap = await getDocs(collection(db, 'orders'));
      let totalRev = 0;
      const uniqueCustomers = new Set();
      
      ordersSnap.forEach(doc => {
        const data = doc.data();
        totalRev += (data.totalAmount || 0);
        if (data.userId) uniqueCustomers.add(data.userId);
      });

      // 2. Products
      const productsSnap = await getDocs(collection(db, 'products'));

      // 3. Recent Orders
      const recentQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
      const recentSnap = await getDocs(recentQ);
      
      setStats({
        revenue: totalRev,
        orders: ordersSnap.size,
        products: productsSnap.size,
        customers: uniqueCustomers.size
      });
      
      setRecentOrders(recentSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Total Orders" value={stats.orders} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard title="Products" value={stats.products} icon={Package} color="bg-purple-500" />
        <StatCard title="Customers" value={stats.customers} icon={Users} color="bg-orange-500" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-gray-600">#{order.id.slice(0,6)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold">₹{order.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};