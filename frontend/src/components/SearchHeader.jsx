import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchHeader = ({ herbs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const sectionRefs = useRef({});
  const navigate = useNavigate();

  // Generate alphabet array
  const alphabets = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  }, []);

  // Organize herbs alphabetically
  const organizedHerbs = useMemo(() => {
    if (!herbs || herbs.length === 0) return {};

    const grouped = {};
    
    herbs.forEach((herb) => {
      const name = herb.Herb_Name || herb.name || '';
      if (!name) return;
      
      const firstLetter = name.charAt(0).toUpperCase();
      if (!/[A-Z]/.test(firstLetter)) {
        // If doesn't start with a letter, put in '#'
        if (!grouped['#']) grouped['#'] = [];
        grouped['#'].push(herb);
      } else {
        if (!grouped[firstLetter]) grouped[firstLetter] = [];
        grouped[firstLetter].push(herb);
      }
    });

    // Sort each group alphabetically
    Object.keys(grouped).forEach((letter) => {
      grouped[letter].sort((a, b) => {
        const nameA = (a.Herb_Name || a.name || '').toLowerCase();
        const nameB = (b.Herb_Name || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });

    return grouped;
  }, [herbs]);

  // Filter herbs based on search query
  const filteredHerbs = useMemo(() => {
    if (!searchQuery.trim()) return organizedHerbs;

    const query = searchQuery.toLowerCase();
    const filtered = {};

    Object.keys(organizedHerbs).forEach((letter) => {
      const matching = organizedHerbs[letter].filter((herb) => {
        const name = (herb.Herb_Name || herb.name || '').toLowerCase();
        return name.includes(query);
      });
      if (matching.length > 0) {
        filtered[letter] = matching;
      }
    });

    return filtered;
  }, [searchQuery, organizedHerbs]);

  // Handle alphabet click - scroll to section
  const handleAlphabetClick = (letter) => {
    const sectionId = `section-${letter}`;
    const sectionElement = sectionRefs.current[sectionId];
    
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle herb name click - navigate to herb detail
  const handleHerbClick = (herb) => {
    const slug = herb.slug || herb._id;
    if (slug) {
      navigate(`/herb/${slug}`);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Get all available letters (including # for non-letter starting names)
  const availableLetters = useMemo(() => {
    const letters = Object.keys(filteredHerbs).sort();
    return letters;
  }, [filteredHerbs]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo/Title */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Herbs Collection</h1>
            <p className="text-sm text-gray-600 mt-1">Explore Traditional Medicinal Herbs</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search herbs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsOpen(true)}
                className="w-full px-3 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 transition-colors text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Dropdown */}
            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-50 max-h-[270px] overflow-hidden flex flex-col md:flex-row"
              >
                {/* Left Column - Alphabet Grid */}
                <div className="w-full md:w-32 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 p-2 overflow-y-auto">
                  <div className="grid grid-cols-6 md:grid-cols-3 gap-1">
                    {alphabets.map((letter) => {
                      const hasHerbs = availableLetters.includes(letter);
                      return (
                        <button
                          key={letter}
                          onClick={() => handleAlphabetClick(letter)}
                          disabled={!hasHerbs}
                          className={`
                            px-2 py-1 text-xs font-medium rounded transition-all
                            ${
                              hasHerbs
                                ? 'text-black hover:text-green-700 cursor-pointer'
                                : 'text-gray-400 cursor-not-allowed'
                            }
                          `}
                        >
                          {letter}
                        </button>
                      );
                    })}
                    {availableLetters.includes('#') && (
                      <button
                        onClick={() => handleAlphabetClick('#')}
                        className="px-2 py-1 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 transition-all"
                      >
                        #
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column - Herb Names */}
                <div className="flex-1 overflow-y-auto max-h-[350px] p-2">
                  {availableLetters.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      <p className="text-sm">No herbs found</p>
                    </div>
                  ) : (
                    availableLetters.map((letter) => (
                      <div
                        key={letter}
                        id={`section-${letter}`}
                        ref={(el) => (sectionRefs.current[`section-${letter}`] = el)}
                        className="mb-3 scroll-mt-2"
                      >
                        <h3 className="text-xs font-semibold text-gray-600 mb-1 sticky top-0 bg-white py-1">
                          {letter}
                        </h3>
                        <ul className="space-y-0.5">
                          {filteredHerbs[letter].map((herb) => {
                            const name = herb.Herb_Name || herb.name || 'Unnamed';
                            return (
                              <li key={herb.slug || herb._id || name}>
                                <button
                                  onClick={() => handleHerbClick(herb)}
                                  className="w-full text-left px-2 py-1 rounded text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                                >
                                  {name}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;

