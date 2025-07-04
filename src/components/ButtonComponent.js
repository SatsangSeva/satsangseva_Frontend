import { useCallback } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ButtonComponent = ({ className = "", title, desc, event, onClick }) => {
  const navigate = useNavigate();

  // Define the click handler function
  const handleBookNowClick = useCallback(() => {
    navigate(`/perticular`, { state: { event: event } });
  }, [navigate]);

  return (
    <div
      className={`self-stretch flex flex-row items-start justify-center py-0 box-border max-w-full text-left text-base text-black font-poppins mq750:p-5 mq750:box-border ${className}`}
    >
      <div className="w-[425px] flex flex-col items-start justify-start gap-[16px] max-w-full">
        <Button
          className="self-stretch h-12 shadow-[0px_4px_10px_rgba(0,_0,_0,_0.25)] mq450:pl-5 mq450:pr-5 mq450:box-border"
          variant="contained"
          sx={{
            textTransform: "none",
            color: "#fff",
            fontSize: "22px",
            background: "#ff5f17",
            border: "#f5f5f5 solid 1px",
            borderRadius: "50px",
            "&:hover": { background: "#ff5f17" },
            height: 48,
          }}
          onClick={onClick} // Attach the click handler
        >
          {title}
        </Button>
        <div className="self-stretch flex flex-row items-start justify-center">
          <div className="relative text-xl">{desc}</div>
        </div>
      </div>
    </div>
  );
};

ButtonComponent.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
  onClick: PropTypes.func,
};

export default ButtonComponent;
