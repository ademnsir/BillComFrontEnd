import React, { useState } from 'react';
import axios from 'axios';
import { Card, Input, Textarea, Button, Typography, Select } from "@material-tailwind/react";
import { useAuth } from "@/pages/authContext";

export function AddServiceForm({ open, onClose }) {
  const { authData } = useAuth();
  const staticFreelancerId = authData?.user?._id; 

  const [deliveryTime, setDeliveryTime] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pricing, setPricing] = useState({ starter: '', standard: '', advanced: '' });
  const [selectedDomain, setSelectedDomain] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const expertiseDomains = [
    'Web Development', 
    'Mobile App Development', 
    'Logo Design', 
    'Graphic Design', 
    'Video & Audio', 
    'Writing & Translation', 
    'Digital Marketing', 
    'Virtual Assistant', 
    'Photography & Image Editing', 
    'Video Production & Editing', 
    'Audio Production & Editing', 
    'Music Production & Editing', 
    'Data Science', 
    'Blockchain, NFT & Cryptocurrency', 
    'Animation for Streamers', 
    'Other'
  ];

  const handleChangeDeliveryTime = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value <= 99) {
      setDeliveryTime(value);
    }
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleChangePricing = (e) => {
    const { name, value } = e.target;
    setPricing(prevState => ({ ...prevState, [name]: value }));
  };

  const handleChangeImages = (e) => {
    const selectedImages = e.target.files;
    const imagesArray = Array.from(selectedImages);
    setImages(imagesArray);
  };

  const handleChangeDomain = (value) => {
    setSelectedDomain(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!deliveryTime) {
      errors.deliveryTime = 'Please enter delivery time.';
    }

    if (!title) {
      errors.title = 'Please enter title.';
    }

    if (!description) {
      errors.description = 'Please enter description.';
    }

    if (!pricing.starter) {
      errors.starterPrice = 'Please enter starter price.';
    }

    if (!pricing.standard) {
      errors.standardPrice = 'Please enter standard price.';
    }

    if (!pricing.advanced) {
      errors.advancedPrice = 'Please enter advanced price.';
    }

    if (!selectedDomain) {
      errors.domain = 'Please select expertise domain.';
    }

    if (images.length === 0) {
      errors.images = 'Please select image.';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('freelancerId', staticFreelancerId);
      formData.append('deliveryTime', deliveryTime);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('pricing[starter]', pricing.starter);
      formData.append('pricing[standard]', pricing.standard);
      formData.append('pricing[advanced]', pricing.advanced);
      formData.append('domaineExpertise', selectedDomain);
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
      await axios.post('https://colabhub.onrender.com/services/addServices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Service added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div onClick={onClose} className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='max-w-2xl w-full bg-white rounded-lg shadow-md flex overflow-y-auto'
        style={{ maxHeight: '80vh', maxWidth: '60vw' }}
      >
        <div className='flex flex-col p-4 w-full'>
          <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="orange">
              Add your service
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Fill in the details to add your service
            </Typography>
            <form className="mt-8 mb-2" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <Input
                    size="md"
                    placeholder="Enter title"
                    value={title}
                    onChange={handleChangeTitle}
                    id="title"
                    error={errors.title}
                  />
                  {errors.title && <Typography color="red">{errors.title}</Typography>}
                </div>
                <div>
                  <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700">Delivery Time (in days, max 99)</label>
                  <Input
                    size="md"
                    type="number"
                    placeholder="Enter delivery time"
                    value={deliveryTime}
                    onChange={handleChangeDeliveryTime}
                    id="deliveryTime"
                    error={errors.deliveryTime}
                  />
                  {errors.deliveryTime && <Typography color="red">{errors.deliveryTime}</Typography>}
                </div>
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <Textarea
                    size="md"
                    placeholder="Enter description"
                    value={description}
                    onChange={handleChangeDescription}
                    id="description"
                    error={errors.description}
                  />
                  {errors.description && <Typography color="red">{errors.description}</Typography>}
                </div>
                <div>
                  <label htmlFor="starterPrice" className="block text-sm font-medium text-gray-700">Starter Price</label>
                  <Input
                    size="md"
                    type="number"
                    placeholder="Enter starter price"
                    value={pricing.starter}
                    onChange={handleChangePricing}
                    id="starterPrice"
                    name="starter"
                    error={errors.starterPrice}
                  />
                  {errors.starterPrice && <Typography color="red">{errors.starterPrice}</Typography>}
                </div>
                <div>
                  <label htmlFor="standardPrice" className="block text-sm font-medium text-gray-700">Standard Price</label>
                  <Input
                    size="md"
                    type="number"
                    placeholder="Enter standard price"
                    value={pricing.standard}
                    onChange={handleChangePricing}
                    id="standardPrice"
                    name="standard"
                    error={errors.standardPrice}
                  />
                  {errors.standardPrice && <Typography color="red">{errors.standardPrice}</Typography>}
                </div>
                <div>
                  <label htmlFor="advancedPrice" className="block text-sm font-medium text-gray-700">Advanced Price</label>
                  <Input
                    size="md"
                    type="number"
                    placeholder="Enter advanced price"
                    value={pricing.advanced}
                    onChange={handleChangePricing}
                    id="advancedPrice"
                    name="advanced"
                    error={errors.advancedPrice}
                  />
                  {errors.advancedPrice && <Typography color="red">{errors.advancedPrice}</Typography>}
                </div>
                <div className="col-span-2">
                  <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Expertise Domain</label>
                  <Select
                    size="md"
                    placeholder="Select domain"
                    value={selectedDomain}
                    onChange={handleChangeDomain}
                    id="domain"
                  >
                    {expertiseDomains.map((domain, index) => (
                      <Select.Option key={index} value={domain}>{domain}</Select.Option>
                    ))}
                  </Select>
                  {errors.domain && <Typography color="red">{errors.domain}</Typography>}
                </div>
                <div className="col-span-2">
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700">Select Image</label>
                  <Input
                    size="md"
                    type="file"
                    accept="image/*"
                    placeholder="Select image"
                    onChange={handleChangeImages}
                    id="images"
                    error={errors.images}
                  />
                  {errors.images && <Typography color="red">{errors.images}</Typography>}
                </div>
              </div>
              <Button className="mt-6" fullWidth color="orange" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Service'}
              </Button>
            </form>
          </Card>
        </div>
        <div className="w-50 h-50 mt-40">
          <img src="/img/details.jpg" alt="Your image" className="w-50 h-50" />
        </div>
      </div>
    </div>
  );
}