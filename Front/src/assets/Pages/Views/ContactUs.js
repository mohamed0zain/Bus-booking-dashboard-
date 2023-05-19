import { react, useState , useEffect,useRef} from "react";
import "../../Styles/Contact.css";
const ContactUs = () => {
  //initial state
  /*const [contactUsForm, setContuctUsForm] = useState({
    email: "",
    message: "",
  });*/
//use effect lifecycle -> re-renderring
const contactUsForm = useRef([]);


/*

useEffect(() => {
   //logic  
   console.log("first");    
   return ()=>{
    console.log("leaviing");
   }
},
//array of dependecies emta hy7sl calling + momkn kza useeffect
 [])

 useEffect(() => {
  console.log("alo"); 
  // لو شيلت الاراي خالص كل مايحصل ريريندرينج هيعمل اللوجيك
 }, [contactUsForm.email,contactUsForm.message])
 


*/

  function Contact(event) {
    event.preventDefault();
    console.log(contactUsForm.current[0].value,contactUsForm.current[1].value);
  }

  return (
    <div
      className="contactUsContainer"
      style={{ textAlign: "center", margin: "50px auto" }}
    >
      <h1>Contact Us</h1>
      <form
        onSubmit={(e) => {
          Contact(e);
        }}
      >
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            ref={(ref)=>{contactUsForm.current[0]=ref}}
           /* value={contactUsForm.email}
            onChange={(event) => {
              setContuctUsForm({ ...contactUsForm, email: event.target.value });
            }}*/
          />
        </div>
        <br />
        <div>
          <label htmlFor="message">Message </label>
          <textarea
            required
            id="message"
            placeholder="Please enter your message"
          //  value={contactUsForm.message}
            rows={5}
            ref={(ref)=>{contactUsForm.current[1]=ref}}
          /*  onChange={(event) => {
              setContuctUsForm({
                ...contactUsForm,
                message: event.target.value,
              });
            }}*/
          />
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};
export default ContactUs;
