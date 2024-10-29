import React, { useState, useMemo, useEffect } from 'react';
import { Input, Checkbox, Button, Typography, Radio } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import countryList from 'react-select-country-list';
import axios from 'axios';
import Swal from 'sweetalert2';

export function SignUp() {
  const [user, setUser] = useState({
    FirstName: '',
    LastName: '',
    Password: '',
    Email: '',
    ConfirmPassword: '',
    Country: '',
    Address: '',
    PostalCode: '',
    Phone: '',
    Checkbox: true,
    Type: "Utilisateur",
    Genre: '',
    DateNaissance: '', // Ajout du champ Date de Naissance
  });

  const [selectedCountry, setSelectedCountry] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/img/image2.jpg',
    '/img/image1.jpg',
    '/img/image3.jpg'
  ];

  const CountrySelector = () => {
    const options = useMemo(() => countryList().getData(), []);

    const changeHandler = (selectedOption) => {
      setSelectedCountry(selectedOption);
      setErrors({ ...errors, countryError: '' });
    };

    return <Select placeholder="Select your Country" options={options} value={selectedCountry} onChange={changeHandler} />;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const validateField = (fieldName, value) => {
    const nameRegex = /^[A-Za-z]{3,}$/;
    const addressRegex = /^[A-Za-z0-9\s]+$/;

    switch (fieldName) {
      case 'FirstName':
        return value ? (nameRegex.test(value) ? '' : 'First name must be at least 3 characters long and contain only letters.') : 'Please enter your first name.';
      case 'LastName':
        return value ? (nameRegex.test(value) ? '' : 'Last name must be at least 3 characters long and contain only letters.') : 'Please enter your last name.';
      case 'Email':
        return value ? (/^\S+@\S+\.\S+$/.test(value) ? '' : 'Please enter a valid email address.') : 'Please enter your email address.';
      case 'Password':
        return value ? (value.length >= 8 && /\d{3}/.test(value) ? '' : 'Password must be at least 8 characters long and contain 3 digits.') : 'Please enter your password.';
      case 'ConfirmPassword':
        return value ? (value === user.Password ? '' : 'Passwords do not match.') : 'Please confirm your password.';
      case 'Address':
        return value ? (addressRegex.test(value) ? '' : 'Address must contain only letters and numbers.') : 'Please enter your address.';
      case 'PostalCode':
        return value ? '' : 'Please enter your postal code.';
      case 'Phone':
        return value ? '' : 'Please enter your phone number.';
      case 'Genre':
        return value ? '' : 'Please select your gender.';
      case 'DateNaissance':
        return value ? '' : 'Please enter your date of birth.';
      default:
        return '';
    }
  };

  const handleChange = (fieldName, value) => {
    setUser({ ...user, [fieldName]: value });
    setErrors({ ...errors, [`${fieldName}Error`]: validateField(fieldName, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldErrors = Object.keys(user).reduce((acc, fieldName) => {
      const error = validateField(fieldName, user[fieldName]);
      if (error) acc[`${fieldName}Error`] = error;
      return acc;
    }, {});

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    const formData = {
      nom: user.LastName,
      prenom: user.FirstName,
      email: user.Email,
      password: user.Password,
      confirmPassword: user.ConfirmPassword,
      pays: selectedCountry?.label || '',
      adresse: user.Address,
      codePostal: user.PostalCode,
      telephone: user.Phone,
      genre: user.Genre,
      dateNaissance: user.DateNaissance // Assurez-vous que la date de naissance est incluse
    };

    try {
      const response = await axios.post('https://backendbillcom-production.up.railway.app/auth/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('User added:', response.data);
      setShowSuccessAlert(true);
      setUser({ FirstName: '', LastName: '', Email: '', Password: '', ConfirmPassword: '', Country: '', Address: '', PostalCode: '', Phone: '', Checkbox: true, Type: 'Utilisateur', Genre: '', DateNaissance: '' });
      setSelectedCountry('');

      setErrors({});
      
      Swal.fire({
        title: 'Success!',
        text: 'Registration completed successfully.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      }).then(() => {
        setTimeout(() => {
          navigate('/sign-in');
        }, 3000);
      });
    } catch (error) {
      console.error('Error adding user:', error);
      setErrors({ ...errors, formError: 'Failed to add user. Please try again later.' });
    }
  };

  return (
    <div className='pt-24'>
      <section className="m-8 flex">
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center mt-14">
          <div className="text-center mb-4">
            <Typography variant="h2" className="font-bold" style={{ color: '#3D92F1' }}>
              Join Us Today
            </Typography>
          </div>

          <form className="mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 mr-1">
                <Input
                  value={user.FirstName}
                  onChange={(e) => handleChange('FirstName', e.target.value)}
                  size="lg"
                  placeholder="First Name"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900 w-full"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                {errors.FirstNameError && <p className="text-red-500 text-xs italic mt-1">{errors.FirstNameError}</p>}
              </div>
              <div className="flex flex-col sm:flex-row mt-5 sm:mt-0">
                <Input
                  value={user.LastName}
                  onChange={(e) => handleChange('LastName', e.target.value)}
                  size="lg"
                  placeholder="Last Name"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900 w-full"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                {errors.LastNameError && <p className="text-red-500 text-xs italic mt-1">{errors.LastNameError}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-6 py-6">
              <Input
                value={user.Email}
                onChange={(e) => handleChange('Email', e.target.value)}
                size="lg"
                placeholder="Email"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              {errors.EmailError && <p className="text-red-500 text-xs italic mt-1">{errors.EmailError}</p>}
            </div>

            <div className="mb-1 flex flex-col gap-6 pb-4">
              <Input
                value={user.Password}
                onChange={(e) => handleChange('Password', e.target.value)}
                size="lg"
                type="password"
                placeholder="Password"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              {errors.PasswordError && <p className="text-red-500 text-xs italic mt-1">{errors.PasswordError}</p>}
            </div>

            <div className="mb-1 flex flex-col gap-6 pb-4">
              <Input
                value={user.ConfirmPassword}
                onChange={(e) => handleChange('ConfirmPassword', e.target.value)}
                size="lg"
                type="password"
                placeholder="Confirm password"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              {errors.ConfirmPasswordError && <p className="text-red-500 text-xs italic mt-1">{errors.ConfirmPasswordError}</p>}
            </div>

            <div className="mb-1 flex flex-col gap-6 pb-4">
              <Input
                value={user.Address}
                onChange={(e) => handleChange('Address', e.target.value)}
                size="lg"
                placeholder="Address"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              {errors.AddressError && <p className="text-red-500 text-xs italic mt-1">{errors.AddressError}</p>}
            </div>

            <div className="mb-1 flex flex-col gap-6 pb-4">
              <Input
                value={user.PostalCode}
                onChange={(e) => handleChange('PostalCode', e.target.value)}
                size="lg"
                placeholder="Postal Code"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              {errors.PostalCodeError && <p className="text-red-500 text-xs italic mt-1">{errors.PostalCodeError}</p>}
            </div>

            <div className="mb-1 flex flex-col gap-6 pb-4">
              <Input
                value={user.Phone}
                onChange={(e) => handleChange('Phone', e.target.value)}
                size="lg"
                placeholder="Phone"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              {errors.PhoneError && <p className="text-red-500 text-xs italic mt-1">{errors.PhoneError}</p>}
            </div>

            <CountrySelector />
            {errors.countryError && <p className="text-red-500 text-xs italic mt-1">{errors.countryError}</p>}

            <div className="mb-4">
              <br></br>
              <div className="flex gap-4">
                <Radio
                  id="male"
                  name="genre"
                  label="Male"
                  checked={user.Genre === 'Male'}
                  onChange={() => handleChange('Genre', 'Male')}
                />
                <Radio
                  id="female"
                  name="genre"
                  label="Female"
                  checked={user.Genre === 'Female'}
                  onChange={() => handleChange('Genre', 'Female')}
                />
              </div>
              {errors.genreError && <p className="text-red-500 text-xs italic mt-1">{errors.genreError}</p>}
            </div>

            <div className="mb-1 flex flex-col gap-6 pb-4">
              <Input
                value={user.DateNaissance}
                onChange={(e) => handleChange('DateNaissance', e.target.value)}
                size="lg"
                type="date"
                placeholder="Date of Birth"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              {errors.DateNaissanceError && <p className="text-red-500 text-xs italic mt-1">{errors.DateNaissanceError}</p>}
            </div>

            <div className='pt-3'>
              <Checkbox
                value={user.Checkbox}
                onClick={() => { setUser({ ...user, Checkbox: !user.Checkbox }) }}
                label={
                  <Typography
                    variant="small"
                    color="gray"
                    className="flex items-center justify-start font-medium  p-2"
                  >
                    I agree the&nbsp;
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
            </div>
            <Button type="submit" className="mt-6 bg-orange-400" fullWidth style={{ backgroundColor: '#3D92F1' }}>
  Register Now
</Button>

            <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
              Already have an account?
              <Link to="/sign-in" className="text-gray-900 ml-1" style={{ color: '#3D92F1' }}>
                Sign in
              </Link>
            </Typography>
          </form>
        </div>

        {/* Image à droite de la page */}
        <div className="hidden md:block w-[500px] h-[50px] ml-11">
          <img
            src={images[currentIndex]}
            className="object-cover rounded-2xl"
            alt="Pattern"
          />
        </div>
      </section>
    </div>
  );
}

export default SignUp;
