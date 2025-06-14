import EventData from "../components/EventData";
import ButtonComponent from "../components/ButtonComponent";
import EventPoster from "../components/EventPoster";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import FirstFold1 from "../components/FirstFold1";
import { useEffect, useState } from "react";
import axios from "axios";
const Event = () => {
  const url = process.env.REACT_APP_BACKEND;
  const navigate = useNavigate();
  // const location = useLocation();
  const handleBookNowClick = () => {
    navigate("/booking", { state: { event } });
  };
  const [event, setEvent] = useState();
  const { id } = useParams();

  useEffect(() => {
    getEvent();
  }, []);

  const getEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${url}events/${id}`, {
        headers,
      });
      if (response.status === 200 && response.data.success) {
        setEvent(response.data.event);
      } else {
        alert("Failed to fetch event data.");
      }
    } catch (err) {
      if (err.response) {
        // Server responded with a status code outside the 2xx range
        alert(`Error: ${err.response.data.message || "Server Error"}`);
      } else if (err.request) {
        // Request was made but no response received
        alert("Network error: No response received from server.");
      } else {
        // Error setting up the request
        alert(`Error: ${err.message}`);
      }
    }
  };
  return (
    <div
      style={{ marginTop: "-5rem" }}
      className="w-full relative bg-white overflow-hidden flex flex-col items-end justify-start gap-[41px] leading-[normal] tracking-[normal] mq750:gap-[20px]"
    >
      <FirstFold1
        group="/group7.svg"
        firstFoldMenu="/first-fold-menu@2x.png"
        rectangle10="/rectangle-1011.svg"
        group1="/group-12.svg"
      />
      <section className="self-stretch flex flex-row items-start justify-center pt-0 pb-28 pr-5 pl-[21px] box-border max-w-full lg:pb-[73px] lg:box-border mq450:pb-[31px] mq450:box-border mq1050:pb-[47px] mq1050:box-border">
        <div className="w-[1199px] flex flex-col items-start justify-start gap-[72px] max-w-full lg:gap-[36px] mq750:gap-[18px]">
          <EventPoster poster={event?.eventPosters[0]} />
          <EventData event={event} />
          <ButtonComponent
            title="Book Now"
            desc="Book your slot in just one click"
            onClick={handleBookNowClick}
          />
        </div>
      </section>
      <Footer
        group="/group1.svg"
        facebook="/facebook.svg"
        twitter="/twitter.svg"
        linkedin="/linkedin.svg"
        group1="/group1.svg"
        footerAlignSelf="stretch"
        footerWidth="unset"
      />
    </div>
  );
};

export default Event;
