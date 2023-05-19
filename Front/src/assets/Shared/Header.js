import { Link, useNavigate } from "react-router-dom";
import "../Styles/Header.css";
import { useState, useEffect } from "react";
import { getAuthUser, removeAuthUser } from "../helper/Storage";

const Header = () => {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const authUser = getAuthUser();
    if (authUser) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, []);

  const logOut = () => {
    removeAuthUser();
    setAuthenticated(false);
  };

  return (
    <div className="header">
      <Link to={"AppointmentList"} className="logo">
        {" "}
        Bus Booking{" "}
      </Link>
      <nav>
     
      {
        authenticated && (<>
           <Link to={"/AppointmentList"}>Appointments List</Link>
        <Link to={"/history"}>History</Link>
        <Link to={"/requestHistory"}>Requests</Link>
        </>
        )
      }

        {!authenticated && (
          <>
            <Link to={"/Register"}>Register</Link>
            <Link to={"/LoginPage"}>Log in</Link>
          </>
        )}
      </nav>
      <div className="header-right">
        {authenticated && (
          <Link to={"/LoginPage"} onClick={logOut}>
            Log Out
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;