import React from 'react';

export function Cardsgrids() {
  // projects should be an array of objects for mapping
  var projects = [
    { name: "project name 1", description: "description 1" },
    { name: "project name 2", description: "description 2" },
    { name: "project name 3", description: "description 3" },
    { name: "project name 4", description: "description 4" },
    // Add more projects as needed
  ];

  return (
    <>
<div className="grid-cols-1 sm:grid md:grid-cols-2 ">
      {projects.map((project, index) => (
       
       <div
         className="mx-3 mt-6 flex flex-col self-start rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 sm:shrink-0 sm:grow sm:basis-0 " key={index} >
       
         <div className="p-6 group border rounded-lg cursor-pointer -mb-6 hover:bg-orange-400 hover:text-white">
           <h5
             className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
              {project.name}
           </h5>
           <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
            {project.description}
           </p>
         </div>
       </div>
       
      ))}
       </div>
    </>
  );
}

export default Cardsgrids;
