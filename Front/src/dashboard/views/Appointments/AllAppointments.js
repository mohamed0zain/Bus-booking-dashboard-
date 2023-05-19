import DataTable from 'react-data-table-component';
import '../../styling/dashboard.css'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuthUser } from '../../../assets/helper/Storage';
import axios from 'axios';


const AllAppointments = () => {
  const Auth = getAuthUser();
  const [deleted, setDeleted] = useState(false);
  const [dataState, setDataState] = useState({ // rename state variable to avoid conflict
    loading: false,
    results: [],
    err: [],
    reload: 0
  });

  useEffect(() => {
    
    setDataState({...dataState, loading: true}); // fix typo
    axios.get(`http://localhost:4000/ManageAppointments`, {headers:{
      token: Auth.token,
    }}).then((resp) => {

      setDataState({...dataState, results: resp.data, loading: false, err: null});
    }).catch((err) => {
      setDataState({...dataState, loading: false, err: "Appointment Not Found"});
    })
  }, [deleted]);

  const columns = [
    {
      name: 'Photo',
      selector: row => (
<img src={row.image} width={70} />      ),
      center: true
    },
    {
      name: 'From',
      selector: row => row.from_location,
      sortable: true,
      center: true
    },
    {
      name: 'To',
      selector: row => row.to_location,
      sortable: true,
      center: true
    },
    {
      name: 'Date',
      selector: row => row.day,
      sortable: true,
      center: true
    },
    {
      name: 'Time',
      selector: row => row.time,
      sortable: true,
      center: true
    },
    {
      name: 'Price',
      selector: row => row.ticket_price
      ,
      sortable: true,
      center: true
    },
    {
      name: 'Max Number of travelers',
      selector: row => row.max_num_of_travelers,
      sortable: true,
      center: true
    },
    {
      name: "",
      cell: (param) => updateAppointment(param),
      center: true
    },
    {
      name: "",
      cell: (param) => deleteAppointment(param),
    },
  ];

  const handleDelete = async (param) => {
    await axios.delete(`http://localhost:4000/ManageAppointments/${param.id}`,{headers:{token:Auth.token}})
    .then((resp) => {
        console.log(resp);
        setDeleted(true);
    })
    .catch((err) => {
        console.log(err);
    });
};

  const updateAppointment = (param) => {
    return (
      <>
        <Link to={`update_appointment/${param.id}`} className='UpdateBtn'>
          update
        </Link>
      </>
    );
  };

  const deleteAppointment = (param) => {
    return (
      <>
        <button className='deleteBtn' onClick={() => handleDelete(param)}>
          delete
        </button>
      </>
    );
  };

  return (
    <>
      <div className="title-datatable">
        <h2>All Appointments</h2>
        <div className="a-container">
          <Link to={"add_appointment"} className="addApp">
            Add Appointment
          </Link>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={dataState.results} // use state variable to access results
      />
    </>
  );
}

export default AllAppointments;