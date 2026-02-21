import React, { useState } from 'react';
import VisaHero from '../components/visa/VisaHero';
import VisaFeatures from '../components/visa/VisaFeatures';
import VisaSteps from '../components/visa/VisaSteps';
import VisaFAQ from '../components/visa/VisaFAQ';
import { useGlobal } from '../context/GlobalContext';

const VisaPage = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { formatPrice } = useGlobal();

  return (
    <div className="min-h-screen flex flex-col pt-16"> {/* Add padding top for fixed navbar */}

      {/* Hero Section with Search Form */}
      <VisaHero
        setSearchResults={setSearchResults}
        setLoading={setLoading}
      />

      {/* Search Results Section (Conditionally Rendered) */}
      {loading && (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Searching specifically for you...</p>
        </div>
      )}

      {searchResults && (
        <section id="results" className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {searchResults.length > 0 ? `Found ${searchResults.length} Visa Options` : 'No visas found matching your criteria.'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((visa) => (
                <div key={visa._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="h-48 bg-gray-200 relative">
                    {visa.images && visa.images[0] ? (
                      <img
                        src={visa.images[0]}
                        alt={visa.country}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0729?w=400'; }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-blue-100 text-blue-500 font-bold">
                        {visa.country}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {visa.visaType}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 flex justify-between items-center">
                      {visa.country}
                      <span className="text-blue-600 text-lg">{formatPrice(visa.cost)}</span>
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between border-b pb-1">
                        <span>Processing Time:</span>
                        <span className="font-medium">{visa.processingTime}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span>Duration:</span>
                        <span className="font-medium">{visa.duration}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span>Validity:</span>
                        <span className="font-medium">{visa.validity}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span>Entry:</span>
                        <span className="font-medium">{visa.entryType}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => window.location.href = `/visa/${visa._id}`}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium transition-colors"
                    >
                      View Details & Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Clear Search Button */}
            <div className="text-center mt-8">
              <button
                onClick={() => setSearchResults(null)}
                className="text-blue-600 hover:underline font-medium"
              >
                Clear results and show all features
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Sections (Hidden when searching to mimic 'focused' interactions, or always shown based on UX preference. 
          The reference site usually keeps them or scrolls down. We'll keep them but results appear on top.) */}

      {!searchResults && (
        <>
          <VisaFeatures />
          <VisaSteps />
          <VisaFAQ />
        </>
      )}

    </div>
  );
};

export default VisaPage;
