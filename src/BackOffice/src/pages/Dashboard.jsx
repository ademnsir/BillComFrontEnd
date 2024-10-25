import DashboardStatsGrid from '../components/DashboardStatsGrid'
import TransactionChart from '../components/TransactionChart'
import AcueilStats from '../components/AcueilStats'
import BuyerProfilePieChart from '../components/BuyerProfilePieChart'
import PopularProducts from '../components/PopularProducts'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StatsComponent, PieChartComponent, LineChartComponent, RadialPieChartComponent, RadarChartComponent } from "@/Components/Consultations/Metting/IA/Statistique";
import Statistiques from '@/Services/statistiques/Statistiques'
export default function Dashboard() {
  const [clientA, setClientA] = useState([]);
  const StatistiqueService = new Statistiques();

  // Fonction pour formater les données d'humeur dans le format attendu
  const formatMoodStatistics = (clientAData) => {
    if (!Array.isArray(clientAData)) return [];
    
    // Logique pour formater les données d'humeur
    const moodStatistics = clientAData.map(data => {
      // Enlever les crochets `[ ]` du début et de la fin
      const trimmedData = data.replace(/^\[|\]$/g, '');
      // Par exemple, si le format est "(humeur: valeur)", nous le séparons en [humeur, valeur]
      const [mood, value] = trimmedData.split(', ');
      return { mood, moodValue: parseInt(value), maxMark: 100 };
    });
  
    return moodStatistics;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await StatistiqueService.getAllStatistiques();
        const clientAData = stats.map(champ => champ.responseClientA);
        setClientA(clientAData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-3 flex flex-col gap-4 bg-blue-gray">
      <DashboardStatsGrid />
      <div className="flex flex-row gap-4 w-full">
        {/* Passer les statistiques d'humeur formatées */}
      </div>
      <div className="flex flex-row gap-4 w-full">
        <AcueilStats />
      </div>
    </div>
  );
}