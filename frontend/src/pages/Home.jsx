import { useState, useEffect } from 'react';
import HerbCard from '../components/HerbCard';

const Home = () => {
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHerbs();
  }, []);

  const fetchHerbs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/herbs');
      if (!response.ok) {
        throw new Error('Failed to fetch herbs');
      }

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setHerbs(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch herbs');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to server');
      console.error('Error fetching herbs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading herbs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600 text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchHerbs}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Herbs Collection</h1>
          <p className="text-gray-600">Explore Traditional Medicinal Herbs</p>
        </div>

        {herbs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No herbs found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
            {herbs.map((herb, index) => (
              <HerbCard key={herb.slug || herb.Herb_Name || herb._id || index} herb={herb} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

