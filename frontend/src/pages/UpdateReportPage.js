import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateReportPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const [locRes, catRes, statRes, reportRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/locations', config),
                    axios.get('http://localhost:5000/api/categories', config),
                    axios.get('http://localhost:5000/api/statuses', config),
                    axios.get(`http://localhost:5000/api/reports/${id}`, config),
                ]);

                setLocations(locRes.data);
                setCategories(catRes.data);
                setStatuses(statRes.data);

                const report = reportRes.data;
                setDescription(report.description);
                setLocation(report.location._id);
                setCategory(report.category._id);
                setStatus(report.status._id);
            } catch (err) {
                console.error(err);
                setError('Failed to load report or form data');
            }
        };

        if (token) fetchFormData();
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const updatedData = { location, category, status, description };
            await axios.put(`http://localhost:5000/api/reports/${id}`, updatedData, config);

            setMessage('Report updated successfully!');
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            console.error(err);
            setError('Failed to update report');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px' }}>
            <h2 style={{ marginBottom: '25px', textAlign: 'center' }}>Update Report</h2>
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
                        Update Report
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateReportPage;
