

import React, { useState, useMemo, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Product } from '../types';
import { PlusIcon, SearchIcon, MoreVerticalIcon, XIcon as CloseIcon, BoxIcon, UploadCloudIcon, DownloadIcon } from './icons/Icons';
import { exportToCsv } from '../lib/utils';

const AddProductModal = ({ isOpen, onClose, onSave }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;
    
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newProduct: Partial<Product> = {
            id: `prod_${Date.now()}`,
            name: formData.get('name') as string,
            category: formData.get('category') as string,
            price: parseFloat(formData.get('price') as string),
            stock: parseInt(formData.get('stock') as string, 10),
        };
        onSave(newProduct as Product);
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('add_product')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('product_name')} *</label>
                        <input name="name" type="text" placeholder={t('product_name')} className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('product_category')}</label>
                        <input name="category" type="text" placeholder={t('product_category')} className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('price')} *</label>
                        <input name="price" type="number" step="0.01" placeholder="0.00" className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('stock')} *</label>
                        <input name="stock" type="number" placeholder="0" className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required/>
                    </div>
                </div>
                <div className="flex justify-end items-center p-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};

const ProductsPage: React.FC = () => {
    const { t } = useTranslation();
    const { products, setProducts } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const importInputRef = useRef<HTMLInputElement>(null);
    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    
    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [products, searchQuery]);
    
    const handleSaveProduct = (newProduct: Product) => {
        setProducts(prev => [...prev, newProduct]);
        setIsModalOpen(false);
    }
    
    const handleImportClick = () => {
        importInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            alert(`File "${file.name}" selected for import. (This is a simulation)`);
        }
    };

    const handleExport = () => {
        const dataToExport = filteredProducts.map(({ customFieldData, ...rest }) => rest);
        exportToCsv('products.csv', dataToExport);
    };

    return (
        <div className="p-6 space-y-6">
            <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} />
            <input
                type="file"
                ref={importInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileImport}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('all_products')}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                     <div className="relative">
                        <SearchIcon className="absolute top-1/2 left-3 rtl:left-auto rtl:right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 ps-10 pe-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button onClick={handleImportClick} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        <UploadCloudIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline text-sm font-medium">{t('import')}</span>
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        <DownloadIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline text-sm font-medium">{t('export')}</span>
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5"/>
                        <span className="text-sm font-medium">{t('add_product')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('product_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('category')}</th>
                                <th scope="col" className="py-3 px-6">{t('price')}</th>
                                <th scope="col" className="py-3 px-6">{t('stock')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product: Product) => (
                                <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                                                <BoxIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="font-medium text-gray-800 dark:text-white">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">{product.category}</td>
                                    <td className="py-4 px-6 font-semibold">{currencyFormatter.format(product.price)}</td>
                                    <td className="py-4 px-6">{product.stock}</td>
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

export default ProductsPage;