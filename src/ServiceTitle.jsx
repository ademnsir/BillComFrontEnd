import React from "react";
import { FaVideo } from "react-icons/fa"; 

export function ServiceTitle() {
  return (
    <div className="text-center mt-15">
    
      <div className="floating"> 
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white">
          Discover and Shop the Latest <span className="text-[#B60B59]">Tech Gadgets</span> with Ease.{" "}
        </h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
          Exclusive deals. Fast delivery. Exceptional quality.
        </p>
      </div>
    </div>
  );
}

export default ServiceTitle;
