    import DataTable from 'react-data-table-component';
    import { Link } from 'react-router-dom';
    import { useEffect, useState } from 'react';
    import '../../styling/dashboard.css'
import { getAuthUser } from '../../../assets/helper/Storage';
import axios from 'axios';

    const AppointmentRequests =()=>{
    const Auth = getAuthUser();
    
    const [currRequests,setRequests]=useState({ // rename state variable to avoid conflict
        loading: false,
        results: [],
        err: [],
        reload: 0
      });
    useEffect(() => {
        setRequests({...currRequests, loading: true}); // fix typo
        axios.get("http://localhost:4000/requestAdmin", {headers:{
          token: Auth.token,
        }}).then((resp) => {
         setRequests({...currRequests, results: resp.data, loading: false, err: null});
        }).catch((err) => {
            setRequests({...currRequests, loading: false, err: "Appointment Not Found"});
        })
      }, []);
    const columns = [
        {
            name: 'email',
            selector: row => row.traveler_id,
            sortable: true,
            center: true
        },
        {
            name: 'appointment',
            selector: row => row.appointment_id,
            sortable: true,
            center: true
        },
        {
            name: 'status',
            selector: row => row.request,
            sortable: true,
            center: true
        },
        {
            name: "",
            cell: (param) => updateRequest(param),
            center: true
        },
    ];

    const updateRequest = (param) => {
      const handleDelete = () => {
          setRequests(currRequests.filter((item) => item.id !== param.id));
      };
      return (
          <>
              <Link to={{
                  pathname: `update_request/${param.id}`,
              }} className='UpdateBtn' onClick={handleDelete}>
                  update
              </Link>
          </>
      );
  };

        return(<>
        <div className="title-datatable">
                    <h2>All requests</h2>
                
                </div>
                <DataTable
                    columns={columns}
                    data={currRequests.results}/>
        </>);
    }
    export default AppointmentRequests;