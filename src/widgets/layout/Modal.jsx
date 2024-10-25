import React from 'react';
import nft from '/img/nft.jpg';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

export function Modal({ open, onClose }) {
  if (!open) return null;

  return (
    <div onClick={onClose} className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='max-w-2xl w-full bg-white rounded-lg shadow-md flex'
      >
        <img src={nft} alt='/' style={{ width: '250px', objectFit: 'cover', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }} />
        <div className='flex flex-col p-4'>
        <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        New Collaboration
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Nice to see you! Enter your details to your Projct.
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Project Name
          </Typography>
          <Input
            size="lg"
            placeholder="Project name"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Members
          </Typography>
          <Input
            size="lg"
            placeholder="name@mail.com"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Desciption
          </Typography>
          <Input
            size="lg"
            placeholder="Desciption"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
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
              className="flex items-center font-normal"
            >
              I agree the
              <a
                href="#"
                className="font-medium transition-colors hover:text-gray-900"
              >
                &nbsp;Terms and Conditions
              </a>
            </Typography>
          }
          containerProps={{ className: "-ml-2.5" }}
        />
        <Button className="mt-6" fullWidth>
          Add Collaboration
        </Button>
 
      </form>
    </Card>
       
        </div>
      </div>
    </div>
  );
}

export default Modal;
