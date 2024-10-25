import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AuthenticationService from '@/Services/Authentification/AuthentificationService';
import { StatsComponent, PieChartComponent, LineChartComponent, RadialPieChartComponent, RadarChartComponent } from '@/Components/Consultations/Metting/IA/Statistique';
export function UsersSatistique() {
    const location = useLocation();
    const champ = location.state.champ;
    const Authservice = new AuthenticationService();
    const [userA, setUserA] = useState({});
    const [userB, setUserB] = useState({});
    const [ClientAStats, setClientAStats] = useState({});
    const [ClientBStats, setClientBStats] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            // Récupérer les données utilisateur pour userA et userB
            const userDataA = await Authservice.getUserById(champ.clientAID);
            const userDataB = await Authservice.getUserById(champ.clientBID);

            // Mettre à jour les états des utilisateurs
            setUserA(userDataA);
            setUserB(userDataB);

            if (champ.responseClientA && champ.responseClientB) {
                const moodRegex = /\((\d{2}:\d{2}:\d{2}), (\w+)\)/g;
                let matches;
                const parsedDataA = [];
                const parsedDataB = [];

                while ((matches = moodRegex.exec(champ.responseClientA)) !== null) {
                    const [_, time, mood] = matches;
                    parsedDataA.push({ time, mood });
                }
                while ((matches = moodRegex.exec(champ.responseClientB)) !== null) {
                    const [_, time, mood] = matches;
                    parsedDataB.push({ time, mood });
                }

                setClientAStats(parsedDataA);
                setClientBStats(parsedDataB);
            } else {
                console.error('responseClientA or responseClientB is not defined.');
            }
        };

        fetchData(); // Appeler fetchData une fois que le composant est monté
    }, [champ.clientAID, champ.clientBID]); // Les dépendances de useEffect


    // Utiliser les données utilisateur comme nécessaire
    return (
        <div className='flex pt-[50px]'>
            <div className='w-1/2 flex flex-col items-center mr-2'>
                <div className="user-card bg-gray-200 rounded-lg shadow-2xl p-4 mb-8 relative">
                    <div className="flex items-center mb-2">
                        <img
                            src={`https://colabhub.onrender.com/images/${userA?.picture || 'team-1.jpg'}`}
                            alt="User A"
                            className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                            <span>{userA.nom} </span>
                            <span className="inline-block"> </span>
                            <span>{userA.prenom}</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-orange-500"></div>
                    <StatsComponent></StatsComponent>
                    <div className='pl-4'>
                        <RadarChartComponent moodStatistics={ClientAStats} />
                    </div>
                    <div className='mt-4'>
                        <PieChartComponent moodStatistics={ClientAStats} />
                    </div>
                    <div className='mt-4'>
                        <LineChartComponent moodStatistics={ClientAStats} />
                    </div>
                </div>
            </div>
            {/* Div pour l'espace entre les deux cartes */}
            <div className="w-1/12"></div>
            <div className='w-1/2 flex flex-col items-center ml-2'>
                <div className="user-card bg-gray-200 rounded-lg shadow-2xl p-4 mb-8 relative">
                    <div className="flex items-center mb-2">
                        <img
                            src={`https://colabhub.onrender.com/images/${userB?.picture || 'team-1.jpg'}`}
                            alt="User B"
                            className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                            <span>{userB.nom} </span>
                            <span className="inline-block"> </span>
                            <span>{userB.prenom}</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-orange-500"></div>
                    <StatsComponent></StatsComponent>
                    <div className='pl-4'>
                        <RadarChartComponent moodStatistics={ClientBStats} />
                    </div>
                    <div className='mt-4'>
                        <PieChartComponent moodStatistics={ClientBStats} />
                    </div>
                    <div className='mt-4'>
                        <LineChartComponent moodStatistics={ClientBStats} />
                    </div>
                </div>
            </div>
        </div>
    );
    
    

    
    
    
    

    
    
    
}
