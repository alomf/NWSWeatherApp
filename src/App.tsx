import React, { useState, useEffect } from "react";
import "./index.css";

// Define the structure of an Alert object
interface Alert {
  id: string;
  headline: string;
  description: string;
  severity: string;
  areas: string;
}

const WeatherAlerts: React.FC = () => {
  // State to hold all alerts fetched from the API
  const [alerts, setAlerts] = useState<Alert[]>([]);
  // State to hold filtered and sorted alerts
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  // State to indicate whether data is still loading
  const [loading, setLoading] = useState<boolean>(true);
  // State to hold any error messages
  const [error, setError] = useState<string | null>(null);
  // State to hold the current filter value
  const [filter, setFilter] = useState<string>("");
  // State to hold the column used for sorting
  const [sortColumn, setSortColumn] = useState<string>("headline");
  // State to hold the sorting order (ascending or descending)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Define the structure of the API response features
  interface Feature {
    id: string;
    properties: {
      headline?: string;
      description?: string;
      severity?: string;
      areaDesc?: string;
    };
  }
  // Fetch alerts from the API when the component mounts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("https://api.weather.gov/alerts/active");
        if (!response.ok) throw new Error("Failed to fetch alerts");
        const data = await response.json();

        // Format the API response into the Alert structure
        const formattedAlerts = data.features.map((feature: Feature) => ({
          id: feature.id,
          headline: feature.properties.headline ?? "No Headline",
          description: feature.properties.description ?? "No Description",
          severity: feature.properties.severity ?? "Unknown",
          areas: feature.properties.areaDesc ?? "Unknown",
        }));

        // Update state with the fetched alerts
        setAlerts(formattedAlerts);
        setFilteredAlerts(formattedAlerts);
      } catch (err) {
        // Handle errors during the fetch process
        setError("Failed to load alerts. Please try again later.");
        console.error(err);
      } finally {
        // Set loading to false once the fetch is complete
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Update filtered alerts whenever the filter, alerts, sort column, or sort order changes
  useEffect(() => {
    // Filter alerts based on severity
    const updatedAlerts = alerts.filter((alert) =>
      alert.severity.toLowerCase().includes(filter.toLowerCase())
    );

    const sortBySeverity = (a: Alert, b: Alert) => {
      const severityOrder = [
        "Unknown",
        "Minor",
        "Moderate",
        "Severe",
        "Extreme",
      ];
      return sortOrder === "asc"
        ? severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
        : severityOrder.indexOf(b.severity) - severityOrder.indexOf(a.severity);
    };

    // Sort the filtered alerts based on the selected column and order
    updatedAlerts.sort((a, b) => {
      if (sortColumn === "severity") {
        return sortBySeverity(a, b);
      } else {
        const valueA = a[sortColumn as keyof Alert]?.toLowerCase() ?? "";
        const valueB = b[sortColumn as keyof Alert]?.toLowerCase() ?? "";
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });

    // Update the filtered alerts state
    setFilteredAlerts(updatedAlerts);
  }, [filter, alerts, sortColumn, sortOrder]);

  // Handle sorting when a column header is clicked
  const handleSort = (column: string) => {
    // Toggle sort order if the same column is clicked, otherwise reset to ascending
    setSortOrder(sortColumn === column && sortOrder === "asc" ? "desc" : "asc");
    setSortColumn(column);
  };

  // Display a loading message while data is being fetched
  if (loading) {
    return <p className="text-center mt-4 text-lg font-semibold">Loading...</p>;
  }

  // Display an error message if there was an issue fetching data
  if (error) {
    return (
      <p className="text-center mt-4 text-red-500 font-semibold">{error}</p>
    );
  }

  const severityColors = (severity: string) => {
    switch (severity) {
      case "Extreme":
        return "text-red-800";
      case "Severe":
        return "text-red-600";
      case "Moderate":
        return "text-yellow-600";
      case "Minor":
        return "text-green-600";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        National Weather Alerts by NWS
      </h1>
      {/* Input field for filtering alerts by severity */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Filter by severity..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-3 rounded w-full max-w-md shadow-md"
        />
      </div>
      {/* Table to display alerts */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-white rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              {/* Sortable column headers */}
              <th
                onClick={() => handleSort("headline")}
                className="border p-4 cursor-pointer hover:bg-blue-700"
              >
                Headline
              </th>
              <th
                onClick={() => handleSort("severity")}
                className="border p-4 cursor-pointer hover:bg-blue-700"
              >
                Severity
              </th>
              <th
                onClick={() => handleSort("areas")}
                className="border p-4 cursor-pointer hover:bg-blue-700"
              >
                Affected Areas
              </th>
              <th
                onClick={() => handleSort("description")}
                className="border p-4 cursor-pointer hover:bg-blue-700"
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Display a message if no alerts match the filter */}
            {filteredAlerts.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center p-6 text-lg font-semibold"
                >
                  No active alerts.
                </td>
              </tr>
            ) : (
              // Display each alert in a table row
              filteredAlerts.map((alert, index) => (
                <tr
                  key={alert.id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="border p-4">{alert.headline}</td>
                  <td
                    className={`border p-4 font-semibold ${severityColors(alert.severity)}`}
                  >
                    {alert.severity}
                  </td>
                  <td className="border p-4">{alert.areas}</td>
                  <td className="border p-4">{alert.description}</td>
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
