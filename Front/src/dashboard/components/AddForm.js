import { useState } from 'react';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import '../styling/AddForm.css'
import moment from "moment";
import axios from "axios";
import { getAuthUser } from "../../assets/helper/Storage";
import Alert from 'react-bootstrap/Alert';

const AddForm = ({ inputs, title }) => {
    const Auth = getAuthUser();
    const [file, setFile] = useState("");
    const [appointment, setAppointment] = useState({
        From_location:"",
        To_location:"",
        Price:"",
        Date:"",
        Time:"",
        Max_num_of_travelers:"", // corrected label
    });
    const [currRequests,setRequests]=useState({ 
        loading: false,
        results: [],
        err: [],
        reload: 0
      });
      const [requestStatus, setRequestStatus] = useState(null);
      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const formData = new FormData();
          formData.append("image", file, file.name); // include original file name
          formData.append("from_location", appointment.From_location);
          formData.append("to_location", appointment.To_location);
          formData.append("ticket_price", appointment.Price);
          formData.append("day", appointment.Date);
          formData.append("time", appointment.Time);
         formData.append("max_num_of_travelers", appointment.Max_num_of_travelers);      
          setRequests({ ...currRequests, loading: true });
          const resp = await axios.post(
            "http://localhost:4000/ManageAppointments",
            formData,
            {
              headers: {
                token: Auth.token,
              
              },
            }
          );
      
          setRequests({
            ...currRequests,
            results: resp.data,
            loading: false,
            err: null,
          });
          
          console.log(resp.data.message);
          setRequestStatus(resp.data[0].msg);
          console.log(resp);
        } catch (err) {
          setRequestStatus(err.response.data[0].msg);
          console.log(err);
          setRequests({
            ...currRequests,
            loading: false,
            err: "User not added",
          });
        }
        console.log(appointment);
      };
  const handleTimeChange = (event) => {
    const timeValue = event.target.value;
    const formattedTime = moment(timeValue, ["h:mm A", "HH:mm"]).format("HH:mm");
    setAppointment({ ...appointment, Time: formattedTime });
  };

    return (
        <div className="new">
            <div className="newContainer">
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                file
                                    ? URL.createObjectURL(file)
                                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt=""
                        />
                    </div>
                    <div className="right">
                        <form  action="ProductList" onSubmit={handleSubmit}>
                            <div className="formInput">
                                <label htmlFor="file">
                                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                </label>
                                <input
                                required
                                    type="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    
                                    <label>{input.label}</label>
                                    <input required type={input.type} placeholder={input.placeholder}
                                    value={appointment.label}
                                    onChange={(event)=>{
                                        if (input.label == "Time") {
                                            handleTimeChange(event);
                                        } else {
                                             setAppointment({
                                            ...appointment,
                                             [input.label]: event.target.value,
                                          })
                                        }
                                       
                                    }}
                                    />
                                </div>
                            ))}
                            <button>Send</button>
                            {requestStatus !== null && (
              <Alert variant={requestStatus.includes('created') ? 'success' :'danger' }>{requestStatus}</Alert>
              )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddForm