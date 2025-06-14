import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import View from "@mui/icons-material/VisibilityTwoTone";
import Edit from "@mui/icons-material/BorderColorTwoTone";
import Delete from "@mui/icons-material/DeleteForeverTwoTone";
import CheckCircle from "@mui/icons-material/CheckCircleTwoTone";
import Cancel from "@mui/icons-material/CancelTwoTone";
import Loader from "../components/Loader";
import dayjs from "dayjs";
import { Divider } from "@mui/material";

const PendingEvents = () => {
  const url = process.env.REACT_APP_BACKEND;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get(`${url}events/pending`, { headers });
      const pendingEvents = response.data.pending || [];
      setEvents(pendingEvents);
    } catch (error) {
      console.error("Error fetching pending events:", error);
      alert("Error fetching pending events: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (event) => {
    const confirmApproval = window.confirm(
      `Are you sure you want to approve the event "${event.eventName}"?`
    );

    if (confirmApproval) {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      try {
        const response = await axios.put(`${url}admin/approve/${event._id}`, { headers });
        setEvents(events.filter((e) => e._id !== event._id));
        alert(response.data.message || "Event approved successfully!");
      } catch (error) {
        console.error("Error approving event:", error);
        alert("Error approving event: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReject = async (event) => {
    const confirmRejection = window.confirm(
      `Are you sure you want to reject the event "${event.eventName}"?`
    );

    if (confirmRejection) {
      setLoading(true);
      try {
        const response = await axios.put(`${url}admin/reject/${event._id}`);
        setEvents(events.filter((e) => e._id !== event._id));
        alert(response.data.message || "Event rejected successfully!");
      } catch (error) {
        console.error("Error rejecting event:", error);
        alert("Error rejecting event: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (event) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the event "${event.eventName}"? This action is irreversible.`
    );

    if (confirmDelete) {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      try {
        const response = await axios.delete(`${url}events/${event._id}`, { headers });
        setEvents(events.filter((e) => e._id !== event._id));
        alert(response.data.message || "Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Error deleting event: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleEditClick = (id) => {
    navigate(`/admin/updateevent/${id}`);
  };

  return (
    <div className="px-2">
      {loading && <Loader />}
      <h1 className="text-2xl font-bold mb-4">Pending Events</h1>

      <div className="overflow-x-auto">
        <div className="">
          {/* Header Row */}
          <div className="flex bg-[#EE7D45] text-white font-bold">
            <div className="p-3 w-16 flex-shrink-0">ID</div>
            <div className="p-3 w-40 flex-shrink-0">Event Name</div>
            <div className="p-3 w-32 flex-shrink-0">Category</div>
            <div className="p-3 w-32 flex-shrink-0">Host Name</div>
            <div className="p-3 w-32 flex-shrink-0">Host Contact</div>
            <div className="p-3 w-40 flex-shrink-0">Start Date</div>
            <div className="p-3 w-40 flex-shrink-0">End Date</div>
            <div className="p-3 w-32 flex-shrink-0">Created At</div>
            <div className="p-3 w-32 flex-shrink-0">Actions</div>
          </div>

          {/* Data Rows */}
          {events && events.length > 0 ? (
            events.map((event) => (
              <>
                <div
                  key={event._id}
                  className="flex border-b border-gray-200 hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <div
                    className="p-3 w-16 flex-shrink-0 cursor-pointer"
                    title="Click to copy ID"
                    onClick={() => copyToClipboard(event._id)}
                  >
                    {event._id ? `${event._id.slice(-5)}...` : "--"}
                  </div>
                  <div
                    className="p-3 w-40 flex-shrink-0 cursor-pointer truncate"
                    title="Click to copy event name"
                    onClick={() => copyToClipboard(event.eventName)}
                  >
                    {event.eventName || "--"}
                  </div>
                  <div
                    className="p-3 w-32 flex-shrink-0 cursor-pointer truncate"
                    title="Click to copy category"
                    onClick={() => copyToClipboard(event.eventCategory)}
                  >
                    {event.eventCategory || "--"}
                  </div>
                  <div
                    className="p-3 w-32 flex-shrink-0 cursor-pointer truncate"
                    title="Click to copy host name"
                    onClick={() => copyToClipboard(event.organizerName)}
                  >
                    {event.organizerName || "--"}
                  </div>
                  <div
                    className="p-3 w-32 flex-shrink-0 cursor-pointer truncate"
                    title="Click to copy contact"
                    onClick={() => copyToClipboard(event.organizerWhatsapp)}
                  >
                    <a href={`tel:+91${event.organizerWhatsapp}`}>
                      {event.organizerWhatsapp || "--"}
                    </a>
                  </div>
                  <div
                    className="p-3 w-40 flex-shrink-0 cursor-pointer"
                    title="Click to copy start date"
                    onClick={() => copyToClipboard(new Date(event.startDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))}
                  >
                    {event.startDate
                      ? dayjs(event.startDate).format("DD-MM-YYYY HH:mm")
                      : "--"}
                  </div>
                  <div
                    className="p-3 w-40 flex-shrink-0 cursor-pointer"
                    title="Click to copy end date"
                    onClick={() => copyToClipboard(new Date(event.endDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))}
                  >
                    {event.endDate
                      ? dayjs(event.endDate).format("DD-MM-YYYY HH:mm")
                      : "--"}
                  </div>
                  <div
                    className="p-3 w-32 flex-shrink-0 cursor-pointer"
                    title="Click to copy created date"
                    onClick={() => copyToClipboard(new Date(event.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))}
                  >
                    {event.createdAt
                      ? dayjs(event.createdAt).format("DD-MM-YYYY HH:mm")
                      : "--"}
                  </div>
                  <div className="w-fit flex-shrink-0 flex gap-2  items-center justify-center">
                    <View
                      onClick={() => {
                        window.open(`${process.env.REACT_APP_FRONTEND}/event/${event._id}`, "_blank", "noopener,noreferrer")
                      }}
                      titleAccess="View Event"
                      className="text-[#D26600] cursor-pointer"
                    />
                    {/* <button className="text-[#D26600] cursor-pointer col-start-2 row-start-1" onClick={() => handleEditClick(event._id)}> */}
                    <Edit titleAccess="Edit Event" style={{ color: "#D26600" }} className="text-[#D26600] cursor-pointer" onClick={() => handleEditClick(event._id)} />
                    {/* </button> */}
                    <Delete
                      onClick={() => handleDelete(event)}
                      titleAccess="Delete Event"
                      className="text-[#D26600] cursor-pointer"
                    />
                    <CheckCircle
                      onClick={() => handleApprove(event)}
                      titleAccess="Approve Event"
                      className="text-[#D26600] cursor-pointer"
                    />
                  </div>
                </div>
                <Divider />
              </>

            ))
          ) : (
            <div className="p-4 text-center border-b">
              No pending events found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingEvents;