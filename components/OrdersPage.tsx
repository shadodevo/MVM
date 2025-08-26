import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Order } from '../types';
import { PlusIcon, SearchIcon, MoreVerticalIcon } from './icons/Icons';

const OrdersPage: React.FC = () => {
    const { t } = useTranslation();
    const { orders } = useApp();
    const statusColors = {
        'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Shipped': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('all_orders')}</h2>
                <div className="flex items-center gap-2">
                     <div className="relative">
                        <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder={t('search_placeholder')} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 ps-10 pe-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5"/>
                        <span className="text-sm font-medium">{t('add_order')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">Order ID</th>
                                <th scope="col" className="py-3 px-6">{t('customers')}</th>
                                <th scope="col" className="py-3 px-6">{t('date')}</th>
                                <th scope="col" className="py-3 px-6">{t('amount')}</th>
                                <th scope="col" className="py-3 px-6">{t('status')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order: Order) => (
                                <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6 font-mono text-gray-800 dark:text-white">#{order.id}</td>
                                    <td className="py-4 px-6">{order.customerName}</td>
                                    <td className="py-4 px-6">{order.date}</td>
                                    <td className="py-4 px-6 font-semibold">{currencyFormatter.format(order.amount)}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <MoreVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
