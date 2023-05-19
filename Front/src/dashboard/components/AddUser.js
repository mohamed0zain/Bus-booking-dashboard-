import { useEffect, useState } from "react";
import "../styling/AddForm.css";
import axios from "axios";
import { getAuthUser } from "../../assets/helper/Storage";
import Alert from 'react-bootstrap/Alert';

const AddUser = ({ inputs, title }) => {
  
  const [traveler, setTraveler] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const Auth = getAuthUser();
  const [requestStatus, setRequestStatus] = useState(null);

  const [currRequests,setRequests]=useState({ 
      loading: false,
      results: [],
      err: [],
      reload: 0
    });
    const handleSubmit = async (event) => {
      event.preventDefault();
    
     
    
      try { 
        setRequests({ ...currRequests, loading: true });
        const resp = await axios.post(
          "http://localhost:4000/adminPage",
          {
            email: traveler.email,
            password: traveler.password,
            phone: traveler.phone,
          },
          {
            headers: {
              token: Auth.token,
            },
          }
        ).then( 
          (resp)=>{  setRequests({
          ...currRequests,
          results: resp.data,
          loading: false,
          err: null,
        });
        console.log(resp.data.message);
        setRequestStatus(resp.data.message);
        console.log(resp);});
    
     
      } catch (err) {
        setRequestStatus(err.response.data.message);
        console.log(err);
        setRequests({
          ...currRequests,
          loading: false,
          err: "User not added",
        });
      }
    };
  
  return (
    <div className="new">
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form  onSubmit={handleSubmit}>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    required
                    type={input.type}
                    value={traveler[input.label]}
                    onChange={(event) => {
                      setTraveler({
                        ...traveler,
                        [input.label]: event.target.value,
                      });
                    }}
                  />
                </div>
              ))}
           
                <button type="submit">Add</button>
              
              {requestStatus !== null && (
                <Alert variant={requestStatus.includes('created') ? 'success' :'danger' }>{requestStatus}</Alert>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
