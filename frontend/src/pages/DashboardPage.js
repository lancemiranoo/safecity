import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { jwtDecode } from 'jwt-decode';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
    const [chartData, setChartData] = useState(null);
    const [reports, setReports] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState('citizen');
    const [userName, setUserName] = useState('');
    const token = localStorage.getItem('token');

    const capitalize = (text) =>
        text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : 'N/A';

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const userId = decoded?.id || decoded?._id;

                    if (!userId) return;

                    const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const user = res.data;
                    setUserName(user.name || user.email || 'User');
                    setUserRole(user.role || 'citizen');
                } catch (err) {
                    console.error('Failed to fetch user data:', err);
                }
            }
        };

        fetchUserInfo();
    }, [token]);

    const updateChartData = (reportList) => {
        const statusCounts = {};
        reportList.forEach((report) => {
            const status = report?.status?.name || 'Unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const statusLabels = Object.keys(statusCounts);
        const statusValues = Object.values(statusCounts);

        setChartData({
            labels: statusLabels,
            datasets: [
                {
                    label: 'Reports by Status',
                    data: statusValues,
                    backgroundColor: [
                        '#82ca9d',
                        '#f39c12',
                        '#3498db',
                        '#e74c3c',
                        '#9b59b6',
                        '#2ecc71',
                    ],
                    borderColor: '#fff',
                    borderWidth: 1,
                },
            ],
        });
    };

    useEffect(() => {
        if (!token) return;

        const fetchReports = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/reports', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const allStatuses = new Set();
                const allLocations = new Set();
                const allCategories = new Set();

                res.data.forEach((report) => {
                    allStatuses.add(report?.status?.name || 'Unknown');
                    allLocations.add(report?.location?.name || 'Unknown');
                    allCategories.add(report?.category?.name || 'Unknown');
                });

                setReports(res.data);
                setStatuses(['All', ...Array.from(allStatuses)]);
                setLocations(['All', ...Array.from(allLocations)]);
                setCategories(['All', ...Array.from(allCategories)]);
                updateChartData(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load reports');
            }
        };

        fetchReports();
    }, [token]);

    const handleDelete = async (id) => {
        const confirm = window.confirm('Are you sure you want to delete this report?');
        if (!confirm) return;

        try {
            await axios.delete(`http://localhost:5000/api/reports/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updatedReports = reports.filter((r) => r._id !== id);
            setReports(updatedReports);
            updateChartData(updatedReports);
        } catch (err) {
            console.error('Delete failed:', err.response?.data || err.message);
            alert('Failed to delete report.');
        }
    };

    const handleEdit = (id) => {
        window.location.href = `/edit-report/${id}`;
    };

    const filteredReports = reports.filter((r) => {
        const matchesStatus =
            selectedStatus === 'All' ||
            r?.status?.name?.toLowerCase() === selectedStatus.toLowerCase();

        const matchesLocation =
            selectedLocation === 'All' ||
            r?.location?.name?.toLowerCase() === selectedLocation.toLowerCase();

        const matchesCategory =
            selectedCategory === 'All' ||
            r?.category?.name?.toLowerCase() === selectedCategory.toLowerCase();

        const matchesSearch =
            r?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesLocation && matchesCategory && matchesSearch;
    });

    const thStyle = {
        borderBottom: '1px solid #ccc',
        textAlign: 'left',
        padding: '8px',
        backgroundColor: '#f4f4f4',
    };

    const tdStyle = {
        borderBottom: '1px solid #eee',
        padding: '8px',
    };

    return (
        <>
            <nav
                style={{
                    backgroundColor: '#2c3e50',
                    color: 'white',
                    padding: '15px 30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h1 style={{ margin: 0 }}>SafeCity</h1>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '10px',
                        minWidth: '200px',
                    }}
                >
                    <span
                        style={{
                            fontSize: '14px',
                            fontStyle: 'italic',
                            minWidth: '100px',
                            textAlign: 'right',
                        }}
                    >
                        {token ? (
                            <>
                                Hello, <strong>{userName}</strong>
                            </>
                        ) : null}
                    </span>
                    <button
                        style={{
                            backgroundColor: token ? '#e74c3c' : '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            width: '100px',
                            textAlign: 'center',
                        }}
                        onClick={() => {
                            if (token) {
                                localStorage.removeItem('token');
                                window.location.reload();
                            } else {
                                window.location.href = '/login';
                            }
                        }}
                    >
                        {token ? 'Logout' : 'Login'}
                    </button>
                </div>
            </nav>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '90%', maxWidth: '1000px', padding: '20px' }}>
                    <h2 style={{ textAlign: 'center' }}>Report Summary</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {token ? (
                        chartData && (
                            <div
                                style={{
                                    width: '100%',
                                    maxWidth: '600px',
                                    margin: '0 auto',
                                    height: '350px',
                                }}
                            >
                                <Pie
                                    data={chartData}
                                    options={{
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                align: 'center',
                                                labels: {
                                                    usePointStyle: true,
                                                    boxWidth: 12,
                                                    padding: 15,
                                                },
                                            },
                                            tooltip: { enabled: true },
                                        },
                                    }}
                                />
                            </div>
                        )
                    ) : (
                        <p style={{ textAlign: 'center' }}>
                            Please log in to view the dashboard.
                        </p>
                    )}

                    {token && (
                        <div style={{ marginTop: '40px' }}>
                            <h3 style={{ textAlign: 'center' }}>All Reports</h3>

                            <div style={{ margin: '10px 0', textAlign: 'left' }}>
                                <a
                                    href="/create-report"
                                    style={{
                                        color: '#3498db',
                                        fontSize: '16px',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Create New
                                </a>
                            </div>

                            <div
                                style={{
                                    marginBottom: '15px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Search description or username..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        flex: '1',
                                        minWidth: '200px',
                                    }}
                                />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        flex: '1',
                                        minWidth: '200px',
                                    }}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {capitalize(cat)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        flex: '1',
                                        minWidth: '200px',
                                    }}
                                >
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {capitalize(loc)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        flex: '1',
                                        minWidth: '200px',
                                    }}
                                >
                                    {statuses.map((stat) => (
                                        <option key={stat} value={stat}>
                                            {capitalize(stat)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Category</th>
                                        <th style={thStyle}>Location</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Description</th>
                                        <th style={thStyle}>Reported By</th>
                                        <th style={thStyle}>Reported On</th>
                                        {(userRole === 'admin' || userRole === 'officer') && (
                                            <th style={thStyle}></th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.length > 0 ? (
                                        filteredReports.map((report) => (
                                            <tr key={report._id}>
                                                <td style={tdStyle}>{capitalize(report?.category?.name)}</td>
                                                <td style={tdStyle}>{capitalize(report?.location?.name)}</td>
                                                <td style={tdStyle}>{capitalize(report?.status?.name)}</td>
                                                <td style={tdStyle}>{report?.description || 'N/A'}</td>
                                                <td style={tdStyle}>{report?.user?.name || 'N/A'}</td>
                                                <td style={tdStyle}>
                                                    {report?.reported
                                                        ? new Date(report.reported).toLocaleDateString()
                                                        : 'N/A'}
                                                </td>
                                                {(userRole === 'admin' || userRole === 'officer') && (
                                                    <td style={tdStyle}>
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <button
                                                                onClick={() => handleEdit(report._id)}
                                                                style={{
                                                                    backgroundColor: '#f39c12',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    padding: '6px 10px',
                                                                    borderRadius: '4px',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            {userRole === 'admin' && (
                                                                <button
                                                                    onClick={() => handleDelete(report._id)}
                                                                    style={{
                                                                        backgroundColor: '#e74c3c',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        padding: '6px 10px',
                                                                        borderRadius: '4px',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={userRole === 'admin' || userRole === 'officer' ? 7 : 6}
                                                style={{
                                                    textAlign: 'center',
                                                    padding: '20px',
                                                    color: '#999',
                                                }}
                                            >
                                                No reports found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
