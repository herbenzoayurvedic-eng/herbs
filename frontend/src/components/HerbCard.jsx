import { Link } from 'react-router-dom';

const HerbCard = ({ herb }) => {
  return (
    <Link to={`/herb/${herb.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:scale-[1.02]">
        <img
          src={herb.imageUrl || "/neem_1.jpg"}
          alt={herb.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">{herb.name}</h3>
          <p className="text-gray-700 italic mb-3">{herb.scientificName}</p>
          <p className="text-gray-600 text-sm line-clamp-3">{herb.introduction}</p>
        </div>
      </div>
    </Link>
  );
};

export default HerbCard;

