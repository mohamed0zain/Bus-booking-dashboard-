  import React from "react";
  import "../../Styles/Login.css";
  import { react, useState, useEffect, useRef } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import Alert from 'react-bootstrap/Alert';
  import axios from 'axios'
import { getAuthUser, setAuthUser } from "../../helper/Storage";
  const LoginPage = () => {
 const  auth =getAuthUser();
     const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
      Email: "",
      Password: "",
      loading:false,
      err:[],
    })
  
      //Login fun to make the page dousn't reload
    const  Login =(event, userInfo)=> {
     
      event.preventDefault();
      setUserInfo({...userInfo,loading:true});
      
      axios.post("http://localhost:4000/auth/login",{
        email:userInfo.Email,
        password:userInfo.Password,
      }).then(
        (resp)=>{
          setUserInfo({...userInfo,loading:false ,err:[]})
          setAuthUser(resp.data);
          console.log(resp.data);
        if (resp.data.type == "admin") {
        navigate("/dashboard");

      } else {
        navigate("/")
      }
          }
      ).catch((error) => {
        console.log(error);
        setUserInfo({
          ...userInfo,
          loading: false,
          err: error.response.data,
        });
      });
      console.log(userInfo);
      console.log(userInfo.err);
    
        };
    



    return (<>
  {
    userInfo.err.msg && 
    <Alert variant="danger">{userInfo.err.msg} </Alert>}
  
    
      <div className="regetrationContainer">
        <span className="border-line">
          <h1>Login</h1>
          <form 
            className="FormLogin"
            action="ProductList"
            onSubmit={(e) => {
              Login(e, userInfo);
              
            }}
          >
            <div>
              <label htmlFor="email">Email</label>
              <div className="input-box">
                <input
                  id="email"
                  type={"email"}
                  value={userInfo.Email}
                  required
                  onChange={(event) => {
                    setUserInfo({ ...userInfo, Email: event.target.value });
                  }}
                />
              </div>
            </div>
            <div>
              <label htmlFor="Password">Password</label>
              <div className="input-box">
                <input
                  id="Password"
                  type={"password"}
                  value={userInfo.Password}
                  required
                  onChange={(event) => {
                    setUserInfo({ ...userInfo, Password: event.target.value });
                  }}
                />
              </div>
            </div>

            <button  type="submit" disabled={Login.loading==true}>Login</button>
            <h3>
              Don't have an account? <Link to={"/Register"}>Register </Link>
            </h3>
          </form>
        </span>
      </div>
      </>
    );
  };

  export default LoginPage;
