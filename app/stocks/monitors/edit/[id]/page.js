'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



// Error boundary component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-6 bg-red-50 border border-red-500 rounded-lg">
      <h2 className="text-2xl font-bold text-red-700 mb-4">Something went wrong:</h2>
      <p className="text-red-600 mb-4">{error.message}</p>
      <div className="flex space-x-4">
        <Link href="/stocks/monitors">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Return to Monitors
          </button>
        </Link>
        <button
          onClick={resetErrorBoundary}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default function EditMonitor({ params }) {
    const router = useRouter();
    const [monitor, setMonitor] = useState(null); // Changed to null instead of an object with properties
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMonitor = async () => {
            try {
                // Simulate an API error
                throw new Error("Failed to load monitor data. The server returned an invalid response.");
                
                // This code will never execute due to the error above
                const response = await fetch(`/api/monitors/${params.id}`);
                const data = await response.json();
                setMonitor(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching monitor:', error);
                setError(error);
                setLoading(false);
            }
        };

        if (params.id) {
            fetchMonitor();
        }
    }, [params.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/monitors/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(monitor),
            });

            if (response.ok) {
                router.push('/stocks/monitors');
            } else {
                // This will also cause an error because we're calling JSON on a failed response
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update monitor");
            }
        } catch (error) {
            console.error('Error updating monitor:', error);
            setError(error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMonitor(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // If there's an error, display it
    if (error) {
        return <ErrorFallback error={error} resetErrorBoundary={() => setError(null)} />;
    }

    // If still loading, show loading state
    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    // If monitor is null, this will cause a runtime error when accessing properties
    return (
        <div className="p-6 bg-gray-900 text-white">
            <h1 className="text-2xl font-bold mb-6">Edit Monitor</h1>
            <form onSubmit={handleSubmit} className="max-w-md">
                <div className="mb-4">
                    <label className="block mb-2">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={monitor.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-gray-800 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Description:</label>
                    <textarea
                        name="description"
                        value={monitor.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-gray-800 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Threshold:</label>
                    <input
                        type="number"
                        name="threshold"
                        value={monitor.threshold}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-gray-800 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="active"
                            checked={monitor.active}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Active
                    </label>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Update Monitor
                </button>
            </form>
        </div>
    );
}