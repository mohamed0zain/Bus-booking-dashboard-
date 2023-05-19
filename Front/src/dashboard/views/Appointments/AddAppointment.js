import AddForm from "../../components/AddForm";
import { bookInputs } from "../../FormSource";

const AddAppointment = () => {

    return (
        <div>
            <AddForm inputs={bookInputs} title={"Add New Appoimtment"} />
        </div>
    );
}

export default AddAppointment