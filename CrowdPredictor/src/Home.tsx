
// src/Home.tsx
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="app-title">Welcome to the Crowd Predictor</h1>
      <img src="/unnamed-removebg-preview.png" alt="Description" className="home-image" /> {/* Add your image here */}
      <button onClick={() => navigate('/app')}>
        Enter App
      </button>
    </div>
  );
};

export default Home;
