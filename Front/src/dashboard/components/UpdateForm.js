import { useEffect, useState } from 'react';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import '../styling/UpdateForm.css'
import axios from 'axios';
import { getAuthUser } from '../../assets/helper/Storage';
import { useParams } from 'react-router-dom';

const UpdateForm = ({ inputs , formTitle }) => {
    const Auth =getAuthUser();
    const { id } = useParams();
    const [file, setFile] = useState("");
    const [fileUpdated, setFileUpdated] = useState(false);
    const [appointment, setAppointment] = useState({
        From_location:"",
        To_location:"",
        Price:"",
        Date:"",
        Time:"",
        Max_num_of_travelers:"", // corrected label
    });
    const [currRequests, setRequests] = useState({
        loading: false,
        results: [],
        err: [],
        reload: 0,
      });
      useEffect(() => {
        setRequests({ ...currRequests, loading: true });
        axios
          .get(`http://localhost:4000/ManageAppointments/id/${id}`, {
            headers: {
              token: Auth.token,
            },
          })
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
    return (
        <div className="new">
            <div className="newContainer">
                <div className="top">
                    <h1>{formTitle}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                fileUpdated 
                                    ? URL.createObjectURL(file)
                                    : file
                            }
                            alt=""
                        />
                    </div>
                    <div className="right">
                        <form>
                            <div className="formInput">
                                <label htmlFor="file">
                                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                
                                    onChange={(e) => {setFile(e.target.files[0]);setFileUpdated(true)}}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input type={input.type} defaultValue={currRequests.results[input.label]} placeholder={input.placeholder} />
                                </div>
                            ))}
                            <button>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateForm
