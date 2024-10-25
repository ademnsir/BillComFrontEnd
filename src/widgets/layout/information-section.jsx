import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Typography } from "@material-tailwind/react";
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/pages/authContext";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  FireIcon,
} from "@heroicons/react/24/solid";
import { InfoCard  } from "@/widgets/cards/info-card";








export function InformationSection() {

  const [Project, setProject] = useState([]);
  const { authData } = useAuth();

  useEffect(() => {
    if(authData.user){
      fetch(`https://colabhub.onrender.com/jobs/freelancers/${authData.user._id}`)
      .then(response => response.json())
      .then(data => setProject(data))
      .catch(error => console.error("Error fetching consultation details:", error));

    }
   
  }, []);





  const projectsData = Project.map((item) => ({
    icon: BriefcaseIcon,
    title: item.title,
    date: "2014",
    children: item.expertiseLevel,
    id:item._id,
  }));

  return (
    <section className="pb-28 px-8">
      <div className="grid xl:grid-cols-1 md:grid-cols-1 container gap-20 mx-auto items-start">
        <div>
          
          <div className="container mx-auto grid grid-cols-1 gap-16 gap-y-12">
          
 

          {projectsData.map((props, idx) => (
            <Link to={`/freelancercollab/${props.id}/${authData.user._id}`} className="group border p-1 rounded-lg cursor-pointer -mb-6 hover:bg-gray-200 hover:text-gray">
              
              <InfoCard key={idx} {...props} />
              </Link>
            ))}

          </div>
        </div>
        {/*
        <div>
          <div className="mb-10">
            <Typography color="blue-gray" className="mb-2 text-3xl font-bold">
              Projects
            </Typography>
            <Typography variant="lead" className="!text-gray-500">
              See my Projects.
            </Typography>
          </div>
          <div className="container mx-auto grid grid-cols-1 gap-16 gap-y-12">
            {EXPERIENCE.map((props, idx) => (

               <Link to="/projectcollab" className="group border p-1 rounded-lg cursor-pointer -mb-6 hover:bg-gray-200 hover:text-gray">
              <InfoCard key={idx} {...props} />
              </Link>

            ))}
                        

          </div>
        </div>
      </div>
      <div>
      */ }
        
      </div>

    </section>
  );
}

export default InformationSection;
