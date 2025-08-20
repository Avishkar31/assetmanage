
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';




export default function EditMonitor({ params }) {
    const router = useRouter();
    const [monitor, setMonitor] = useState({
        symbol: '',
        targetPrice: '',
        alertType: 'above',
        isActive: true
    });

    useEffect(() => {
        // Fetch the monitor data using the ID from params
        const fetchMonitor = async () => {
            try {
                const response = await fetch(`/api/monitors/${params.id}`);
                const data = await response.json();
                setMonitor(data);
            } catch (error) {
                console.error('Error fetching monitor:', error);
            }
        };

        fetchMonitor();
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
            }
        } catch (error) {
            console.error('Error updating monitor:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Stock Monitor</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Stock Symbol</label>
                    <input
                        type="text"
                        value={monitor.symbol}
                        onChange={(e) => setMonitor({...monitor, symbol: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Target Price</label>
                    <input
                        type="number"
                        value={monitor.targetPrice}
                        onChange={(e) => setMonitor({...monitor, targetPrice: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Alert Type</label>
                    <select
                        value={monitor.alertType}
                        onChange={(e) => setMonitor({...monitor, alertType: e.target.value})}
                        className="w-full p-2 border rounded"
                    >
                        <option value="above">Above Target</option>
                        <option value="below">Below Target</option>
                    </select>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={monitor.isActive}
                            onChange={(e) => setMonitor({...monitor, isActive: e.target.checked})}
                            className="mr-2"
                        />
                        Active
                    </label>
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Update Monitor
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/stocks/monitors')}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}