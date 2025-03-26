import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const CreateReportPage = () => {
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : null;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const [locRes, catRes, statRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/locations', config),
                    axios.get('http://localhost:5000/api/categories', config),
                    axios.get('http://localhost:5000/api/statuses', config),
                ]);

                setLocations(locRes.data);
                setCategories(catRes.data);
                setStatuses(statRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load form options');
            }
        };

        if (token) fetchFormData();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const reportData = {
                user: user?.id,
                location,
                category,
                status,
                description,
            };

            await axios.post('http://localhost:5000/api/reports', reportData, config);
            setMessage('Report created successfully');

            setDescription('');
            setLocation('');
            setCategory('');
            setStatus('');

            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            console.error(err);
            setError('Failed to create report');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px' }}>
            <h2 style={{ marginBottom: '25px', textAlign: 'center' }}>Create New Report</h2>

            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            {message && <p style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label><strong>Location:</strong></label><br />
                    <select value={location} onChange={(e) => setLocation(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
                        <option value="">Select Location</option>
                        {locations.map(loc => (
                            <option key={loc._id} value={loc._id}>{loc.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label><strong>Category:</strong></label><br />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label><strong>Status:</strong></label><br />
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
                        <option value="">Select Status</option>
                        {statuses.map(stat => (
                            <option key={stat._id} value={stat._id}>{stat.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label><strong>Description:</strong></label><br />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="4"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '10px'
                }}>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        style={{
                            backgroundColor: '#ccc',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Back
                    </button>

                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Submit Report
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateReportPage;
