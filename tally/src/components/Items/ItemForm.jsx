import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ItemForm = () => {
    const [formState, setFormState] = useState({
        newItem: {
            sno: '',
            itemCode: '',
            unit: 'BOX',
            hsnCode: '',
            sellingPrice: '',
            costPrice: '',
            salesAccount: 'Sales',
            purchaseAccount: 'Cost of Goods Sold',
            descriptionSales: '',
            descriptionPurchase: '',
            type: 'Goods',
            taxPayable: false, 
            gst: '',           
        }
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormState((prevState) => ({
            newItem: { ...prevState.newItem, [name]: type === 'checkbox' ? checked : value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/items', formState.newItem);
            navigate('/dashboard/items');
        } catch (error) {
            console.error('Error adding item:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-52">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Item</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-around space-x-4">
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <div className="mt-1">
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="type"
                                    value="Goods"
                                    checked={formState.newItem.type === 'Goods'}
                                    onChange={handleInputChange}
                                />{' '}
                                Goods
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="Service"
                                    checked={formState.newItem.type === 'Service'}
                                    onChange={handleInputChange}
                                />{' '}
                                Service
                            </label>
                        </div>
                    </div>
                    <div className="w-100">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formState.newItem.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Item Code</label>
                    <input
                        type="text"
                        name="itemCode"
                        value={formState.newItem.itemCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                    <select
                        name="unit"
                        value={formState.newItem.unit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
>
                        <option value="BOX">BOX - box</option>
                        <option value="CMS">CMS - cm</option>
                        <option value="DOZ">DOZ - dz</option>
                        <option value="FTS">FTS - ft</option>
                        <option value="GMS">GMS - g</option>
                        <option value="KGS">KGS - kg</option>
                        <option value="KME">KME - km</option>
                        <option value="LBS">LBS - lb</option>
                        <option value="MGS">MGS - mg</option>
                        <option value="MLT">MLT - ml</option>
                        <option value="MTR">MTR - m</option>
                        <option value="PCS">PCS - pcs</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">HSN Code</label>
                    <input
                        type="text"
                        name="hsnCode"
                        value={formState.newItem.hsnCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Tax Payable Checkbox and GST Input */}
                <div className="flex">
                    <div className="flex">
                        <input
                            type="checkbox"
                            name="taxPayable"
                            checked={formState.newItem.taxPayable}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="ml-2 font-medium text-gray-700">Tax Payable</label>
                    </div>
                    {formState.newItem.taxPayable && (
                        <div className="flex space-x-2">
                            <label className="block text-sm font-medium text-gray-700">GST (%)</label>
                            <input
                                type="number"
                                name="gst"
                                value={formState.newItem.gst}
                                onChange={handleInputChange}
                                className="w-60% px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    )}
                </div>


                {/* Sales Information */}
                <div className="border-t pt-4">
                    <h2 className="text-lg font-medium text-gray-800">Sales Information</h2>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                            <input
                                type="text"
                                name="sellingPrice"
                                value={formState.newItem.sellingPrice}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Account</label>
                            <select
                                name="salesAccount"
                                value={formState.newItem.salesAccount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="Sales">Sales</option>
                                <option value="Discount">Discount</option>
                                <option value="General Income">General Income</option>
                                <option value="Interest Income">Interest Income</option>
                                <option value="Late fee Income">Late fee Income</option>
                                <option value="Shipping Charges">Shipping Charges</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="descriptionSales"
                            value={formState.newItem.descriptionSales}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 h-12 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Purchase Information */}
                <div className="border-t pt-4">
                    <h2 className="text-lg font-medium text-gray-800">Purchase Information</h2>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Cost Price</label>
                            <input
                                type="text"
                                name="costPrice"
                                value={formState.newItem.costPrice}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Account</label>
                            <select
                                name="purchaseAccount"
                                value={formState.newItem.purchaseAccount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="Cost of Goods Sold">Cost of Goods Sold</option>
                                <option value="General Expense">General Expense</option>
                                <option value="Shipping Charges">Shipping Charges</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="descriptionPurchase"
                            value={formState.newItem.descriptionPurchase}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 h-12 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                    >
                        Add Item
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ItemForm;
