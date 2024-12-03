import React, { useState } from "react";

const Demo = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDemoData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://3033-idx-zitter-1732213298910.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev/api/saikat"
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchDemoData} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Data'}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {data && (
        <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Demo;