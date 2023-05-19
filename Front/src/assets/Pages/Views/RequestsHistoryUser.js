import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import DataTable from 'react-data-table-component';
import "../../Styles/History.css"
import axios from 'axios'
import { getAuthUser } from '../../helper/Storage';

const RequestsHistoryUser = () => {
  const Auth=  getAuthUser();
const [history,setHistory]=useState({
    loading: false,
    results: null,
    err: null,
    reload: 0
});
useEffect(() => {

    setHistory({...history, loading: true});
    axios.get("http://localhost:4000/requestUsers",{headers:{
        token:Auth.token,
      }}).then((resp)=>{
        console.log(resp);
        setHistory({...history, results: resp.data, loading: false, err: null});
    }).catch((err)=>{
      setHistory({...history, loading: false, err: "something went wrong"});

    })
  }, [history.reload]);

  const data = {
    columns: [
   
      {
        label: 'Appointment ID',
        field: 'column2',
        sort: 'asc',
        width: 70
      },
      {
        label: 'Status',
        field: 'column3',
        sort: 'asc',
        width: 70
      },
    
    ],
    rows: history.results ? history.results.map((result) => ({
        destination: result.traveler_id
        ,
        column2: result.appointment_id,
        column3: result.request,
        column4: result.column4
      })) : []
  };
  

  return (
    
    <MDBDataTable
    responsive
    bordered
    hover
      data={data}
      className="custom_table m-5"
    />
    
  );
}
export default RequestsHistoryUser;