import Statistiques from '@/Services/statistiques/Statistiques';
import React, { useEffect, useState } from 'react'
import DashboardStatsGrid from '../components/DashboardStatsGrid';
import Header from '../components/shared/Header';
import Sidebar from '../components/shared/Sidebar';
import AcceuilJobs from '../components/AcceuilJobs';

const JobsBackOffice = () => {
   

    return (
        <div className="pt-3 flex flex-col gap-4 bg-blue-gray">
      <DashboardStatsGrid />
      <div className="flex flex-row gap-4 w-full">
        {/* Passer les statistiques d'humeur formatées */}
      </div>
      <div className="flex flex-row gap-4 w-full">
        <AcceuilJobs />
      </div>
    </div>
  );
}

export default JobsBackOffice