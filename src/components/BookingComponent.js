import "../Csss/BookingComponent.css";
import Pin from "@mui/icons-material/LocationOnTwoTone";
import Start from "@mui/icons-material/AlarmTwoTone";
import Phone from "@mui/icons-material/PhoneTwoTone";
import Price from "@mui/icons-material/CurrencyRupeeTwoTone";
import FirstFold1 from "./FirstFold1";
import Footer from "./Footer";
import paymnet from "../img/payment.png";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
const BookingComponent = () => {
  const url = process.env.REACT_APP_BACKEND;
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [noOfAttendees, setNoOfAttendees] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!event) {
      return navigate("/");
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You have to login first!");
      navigate("/login");
    }
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setPhoneNumber(userInfo.contact);
    }
    setTimeout(() => {
      const windowHeight = window.innerHeight;
      const scrollPosition = windowHeight * 0.5;
      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }, 100);
  }, [event]);

  function getDay(dateTimeString) {
    const date = new Date(dateTimeString);
    return `${date.toLocaleString()}`;
  }

  const handlePrice = (e) => {
    const count = e.target.value;

    // If the input is exactly '0', show the alert and set the value to an empty string
    if (count === "0") {
      setNoOfAttendees("");
      alert("No Of Attendees should be at least 1");
    } else {
      // Otherwise, update the state with the new value
      setNoOfAttendees(count);
    }
  };

  // const handleBookEvent = async () => {
  //   const eventId = event._id;
  //   const userId = localStorage.getItem("userId");
  //   const phoneNumberRegex = /^\d{10}$/;
  //   if (!eventId || !userId) {
  //     return alert("Please login to book event");
  //   }
  //   if (!phoneNumber) {
  //     return alert("Please Enter Contact Number.");
  //   } else if (!phoneNumberRegex.test(phoneNumber)) {
  //     return alert("Invalid Contact Number!");
  //   }
  //   setLoading(true);
  //   try {
  //     await axios.post(`${url}/booking`, {
  //       event: eventId,
  //       attendeeContact: phoneNumber,
  //       noOfAttendee: noOfAttendees,
  //       amountPaid: "0",
  //       paymentId: null,
  //       user: userId,
  //     });

  //     alert("Event Booked Successfully!");
  //     navigate("/profile-page");

  //     // // Send WhatsApp message
  //     // const whatsappMessage = `Hello! Your booking for the event "${
  //     //   event.eventName
  //     // }" has been confirmed. Details: Date: ${getDay(
  //     //   event.startDate
  //     // )}, Location: ${event.eventAddress}. Thank you!`;

  //     // await axios.post(`${url}/send-whatsapp`, {
  //     //   to: `+91${phoneNumber}`,
  //     //   message: whatsappMessage,
  //     // });
  //   } catch (e) {
  //     alert("Error in booking: " + e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleBookEvent = async () => {
    const eventId = event._id;
    const userId = localStorage.getItem("userId");
    const phoneNumberRegex = /^\d{10}$/;

    if (!eventId || !userId) {
      return alert("Please login to book event");
    }
    if (!phoneNumber) {
      return alert("Please Enter Contact Number.");
    } else if (!phoneNumberRegex.test(phoneNumber)) {
      return alert("Invalid Contact Number!");
    }

    setLoading(true);
    let bookingConsent = confirm("Confirm Booking");
    if (!bookingConsent) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${url}booking`, {
        event: eventId,
        attendeeContact: phoneNumber,
        noOfAttendee: noOfAttendees,
        amountPaid: "0",
        paymentId: null,
        user: userId,
      });

      // If the response is OK and booking was successful
      if (response.status === 201 && response.data.success) {
        alert(response.data.message || "Event Booked Successfully!");
        navigate("/profile-page");
      } else {
        // Fallback in case the response doesn't indicate success
        alert("Booking failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      // Check if there's a response from the server with an error message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert("Error in booking: " + error.response.data.message);
      } else {
        alert("Error in booking: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = end - start;

    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    let durationString = "";
    if (days > 0) {
      durationString += `${days} Days`;
    }
    if (hours > 0) {
      if (durationString.length > 0) durationString += ", ";
      durationString += `${hours} Hrs`;
    }
    if (minutes > 0) {
      if (durationString.length > 0) durationString += ", ";
      durationString += `${minutes} Mins`;
    }

    return durationString;
  };

  return (
    <div
      style={{ marginTop: "-9rem", padding: "4rem 0 0 0" }}
      className="w-full relative bg-white overflow-hidden flex flex-col items-start justify-start gap-[50px] leading-[normal] tracking-[normal] mq750:gap-[41px] mq450:gap-[20px] "
    >
      {loading && <Loader />}
      <FirstFold1 />
      <div className="event-booking gap-3">
        <div className="event-card">
          <img
            src={
              event?.eventPosters
                ? `${event.eventPosters[0]}`
                : "/rectangle-12-1@2x.png"
            }
            alt="Event"
            className="event-image"
          />
          <div className="content p-3">
            <span className="flex justify-between">
              <h2>{event?.eventName}</h2>
              <h3 className="flex items-center justify-center">
                <Price className="text-end" sx={{ color: "#D26600" }} />
                {noOfAttendees > 0
                  ? event?.eventPrice * noOfAttendees
                  : event?.eventPrice}
              </h3>
            </span>
            <h6>
              <Pin sx={{ color: "#D26600" }} /> {event?.eventAddress}
            </h6>
            <h6>
              <Start sx={{ color: "#D26600" }} />
              <b>
                {event && getDay(event.startDate)} •
                {event && getDuration(event.startDate, event.endDate)}
              </b>
            </h6>
            {/* <h6>Host: <b><i>{event.hostName}</i></b></h6> */}
            <h6>
              <Phone sx={{ color: "#D26600" }} />
              <a href={`tel:+${event && event.hostWhatsapp}`}>
                <b>
                  <i> +91-{event && event.hostWhatsapp}</i>
                </b>
              </a>
            </h6>
            {/* <h6>Sponser: <b><i>{event.sponserName}</i></b></h6> */}
          </div>
        </div>
        <div className="booking-form" style={{ minWidth: "30%" }}>
          <h3 className="form-title">Book Event</h3>
          <form>
            <label>Event ID</label>
            <input
              type="text"
              placeholder="Event ID"
              value={event?._id}
              className="form-input"
              disabled
            />
            <label>Enter your contact number</label>
            <input
              type="tel"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
              placeholder="Enter your contact number"
              className="form-input"
              autoComplete="phone"
              value={phoneNumber}
            />
            <label>No Of Attendees</label>
            <input
              type="number"
              min={1}
              placeholder="No Of Attendees"
              onChange={handlePrice}
              value={noOfAttendees}
              className="form-input"
            />
            <div className="payment-methods">
              <img src={paymnet} alt="Payment Method 1" />
              {/* Add more payment icons as needed */}
            </div>
          </form>
          <button onClick={handleBookEvent} className="pay-now-button">
            Book Now
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingComponent;
