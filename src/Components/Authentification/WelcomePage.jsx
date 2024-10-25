import React, { useState,useEffect } from 'react';
import { Checkbox, Button, Typography } from "@material-tailwind/react";
import AuthenticationService from "@/Services/Authentification/AuthentificationService";
import { useAuth } from '../../pages/authContext';
import {  useNavigate } from 'react-router-dom';

function WelcomePage() {
  const [freelancerChecked, setFreelancerChecked] = useState(true);
  const [clientChecked, setClientChecked] = useState(false);
  const authenticationService = new AuthenticationService();
  const { authData, setAuthUserData } = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (authData && authData.accessToken) { 
      navigate("/");
    }
  }, [authData, navigate]);

  const handleFreelancerCheckboxChange = () => {
    if (!freelancerChecked) {
      setFreelancerChecked(true);
      setClientChecked(false);
    }
  };

  const handleClientCheckboxChange = () => {
    if (!clientChecked) {
      setClientChecked(true);
      setFreelancerChecked(false);
    }
  };

  const Update = async () => {
    let updatedUser;
  
    try {
      const userType = freelancerChecked ? "freelancer" : "Project owner";
      updatedUser = await authenticationService.update(authData.user?.email, { type: userType });
      setAuthUserData({
        user: { ...authData.user, type: userType },
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  
    if (updatedUser) {
      navigate("/");
    } else {
      throw new Error('Problem with the update');
    }
  };
  

  return (
    <>
      <div className="pt-[150px] flex justify-center">
        <Typography variant="h3" color="blue-gray" className="flex items-center">
          Join as freelancer or Client 
        </Typography>
      </div>
      <div className="pt-[50px] h flex items-center justify-center">
        <div className={`relative w-[300px] h-[200px] border mr-8 ${freelancerChecked ? 'border-orange-400' : ''}`} onClick={handleFreelancerCheckboxChange}>
          <div className='absolute top-6 left-8'>
            <svg className="w-[35px] h-[35px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" d="M7 17v1c0 .6.4 1 1 1h8c.6 0 1-.4 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <div className="absolute bottom-5 left-5">
            <Typography variant="lead" color="blue-gray" className="flex items-center" style={{ userSelect: 'none' }}>
              I'm a Freelancer, looking for work
            </Typography>
          </div>
          <div className="absolute top-5 right-5">
            <Checkbox
              checked={freelancerChecked}
              onChange={handleFreelancerCheckboxChange}
              className="rounded"
            />
          </div>
        </div>
        <div className={`relative w-[300px] h-[200px] border ${clientChecked ? 'border-orange-500' : ''}`} onClick={handleClientCheckboxChange} style={{ cursor: 'pointer' }}>
          <div className='absolute top-6 left-8'>
            <svg className="w-[35px] h-[35px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3a2.5 2.5 0 1 1 2-4.5M19.5 17h.5c.6 0 1-.4 1-1a3 3 0 0 0-3-3h-1m0-3a2.5 2.5 0 1 0-2-4.5m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3c0 .6-.4 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
            </svg>
          </div>
          <div className="absolute bottom-5 left-5">
            <Typography variant="lead" color="blue-gray" className="flex items-center" style={{ userSelect: 'none' }}>
              I'm a Client, looking to hire people
            </Typography>
          </div>
          <div className="absolute top-5 right-5">
            <Checkbox
              checked={clientChecked}
              onChange={handleClientCheckboxChange}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center pt-8 ">
        <Button className={`mt-6 ${freelancerChecked || clientChecked ? 'bg-orange-500' : ''} w-[300px]`} onClick={Update}>
          {freelancerChecked ? "Join as Freelancer" : "Join as Client"}
        </Button>
      </div>
    </>
  );
}

export default WelcomePage;
