import { useRef } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import FirstFold1 from "../components/FirstFold1";

const ContactUs = () => {
  const formRef = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = {
      firstName: formRef.current["firstName"].value,
      lastName: formRef.current["lastName"].value,
      email: formRef.current["email"].value,
      phone: formRef.current["phone"].value,
      message: formRef.current["msg"].value,
    };

    try {
      // Send form data to the backend API
      const response = await axios.post("http://localhost:8000/api/send-email", formData);
      alert(response.data); // Shows success message
      formRef.current.reset(); // Optionally reset the form
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  return (
    <div
      style={{ marginTop: "-5rem" }}
      className="w-full relative bg-white overflow-hidden flex flex-col items-end justify-start py-0 px-px box-border leading-[normal] tracking-[normal]"
    >
      <FirstFold1 />
      
      <form className="py-5 self-stretch flex flex-col items-center justify-center box-border max-w-full" ref={formRef} onSubmit={sendEmail}>
        <div
          className="md:container p-5 md:mx-auto mq750:!p-5 mq750:!py-[40px]"
          style={{ border: "1px solid #333", borderRadius: "2rem" }}
        >
          <h1 className="pb-4">
            Contact <span style={{ color: "#D26600" }}>US</span>
          </h1>
          <div>
            <div className="mb-5 row">
              <div className="col">
                <label>First Name</label>
                <input
                  placeholder="Enter First Name"
                  type="text"
                  required
                  maxLength="50"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                />
              </div>
              <div className="col">
                <label>Last Name</label>
                <input
                  placeholder="Enter Last Name"
                  type="text"
                  required
                  maxLength="50"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                />
              </div>
            </div>
            <div className="mb-5 row">
              <div className="col">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  required
                  maxLength="50"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter Email Address"
                />
              </div>
              <div className="col">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  required
                  maxLength="50"
                  className="form-control"
                  id="phone"
                  name="phone"
                  placeholder="+91-XXXXX-XXXXX"
                />
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="msg">Message</label>
              <textarea
                placeholder="Write your message..."
                className="form-control"
                id="msg"
                name="msg"
                rows="5"
                maxLength={1000}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn px-4 btn-lg"
              style={{ backgroundColor: "#FFCBA4" }}
            >
              Send mail
            </button>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default ContactUs;
