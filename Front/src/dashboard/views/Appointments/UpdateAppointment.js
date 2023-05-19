import { useLoaderData } from "react-router-dom";
import { bookInputs } from "../../FormSource";
import UpdateForm from "../../components/UpdateForm";
import { findById } from "../../helper/helper";

export async function UpdateAppointmenyLoader({params}) {
    const oldData = findById({params})

    return oldData;
}

const UpdateAppointment = () => {

    const oldData = useLoaderData()

    return (
        <div>
            <UpdateForm  inputs={bookInputs} formTitle={"Update Apppointment"} />
        </div>
    );
}

export default UpdateAppointment