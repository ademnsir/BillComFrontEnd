import React, { useState } from 'react';
import axios from 'axios';
import { Card, Input, Textarea, Button, Typography, Select } from "@material-tailwind/react";

export function AddServiceForm({ open, onClose }) {
  // Define state variables for form inputs
  const [title, setTitle] = useState('');
  const [prix, setPrix] = useState('');
  const [marque, setMarque] = useState('');
  const [dispo, setDispo] = useState('');
  const [promo, setPromo] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('prix', prix);
    formData.append('marque', marque);
    formData.append('dispo', dispo);
    formData.append('promo', promo);
    formData.append('subcategory', subcategory);
    formData.append('type', type);
    formData.append('image', image); // Append image file
    formData.append('logoUrl', logoUrl); // Append logo file
  
    try {
      setLoading(true);
      await axios.post('https://backendbillcom-production.up.railway.app/tp/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product added successfully');
      onClose(); // Close the form upon success
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please check the fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="orange">
            Add Product
          </Typography>
          <form className="mt-8 mb-2" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <Input size="md" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label htmlFor="prix" className="block text-sm font-medium text-gray-700">Price (DT)</label>
                <Input size="md" id="prix" value={prix} onChange={(e) => setPrix(e.target.value)} />
              </div>
              <div>
                <label htmlFor="marque" className="block text-sm font-medium text-gray-700">Brand</label>
                <Input size="md" id="marque" value={marque} onChange={(e) => setMarque(e.target.value)} />
              </div>
              <div>
                <label htmlFor="dispo" className="block text-sm font-medium text-gray-700">Availability</label>
                <Input size="md" id="dispo" value={dispo} onChange={(e) => setDispo(e.target.value)} />
              </div>
              <div>
                <label htmlFor="promo" className="block text-sm font-medium text-gray-700">Promo (%)</label>
                <Input size="md" id="promo" value={promo} onChange={(e) => setPromo(e.target.value)} />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Category</label>
                <Input size="md" id="type" value={type} onChange={(e) => setType(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
                <Input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} />
              </div>
              <div className="col-span-2">
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Brand Logo</label>
                <Input type="file" id="logoUrl" onChange={(e) => setLogoUrl(e.target.files[0])} />
              </div>
            </div>
            <Button className="mt-6" fullWidth color="orange" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
