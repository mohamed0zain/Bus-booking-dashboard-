import React, { useState, useRef } from "react";
import "../../Styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import { setAuthUser } from "../../helper/Storage";

const RegestrationPage = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    Email: "",
    Password: "",
    Phone:"",
    loading:false,
    err:[],
  })

    //Login fun to make the page dousn't reload
  const  registerFun =(event, register)=> {
   
    event.preventDefault();
    setRegister({...register,loading:true});
    
    axios.post("http://localhost:4000/auth/register",{
      email:register.Email,
      password:register.Password,
      phone:register.Phone
    }).then(
      (resp)=>{
        setRegister({...register,loading:false ,err:[]})
        setAuthUser(resp.data);
        navigate("/AppointmentList");
        }
    ).catch((error) => {
      console.log(error);
      setRegister({
        ...register,
        loading: false,
        err: error.response.data,
      });
    });
    console.log(register);
    console.log(register.err);
      };
  
  return (
    <>
   {
    register.err.message&& 
    <Alert variant="danger">{register.err.message} </Alert>}

      <div className="regetrationContainer">
        <span className="border-line">
          <h1>Registration</h1>
          <form action="ProductList" onSubmit={(e) => {
              registerFun(e, register);
              
            }}
          >
            <div>
              <div>
                <label htmlFor="Email">Email</label>
                <div className="input-box">
                  <input
                    id="Email"
                    type={"email"}
                    required
                    value={register.Email}
                   onChange={(e)=>{setRegister({...register,Email:e.target.value})}}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="Password">Password</label>
                <div className="input-box">
                  <input
                    id="Password"
                    type={"password"}
                    required
                    value={register.Password}
                   onChange={(e)=>{setRegister({...register,Password :e.target.value})}}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone">Phone number</label>
                <div className="input-box">
                  <input
                    id="Phone"
                    type={"tel"}
                    required
                    value={register.Phone}
                    onChange={(e)=>{setRegister({...register,Phone :e.target.value})}}
                  />
                </div>
              </div>
              <button type="submit" disabled={register.loading==true}>Register</button>
              <h3>
                already have an account?{" "}
                <Link to={"/LoginPage"}>Login </Link>
              </h3>
            </div>
          </form>
        </span>
      </div>
    </>
  );
};

export default RegestrationPage;