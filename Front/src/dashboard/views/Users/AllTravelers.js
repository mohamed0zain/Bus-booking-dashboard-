import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../styling/dashboard.css'
import { getAuthUser } from '../../../assets/helper/Storage';
import axios from 'axios';
import UpdateAppointment from '../Appointments/UpdateAppointment';

const AllTravelers =()=>{
    const Auth = getAuthUser();
    const [deleted, setDeleted] = useState(false);
    const [currUsers,setUsers]=useState({
        loading: false,
        results: [],
        err: [],
        reload: 0
    });

    useEffect(() => {
        setUsers({ ...currUsers, loading: true });
        axios.get("http://localhost:4000/adminPage", {
            headers: {
                token: Auth.token,
            }
        })
        .then((resp) => {
            setUsers({ ...currUsers, results: resp.data, loading: false, err: null });
        })
        .catch((err) => {
            setUsers({ ...currUsers, loading: false, err: "Appointment Not Found" });
        });
    }, [deleted]); // Add deleted as a dependency to trigger a reload

    const columns = [
        {
            name: 'email',
            selector: row => row.email,
            sortable: true,
            center: true
        },
        {
            name: 'phone',
            selector: row => row.phone,
            sortable: true,
            center: true
        },
        {
            name: "",
            cell: (param) => updateTraveler(param),
            center: true
        },
        {
            name: "",
            cell: (param) => deleteTraveler(param),
        },
        {
            name: "",
            cell: (param) => showRequest(param),
        },
    ];

    const handleDelete = async (param) => {
        await axios.delete(`http://localhost:4000/adminPage/${param.email}`)
        .then((resp) => {
            console.log(resp);
            setDeleted(true);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const updateTraveler = (param) => {
        return (
            <>
                <Link to={`update_traveler/${param.email}`} className='UpdateBtn' >
                    update
                </Link>
            </>
        );
    };

    const showRequest =(param)=>{
        return (
            <>
                <Link to={`traveler_request/${param.email}`} className='UpdateBtn' >
                    requests
                </Link>
            </>
        );
    }

    const deleteTraveler = (param) => {
        return (
            <>
                <button className='deleteBtn' onClick={() => handleDelete(param)}>
                    delete
                </button>
            </>
        );
    };

    return(
        <>
            <div className="title-datatable">
                <h2>All Travelers</h2>
                <div className="a-container">
                    <Link to={"add_traveler"} className="addApp">
                        Add Travelers
                    </Link>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={currUsers.results}
            />
        </>
    );
};

export default AllTravelers;