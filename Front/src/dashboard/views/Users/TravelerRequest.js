import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getAuthUser } from "../../../assets/helper/Storage";


    const TravelerRequest = () => {
    
        const { email } = useParams();
        const Auth = getAuthUser();
        const [currRequests, setRequests] = useState({
          loading: false,
          results: [],
          err: [],
          reload: 0,
        });
        
      
        useEffect(() => {
          setRequests({ ...currRequests, loading: true });
          axios
            .get(`http://localhost:4000/requestAdmin/user/${email}`,{
              headers: {
                token:Auth.token},
              },{traveler_id:email},
            )
            .then((resp) => {
              setRequests({
                ...currRequests,
                results: resp.data,
                loading: false,
                err: null,
              });
              console.log(resp);
            })
            .catch((err) => {
              console.log(err);
              setRequests({ ...currRequests, loading: false, err: err });
            });
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
    
        ];

            return(<>

            <div className="title-datatable">
                        <h2>History</h2>
                    
                    </div>
                    <DataTable
                        columns={columns}
                        data={currRequests.results}/>
            </>);
    }

    export default TravelerRequest