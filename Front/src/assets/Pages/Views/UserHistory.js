import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import "../../Styles/History.css"
import axios from 'axios'
import { getAuthUser } from '../../helper/Storage';

const History = () => {
  const Auth=  getAuthUser();
const [history,setHistory]=useState({
    loading: false,
    results: null,
    err: null,
    reload: 0
});
useEffect(() => {

    setHistory({...history, loading: true});
    axios.get("http://localhost:4000/history",{headers:{
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
        label: 'Destination',
        field: 'destination',
        sort: 'asc',
        width: 70
      }
    ],
    rows: history.results ? history.results.map((result) => ({
        destination: result
      })) : []
    
  };

  return (
    
    <MDBDataTable
      striped
      bordered
      sortable
      data={data}
      className="custom_table m-5"
    />
    
  );
}
export default History;