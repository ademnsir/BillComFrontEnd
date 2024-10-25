import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();
  const animatedImageURL = "img/serror.png"; // Professional 3D animated 404 error GIF


    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', padding: '20px', textAlign: 'center' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
             
                <h1 style={{ fontSize: '10rem', fontWeight: 'bold', color: '#B60B59', marginBottom: '20px' }}>
                <img
    src={animatedImageURL}
    alt="3D Animated Image"
    style={{ width: '100%', maxWidth: '500px', maxHeight: '500px', margin: '0 auto 20px' }}
/>

                </h1>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
    <span style={{ color: '#B60B59' }}>Oops!</span> Page Not Found
</h2>

                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <button
                    onClick={() => navigate('/')}
                    style={{ padding: '10px 20px', fontSize: '1rem', fontWeight: 'bold', color: '#fff', backgroundColor: '#B60B59', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#900C3F'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#B60B59'}
                >
                    Go Back To Home Page
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;
