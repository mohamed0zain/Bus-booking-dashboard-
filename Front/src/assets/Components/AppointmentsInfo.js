import React, { useState } from "react";
import "../Styles/AppointmentCard.css"
import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner';
import { getAuthUser } from "../helper/Storage";
import Alert from 'react-bootstrap/Alert';
const AppointmentsInfo = (props)=>{
   const Auth = getAuthUser();
   const [requestStatus, setRequestStatus] = useState(null);

   const handleRequestAppointment = async (e) => {
      console.log(props.data.image);
         e.preventDefault();
         const token = Auth.token;
         const response = await 
         axios.post('http://localhost:4000/requestUsers',{ appointment_id: props.id }, {
            headers: {
               token: Auth.token
            }
         }).then((response)=>{ 

         setRequestStatus(response.data[0].msg);
         console.log(response);
         console.log(props);
      }).catch ((err)=> {
         console.error(err);
         setRequestStatus('Failed to request appointment. Please try again later.')});
      
   }

   return (
      <div className="Appoint-card">
  
         <div className="card-top">
                 <img src={props.data.image} alt="Appointment Image" />
            <div className="id-card">
               <h4>#{props.id}</h4>
            </div>
         </div>
         <div className="card-info">
            <div className="distenations">
               <h4 className="from">from : {props.data.from_location}</h4>
               <h4>To: {props.data.to_location}</h4>
            </div>
            <div className="price">
               <h4>price : {props.data.ticket_price} LE</h4>
               <h4>Date : {props.data.day}</h4>
               <h4>time : {props.data.time}</h4>
               <h4>max number of travellers : {props.data.max_num_of_travelers}</h4>
            </div>
         </div>
         {requestStatus === null && (
            <button onClick={(e) => handleRequestAppointment(e)}>Book</button>
         )}
         {requestStatus !== null && (
            <Alert variant={requestStatus.includes('success') ? 'success' : 'danger'}>{requestStatus}</Alert>
         )}
      </div>
   );
};

export default AppointmentsInfo
