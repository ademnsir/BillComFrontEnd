import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { Avatar, Typography } from "@material-tailwind/react";
import { useParams, useNavigate } from 'react-router-dom';
import { MapPinIcon } from "@heroicons/react/24/solid";
import { HiOutlineMail } from 'react-icons/hi';
import { FiUpload } from 'react-icons/fi'; // Import upload icon
import Swal from 'sweetalert2';
import { UserContext } from "@/pages/UserContext";

export function Profile() {
  const navigate = useNavigate();
  const { userImage, setUserImage } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { idUser } = useParams();
  const fileInputRef = useRef(null); // Ref for the file input

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://backendbillcom-production.up.railway.app/auth/getUserById/${idUser}`);
        setUserData(response.data);
        setUserImage(response.data.profilePicture ? `https://backendbillcom-production.up.railway.app/uploads/${response.data.profilePicture}` : '/public/img/unknown.jpg');
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate("/errorpage");
      }
    };

    fetchUserData();
  }, [idUser, navigate, setUserImage]);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileURL = URL.createObjectURL(file);

      // Check if the selected file is the same as the current profile picture
      if (userData.profilePicture && fileURL === userImage) {
        Swal.fire({
          title: 'Info',
          text: 'You have selected the same image. Please choose a different one.',
          icon: 'info',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profile_picture', selectedFile);

    try {
      const response = await axios.post(`https://backendbillcom-production.up.railway.app/auth/uploadProfilePicture/${idUser}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newProfilePictureUrl = `https://backendbillcom-production.up.railway.app/uploads/${response.data.fileName}`;
      setUserData(prev => ({ ...prev, profilePicture: response.data.fileName }));
      setUserImage(newProfilePictureUrl); // Update the user image in the context

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
      <section className="relative block h-[41vh] overflow-hidden">
        <div className="bg-profile-background absolute top-0 h-full w-full bg-[url('/img/ici1.png')] bg-cover bg-center scale-105" />
        <div className="absolute top-0 h-full w-full bg-black/60" />
      </section>
      <section className="relative bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex flex-col items-center w-40 lg:mr-4 -mt-20">
              <input
                type="file"
                id="avatar"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Avatar
                src={selectedFile ? URL.createObjectURL(selectedFile) : userImage}
                alt="Profile picture"
                variant="circular"
                className="cursor-pointer"
                style={{ width: '130px', height: '130px', objectFit: 'cover' }}
                onClick={handleAvatarClick}
              />
              <p className="text-gray-500 font-light text-sm mt-2">Cliquez sur votre image pour la modifier</p>
              <button
                onClick={handleFileUpload}
                className="button-24 mt-2 flex items-center justify-center"
                role="button"
              >
                <FiUpload className="text-blue-500 mr-2" />
                <span className="text">Upload</span>
              </button>
              <style jsx>{`
                .button-24 {
                  background-color: transparent;
                  background-image: linear-gradient(#fff, #f5f5fa);
                  border: 0 solid #003dff;
                  border-radius: 9999px;
                  box-shadow: rgba(37, 44, 97, .15) 0 4px 11px 0, rgba(93, 100, 148, .2) 0 1px 3px 0;
                  color: #484c7a;
                  cursor: pointer;
                  display: inline-flex;
                  font-weight: 600;
                  margin: 4px;
                  padding: 16px 24px;
                  text-align: center;
                  transition: all .2s ease-out;
                  line-height: 1.15;
                }
                .button-24:hover {
                  box-shadow: rgba(37, 44, 97, .15) 0 8px 22px 0, rgba(93, 100, 148, .2) 0 4px 6px 0;
                }
                .button-24:disabled {
                  cursor: not-allowed;
                  opacity: .5;
                }
              `}</style>
            </div>
            <div className="floating"> 
              <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">
                Welcome to your profile page <span style={{ color: '#3D92F1' }}>{userData.nom} {userData.prenom}!</span> Explore your information here.
              </h1>
              <p className="text-lg font-normal text-gray-500 lg:text-l dark:text-gray-400">
                Here you can view and manage your personal information.
              </p>
            </div>
          </div>
          <div className="mt-11 space-y-2">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-blue-600" />
              <Typography className="font-medium text-gray-700">
                {userData.pays}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineMail className="h-5 w-5 text-blue-600" />
              <Typography className="font-medium text-gray-700">
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
