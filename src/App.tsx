import React, { useState, useEffect } from 'react';
import './index.css';

interface Alert {
  id: string;
  headline: string;
  description: string;
  severity: string;
  areas: string;
}

const WeatherAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string>('headline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('https://api.weather.gov/alerts/active');
        if (!response.ok) throw new Error('Failed to fetch alerts');
        const data = await response.json();
        interface Feature {
          id: string;
          properties: {
            headline?: string;
            description?: string;
            severity?: string;
            areaDesc?: string;
          };
        }

        const formattedAlerts = data.features.map((feature: Feature) => ({
          id: feature.id,
          headline: feature.properties.headline || 'No Headline',
          description: feature.properties.description || 'No Description',
          severity: feature.properties.severity || 'Unknown',
          areas: feature.properties.areaDesc || 'Unknown',
        }));
        setAlerts(formattedAlerts);
        setFilteredAlerts(formattedAlerts);
      } catch (err) {
        setError('Failed to load alerts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  useEffect(() => {
    const updatedAlerts = alerts.filter((alert) =>
      alert.severity.toLowerCase().includes(filter.toLowerCase())
    );

    updatedAlerts.sort((a, b) => {
      const valueA = a[sortColumn as keyof Alert]?.toString().toLowerCase() || '';
      const valueB = b[sortColumn as keyof Alert]?.toString().toLowerCase() || '';
      return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    setFilteredAlerts(updatedAlerts);
  }, [filter, alerts, sortColumn, sortOrder]);

  const handleSort = (column: string) => {
    setSortOrder(sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc');
    setSortColumn(column);
  };

  if (loading) {
    return <p className="text-center mt-4 text-lg font-semibold">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-4 text-red-500 font-semibold">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">National Weather Alerts by NWS</h1>
      <div className="mb-6 flex justify-center">
        <input 
          type="text" 
          placeholder="Filter by severity..." 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          className="border p-3 rounded w-full max-w-md shadow-md"
        />
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-white rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th onClick={() => handleSort("headline")} className="border p-4 cursor-pointer hover:bg-blue-700">Headline</th>
              <th onClick={() => handleSort("severity")} className="border p-4 cursor-pointer hover:bg-blue-700">Severity</th>
              <th onClick={() => handleSort("areas")} className="border p-4 cursor-pointer hover:bg-blue-700">Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.length === 0 ? (
              <tr><td colSpan={3} className="text-center p-6 text-lg font-semibold">No active alerts.</td></tr>
            ) : (
              filteredAlerts.map((alert, index) => (
                <tr key={alert.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="border p-4">{alert.headline}</td>
                  <td className={`border p-4 font-semibold ${alert.severity === "Severe" ? "text-red-600" : "text-gray-800"}`}>{alert.severity}</td>
                  <td className="border p-4">{alert.areas}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeatherAlerts;