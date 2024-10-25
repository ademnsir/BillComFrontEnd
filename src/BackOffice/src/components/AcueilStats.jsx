import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { getOrderStatus } from '../lib/helpers';
import Statistiques from '@/Services/statistiques/Statistiques';
import AuthenticationService from '@/Services/Authentification/AuthentificationService';

const pageSize = 20; // Nombre d'éléments par page

export default function AcueilStats() {
    const [currentPage, setCurrentPage] = useState(1);
    const [stats, setStats] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Define the loading state
    const StatistiqueService = new Statistiques();
    const AuthenticationS = new AuthenticationService();
    
    // Define cachedData for caching fetched statistics data
    const [cachedData, setCachedData] = useState({});

    const totalPages = Math.ceil(stats.length / pageSize);

    const currentOrders = stats.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => {
        const fetchData = async () => {
            if (cachedData[currentPage]) {
                setStats(cachedData[currentPage].stats);
            } else {
                const statsData = await StatistiqueService.getAllStatistiques();
                setStats(statsData);
                setCachedData(prevState => ({
                    ...prevState,
                    [currentPage]: { stats: statsData }
                }));
            }
        };
    
        fetchData(); // Appel initial au chargement du composant
    
        const interval = setInterval(() => {
            fetchData();
            // Force la mise à jour du composant
            setForceUpdate(prev => !prev);
        }, 5000); // Rafraîchir les données toutes les 5 secondes
    
        return () => clearInterval(interval); 
    }, [currentPage, cachedData]); 
    
    // État pour forcer la mise à jour du composant
    const [forceUpdate, setForceUpdate] = useState(false);
    
    

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowClick = (champ) => {
        navigate('/dashboard/usersSatistique', { state: { champ: champ } });
    };

    return (
        <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
            <strong className="text-gray-700 font-medium">Recent Orders</strong>
            <div className="border-x border-gray-200 rounded-sm mt-3">
                <table className="w-full text-gray-700">
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-4 py-2">Consultant</th>
                            <th className="border border-gray-400 px-4 py-2">Consulté</th>
                            <th className="border border-gray-400 px-4 py-2">Channel</th>
                            <th className="border border-gray-400 px-4 py-2">Date</th>
                            <th className="border border-gray-400 px-4 py-2">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Loading...</td></tr>
                        ) : (

                            currentOrders.map((champ) => (
                                <tr key={champ._id} onClick={() => handleRowClick(champ)} className="hover:bg-gray-100 select-none">
                                    <td className="border border-gray-400 px-4 py-2">
                                        {champ.clientA && champ.clientA.picture ? (
                                            <div className='flex items-center pr'>
                                                <img
                                                    src={`https://colabhub.onrender.com/images/${champ.clientA.picture || 'team-1.jpg'}`}
                                                    alt="User"
                                                    className="w-8 h-8 mr-2 rounded-full"
                                                />
                                                <span className='text-center'>{champ.clientA.nom} {champ.clientA.prenom}</span>
                                            </div>
                                        ) : (
                                            "loading..."
                                        )}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2">
                                        {champ.clientB && champ.clientB.picture ? (
                                            <div className='flex items-center '>
                                                <img
                                                    src={`https://colabhub.onrender.com/images/${champ.clientB.picture || 'team-1.jpg'}`}
                                                    alt="User"
                                                    className="w-8 h-8 mr-2 rounded-full"
                                                />
                                                <span className='text-center'>{champ.clientB.nom} {champ.clientB.prenom}</span>
                                            </div>
                                        ) : (
                                            "loading..."
                                        )}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-center">  {champ.channel} </td>
                                    <td className="border border-gray-400 px-4 py-2 text-center">{format(new Date(champ.dateEnrg), 'dd MMM yyyy')}</td>
                                    <td className="border border-gray-400 py-2 text-center">
                                    {champ.status ? getOrderStatus(champ.status.toUpperCase()) : ''}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Boutons de pagination */}
            <div className="flex justify-center mt-4">
                {[...Array(totalPages).keys()].map((page) => (
                    <button
                        key={page}
                        className={`px-3 py-1 mx-1 ${currentPage === page + 1 ? 'bg-gray-200' : 'bg-white'
                            } border border-gray-300`}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
