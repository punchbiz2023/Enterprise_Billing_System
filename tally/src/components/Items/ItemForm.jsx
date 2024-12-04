import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ItemForm = () => {
    const [formState, setFormState] = useState({
        newItem: {
            sno: '',
            name:'',
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
            addInventory: false,
            quantity: '',
            openingStock: '',
            closingStockAlert: '',
        }
    });
    
    const [loggedUser, setLoggedUser] = useState(null);
    const navigate = useNavigate();


    
    useEffect(()=>{
        const token = localStorage.getItem("accessToken")
        const decoded = jwtDecode(token)
        
        setLoggedUser(decoded.email); 
    },[])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormState((prevState) => ({
            newItem: { ...prevState.newItem, [name]: type === 'checkbox' ? checked : value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const inventItem = {
            itemName: formState.newItem.name,
            itemCode: formState.newItem.itemCode,
            hsnCode: formState.newItem.hsnCode,
            quantity: formState.newItem.quantity,
            rate: formState.newItem.sellingPrice,
            gst: formState.newItem.gst,
        };

        const invData = {...inventItem,loggedUser}
        const data = {...formState.newItem,loggedUser}
        

        try {
            await axios.post('https://enterprisebillingsystem.onrender.com/api/items', data);
            await axios.post('https://enterprisebillingsystem.onrender.com/api/inventory', invData);
            navigate('/dashboard/items');
        } catch (error) {
            console.error('Error adding item:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
            <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Add New Item</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Add Inventory Checkbox */}
                <div className="flex items-center space-x-2 justify-start">
                    <input
                        type="checkbox"
                        name="addInventory"
                        checked={formState.newItem.addInventory}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">Add Inventory</label>
                </div>



                {/* Inventory Fields (conditionally rendered) */}
                {formState.newItem.addInventory && (
                    <div className="col-span-2 space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Opening Stock</label>
                            <input
                                type="number"
                                name="openingStock"
                                value={formState.newItem.openingStock}
                                onChange={handleInputChange}
                                placeholder="Enter opening stock"
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Closing Stock Alert</label>
                            <input
                                type="number"
                                name="closingStockAlert"
                                value={formState.newItem.closingStockAlert}
                                onChange={handleInputChange}
                                placeholder="Enter stock alert threshold"
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                )}

                {/* Type Selection */}
                <div className="col-span-2 text-left ">
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <div className="flex items-center space-x-6 mt-2">
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value="Goods"
                                checked={formState.newItem.type === 'Goods'}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Goods
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value="Service"
                                checked={formState.newItem.type === 'Service'}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Service
                        </label>
                    </div>
                </div>


                {/* Other Form Fields */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formState.newItem.name}
                        onChange={handleInputChange}
                        placeholder="Enter Item Name"
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Item Code</label>
                    <input
                        type="text"
                        name="itemCode"
                        value={formState.newItem.itemCode}
                        onChange={handleInputChange}
                        placeholder="Enter Item Code"
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">HSN Code</label>
                    <input
                        type="text"
                        name="hsnCode"
                        value={formState.newItem.hsnCode}
                        onChange={handleInputChange}
                        placeholder="Enter HSN Code"
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formState.newItem.quantity}
                        onChange={handleInputChange}
                        placeholder="Enter Quantity"
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Tax Payable Checkbox */}
                <div className="col-span-2 flex items-center space-x-6">
                    <div>
                        <input
                            type="checkbox"
                            name="taxPayable"
                            checked={formState.newItem.taxPayable}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-gray-700 font-medium">Tax Payable</label>
                    </div>
                    {formState.newItem.taxPayable && (
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">GST (%)</label>
                            <input
                                type="number"
                                name="gst"
                                value={formState.newItem.gst}
                                onChange={handleInputChange}
                                placeholder="Enter GST Value"
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    )}
                </div>

                {/* Sales Information */}
                <div className="col-span-2 border-t pt-4">
                    <h2 className="text-lg font-semibold text-gray-800">Sales Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                            <input
                                type="text"
                                name="sellingPrice"
                                value={formState.newItem.sellingPrice}
                                onChange={handleInputChange}
                                placeholder="Enter Selling Price"
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sales Account</label>
                            <select
                                name="salesAccount"
                                value={formState.newItem.salesAccount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Sales">Sales</option>
                                <option value="Discount">Discount</option>
                                {/* Add more accounts as needed */}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description (Sales)</label>
                        <textarea
                            name="descriptionSales"
                            value={formState.newItem.descriptionSales}
                            onChange={handleInputChange}
                            placeholder="Enter Description"
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Purchase Information */}
                <div className="col-span-2 border-t pt-4">
                    <h2 className="text-lg font-semibold text-gray-800">Purchase Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cost Price</label>
                            <input
                                type="text"
                                name="costPrice"
                                value={formState.newItem.costPrice}
                                onChange={handleInputChange}
                                placeholder="Enter Cost Price"
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Purchase Account</label>
                            <select
                                name="purchaseAccount"
                                value={formState.newItem.purchaseAccount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="Cost of Goods Sold">Cost of Goods Sold</option>
                                {/* Add more options */}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description (Purchase)</label>
                        <textarea
                            name="descriptionPurchase"
                            value={formState.newItem.descriptionPurchase}
                            onChange={handleInputChange}
                            placeholder="Enter Description"
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>



                {/* Form Actions */}
                <div className="col-span-2 flex justify-end mt-6">
                    <button
                        type="submit"
                        className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add Item
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/items')}
                        className="ml-4 px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ItemForm;