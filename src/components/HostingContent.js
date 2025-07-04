import { useCallback } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../Csss/HostingContent.css";

const HostingContent = ({ className = "" }) => {
  const navigate = useNavigate();

  const onGroupContainerClick = useCallback(
    (category) => {
      navigate("/search-bar");
    },
    [navigate]
  );

  const cardsData = [
    { src: "/pravachan.jpg", label: "Satsang & Dharmic Pravachan" },
    { src: "/bhajan.png", label: "Bhajan & Kirtan" },
    { src: "/sabha.png", label: "Dharam Sabha" },
    { src: "/yoga.jpg", label: "Yoga & Dhyan" },
    { src: "/utsav.webp", label: "Utsav & Celebrations" },
    { src: "/adhyatmik.jpg", label: "Adhyatmik Shivir (Spiritual Retreats)" },
    { src: "/pooja.jpg", label: "Puja & Anushthan" },
    { src: "/seva.jpg", label: "Seva & Charity" },
    {
      src: "/rectangle-13611@2x.png",
      label: "Sanskritik Karyakram (Cultural Programs)",
    },
    { src: "/rectangle-1361-1@2x.png", label: "Vividh (Others)" },
  ];

  return (
    <div className={`container ${className}`}>
      <div className="header">
        <div className="header-title ">
          <h1>
            <b>What You Can Host ?</b>
          </h1>
        </div>
        <div className="header-subtitle">
          <h2>
            Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero et velit interdum, ac aliquet odio mattis.
          </h2>
        </div>
      </div>

      {/* Cards Start */}
      <div className="cards-container">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="card"
            onClick={() => {
              onGroupContainerClick(card.label);
            }}
          >
            <img loading="lazy" alt="" src={card.src} />
            <div className="card-button-container p-1">
              <Button
                disableElevation
                variant="contained"
                sx={{
                  textTransform: "none",
                  color: "#fff",
                  fontSize: "16",
                  background: "#ff5f17",
                  borderRadius: "50px",
                  "&:hover": { background: "#ff5f17" },
                  height: 38,
                  padding: "1.5rem 1rem",
                  textAlign: "center",
                }}
              >
                {card.label}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Cards End */}

      <div className="footer">
        <div className="footer-divider" />
        <div className="footer-content">
          <h1 className="footer-title">Sit back and enjoy your event </h1>
          <h2 className="footer-subtitle">
            Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero et velit interdum, ac aliquet odio mattis.
          </h2>
        </div>
      </div>
    </div>
  );
};

HostingContent.propTypes = {
  className: PropTypes.string,
};

export default HostingContent;
