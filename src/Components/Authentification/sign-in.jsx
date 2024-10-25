import React, { useState } from 'react';
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import signinImage from '/img/2.jpg';

const MySwal = withReactContent(Swal);

export function SignIn() {
  const [userlogin, setUserLogin] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://backendbillcom-production.up.railway.app/auth/sign-in', {
        email: userlogin.email,
        password: userlogin.password
      });

      localStorage.setItem('user', JSON.stringify(response.data));

      navigate('/');
      window.location.reload(); 

    } catch (error) {
      if (error.response) {
        console.error('Login failed:', error.response.data);
        setError(error.response.data.message);
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.message || "Something went wrong!",
          footer: '<a href="#">Why do I have this issue?</a>',
          confirmButtonColor: '#3D92F1'
        });
      } else {
        console.error('Login failed:', error.message);
        setError('Failed to sign in. Please try again.');
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to sign in. Please try again.",
          footer: '<a href="#">Why do I have this issue?</a>',
          confirmButtonColor: '#3D92F1'
        });
      }
    }
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="flex flex-col lg:flex-row w-full h-screen">
        <div className="lg:w-3/5 h-screen flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <Typography variant="h2" className="font-bold mb-2" style={{ color: '#3D92F1' }}>
                Sign In
              </Typography>
            
              <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
                Enter your email and password to Sign In.
              </Typography>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-4">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Your email
                </Typography>
                <Input
                  value={userlogin.email}
                  onChange={(e) => setUserLogin({ ...userlogin, email: e.target.value })}
                  size="lg"
                  placeholder="name@mail.com"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div className="mb-4">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Password
                </Typography>
                <Input
                  value={userlogin.password}
                  onChange={(e) => setUserLogin({ ...userlogin, password: e.target.value })}
                  type="password"
                  size="lg"
                  placeholder="********"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <Checkbox
                label={
                  <Typography
                    variant="small"
                    color="gray"
                    className="flex items-center justify-start font-medium"
                  >
                    I agree to the&nbsp;
                    <a
                      href="#"
                      className="font-normal text-black transition-colors hover:text-gray-900 underline"
                      style={{ color: '#3D92F1' }}
                    >
                      Terms and Conditions
                    </a>
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              <Button className="mt-6" fullWidth style={{ backgroundColor: '#3D92F1', color: '#ffffff' }} type="submit">
                Sign In
              </Button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <div className="flex items-center justify-center mt-6">
                <Typography variant="small" className="font-medium text-gray-900">
                  <a href="#">
                    Forgot Password
                  </a>
                </Typography>
              </div>
              <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
                Not registered?
                <Link to="/sign-up" className="text-[#3D92F1] ml-1">Create account</Link>
              </Typography>
            </form>
          </div>
        </div>
        <div className="lg:w-2/5 h-screen hidden lg:flex items-center justify-center">
          <img src={signinImage} alt="Sign in image" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}

export default SignIn;
