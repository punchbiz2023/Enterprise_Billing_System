import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ItemDetails = () => {
  const { id } = useParams(); // This should capture the id from the URL
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      console.log(`Fetching item with id: ${id}`); // Check if id is being logged correctly
      try {
        const response = await axios.get('http://localhost:3001/api/items');
        console.log(response.data); // Check if the data is fetched
        // Filter the item based on the id
        const fetchedItem = response.data.find(item => item.sno === parseInt(id));
        setItem(fetchedItem);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching item details:', error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!item) {
    return <p>Item not found</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg p-10 rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-5">Item Details</h1>
        <p className="mb-3"><strong>Name:</strong> {item.name}</p>
        <p className="mb-3"><strong>Item Type</strong> {item.type}</p>
        <p className="mb-3"><strong>Unit</strong> {item.unit}</p>

        <h1><strong>Sales Information</strong></h1>
        <p className="mb-3"><strong>Selling Price:</strong> {item.salesprice}</p>
        <p className="mb-3"><strong>Sales Description</strong> {item.descriptionSales}</p>
        

        <h1><strong>Purchase Information</strong></h1>
        <p className="mb-3"><strong>Cost Price:</strong> {item.costprice}</p>
        <p className="mb-3"><strong>Cost Description</strong> {item.descriptionCost}</p>

        
      </div>
    </div>
  );
};

export default ItemDetails;
