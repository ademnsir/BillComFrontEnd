import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Typography } from "@material-tailwind/react";
import { useParams, useNavigate } from 'react-router-dom';
import { MapPinIcon } from "@heroicons/react/24/solid";
import { HiOutlineMail } from 'react-icons/hi';
import Swal from 'sweetalert2';

export function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { idUser } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8083/tp/api/user/getUserById/${idUser}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate("/error");
      }
    };

    fetchUserData();
  }, [idUser, navigate]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profile_picture', selectedFile);

    try {
      const response = await axios.post(`http://localhost:8083/tp/api/user/uploadProfilePicture/${idUser}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);

      // Mettre à jour l'état local avec la nouvelle photo de profil
      setUserData(prev => ({ ...prev, profilePicture: response.data.fileName }));

      // Afficher une alerte de succès
      Swal.fire({
        title: 'Success!',
        text: 'Your profile picture has been updated successfully.',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to upload your profile picture. Please try again later.',
        icon: 'error',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className="relative block h-[41vh]">
        <div className="bg-profile-background absolute top-0 h-full w-full bg-[url('/img/ici1.png')] bg-cover bg-center scale-105" />
        <div className="absolute top-0 h-full w-full bg-black/60" />
      </section>
      <section className="relative bg-white py-16">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="w-40 lg:mr-4 -mt-20">
              <label htmlFor="avatar">
                <input type="file" id="avatar" style={{ display: 'none' }} onChange={handleFileChange} />
                <Avatar
                  src={selectedFile ? URL.createObjectURL(selectedFile) : userData.profilePicture ? `http://localhost:8083/tp/uploads/${userData.profilePicture}` : '/public/img/user1.jpg'}
                  alt="Profile picture"
                  variant="circular"
                  className="h-full w-full cursor-pointer"
                  onClick={() => document.getElementById('avatar').click()}
                />
              </label>
              <button 
                onClick={handleFileUpload} 
                className="mt-2 text-white py-1 px-4 rounded"
                style={{ backgroundColor: '#3D92F1' }}
              >
                Upload
              </button>
            </div>
            <div className="floating"> 
              <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white">
                Welcome to your profile page <span style={{ color: '#3D92F1' }}>{userData.nom} {userData.prenom}!</span> Explore your information here.{" "}
              </h1>
              <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
                Here you can view and manage your personal information.
              </p>
            </div>
          </div>
          <div className="mt-11 container space-y-2">
            <div className="items-center gap-2">
              <Typography variant="h5" color="blue-gray">
                {userData.nom} {userData.prenom}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="-mt-px h-4 w-4" style={{ color: '#3D92F1' }} />
              <Typography className="font-medium text-blue-gray-500">
                {userData.ville}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineMail className="-mt-px h-4 w-4 text-blue-gray-500" />
              <Typography className="font-medium text-blue-gray-500">
                {userData.email}
              </Typography>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
