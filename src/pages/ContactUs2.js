import { useRef } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import FirstFold1 from "../components/FirstFold1";

const ContactUs2 = () => {
  const formRef = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();

    const formData = {
      firstName: formRef.current["firstName"].value,
      lastName: formRef.current["lastName"].value,
      email: formRef.current["email"].value,
      phone: formRef.current["phone"].value,
      message: formRef.current["msg"].value,
    };

    try {
      const response = await axios.post("http://localhost:8000/api/send-email", formData);
      alert(response.data); // Shows success message
      formRef.current.reset(); // Optionally reset the form
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  return (
    <div style={{ marginTop: "-5rem" }}
    className="w-full relative bg-white overflow-hidden flex flex-col items-end justify-start py-0 px-px box-border leading-[normal] tracking-[normal]"
  >
      <FirstFold1 />
      <form ref={formRef} onSubmit={sendEmail} className="py-5 self-stretch flex flex-col items-center justify-center box-border max-w-full">
        {/* Form fields */}
        <div  className="md:container p-5 md:mx-auto mq750:!p-5 mq750:!py-[40px]"
          style={{ border: "1px solid #333", borderRadius: "2rem" }}>
          <h1>Contact <span style={{ color: "#D26600" }}>US</span></h1>
          {/* First Name */}
          <input placeholder="Enter First Name" type="text" name="firstName" required maxLength="50" />
          {/* Last Name */}
          <input placeholder="Enter Last Name" type="text" name="lastName" required maxLength="50" />
          {/* Email */}
          <input placeholder="Enter Email Address" type="email" name="email" required maxLength="50" />
          {/* Phone */}
          <input placeholder="+91-XXXXX-XXXXX" type="tel" name="phone" required maxLength="50" />
          {/* Message */}
          <textarea placeholder="Write your message..." name="msg" rows="5" maxLength={2000}></textarea>
          <button type="submit" style={{ backgroundColor: "#FFCBA4" }}>Send mail</button>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default ContactUs2;
