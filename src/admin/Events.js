import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchAndFilters from "../components/SearchAndFilters";
import Edit from "@mui/icons-material/BorderColorTwoTone";
import Delete from "@mui/icons-material/DeleteForeverTwoTone";
import View from "@mui/icons-material/VisibilityTwoTone";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Button, Divider } from "@mui/material";
import '../Csss/Orders.css';

const Events = () => {
  const url = process.env.REACT_APP_BACKEND;
  const [searchedEvents, setSearchedEvents] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination states
  const [latestPage, setLatestPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [latestPagination, setLatestPagination] = useState(null);
  const [pastPagination, setPastPagination] = useState(null);

  const navigate = useNavigate();

  // Fetch latest events
  useEffect(() => {
    fetchLatestEvents(1);
  }, []);

  // Fetch past events
  useEffect(() => {
    fetchPastEvents(1);
  }, []);

  // Fetch latest events with pagination
  const fetchLatestEvents = async (page) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${url}events/latest?page=${page}&limit=10`, { headers });

      if (page === 1) {
        setLatestEvents(response.data.events);
      } else {
        setLatestEvents(prev => [...prev, ...response.data.events]);
      }

      setLatestPagination(response.data.pagination);
      setLatestPage(page);
      setError(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch latest events";
      setError(errorMsg);
      console.error("Error fetching latest events:", error);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch past events with pagination
  const fetchPastEvents = async (page) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${url}events/past?page=${page}&limit=10`, { headers });

      if (page === 1) {
        setPastEvents(response.data.events);
      } else {
        setPastEvents(prev => [...prev, ...response.data.events]);
      }

      setPastPagination(response.data.pagination);
      setPastPage(page);
      setError(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch past events";
      setError(errorMsg);
      console.error("Error fetching past events:", error);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle search results
  const handleSearchDataChange = (searchResults) => {
    setSearchedEvents(searchResults);
  };

  // Navigate to event details
  // const handleViewEvent = (id) => {
  //   navigate(`/live-event?q=${id}`);
  // };

  // Navigate to bookings
  const handleBookingsClick = (eventId, eventName) => {
    navigate(`/admin/allproduct/${eventId}/${encodeURIComponent(eventName)}`);
  };

  // Navigate to edit event
  const handleEditClick = (id) => {
    navigate(`/admin/updateevent/${id}`);
  };

  // Handle delete event
  const handleDeleteClick = (eventId) => {
    setDeleteEventId(eventId);
    setShowDeleteConfirm(true);
  };

  // Confirm delete event
  const confirmDelete = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      setLoading(true);
      await axios.delete(`${url}events/${deleteEventId}`, { headers });

      // Remove the deleted event from all lists
      setLatestEvents(latestEvents.filter(event => event._id !== deleteEventId));
      setPastEvents(pastEvents.filter(event => event._id !== deleteEventId));
      setSearchedEvents(searchedEvents.filter(event => event._id !== deleteEventId));

      const successMsg = "Event deleted successfully";
      setSuccess(successMsg);
      alert(successMsg);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to delete event";
      setError(errorMsg);
      console.error("Error deleting event:", error);
      alert(errorMsg);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeleteEventId(null);
    }
  };


  // Custom styles
  const cellHeaderStyle = {
    padding: "8px",
    fontWeight: "bold",
    color: "#FFFFFF",
  };

  const cellStyle = {
    color: "#555555",
    fontSize: "14px",
    cursor: "pointer",
  };

  const deleteButtonStyle = {
    opacity: 0.3,
    transition: "opacity 0.3s",
    border: "none",
    background: "none",
    cursor: "pointer",
  };

  const actionButtonStyle = {
    color: "#D26600",
    cursor: "pointer",

  };

  const handleReject = async (event) => {
    const confirmRejection = window.confirm(
      `Are you sure you want to reject the event "${event.eventName}"?`
    );

    if (confirmRejection) {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
      };
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      try {
        const response = await axios.put(`${url}admin/reject/${event._id}`, { headers });
        setLatestEvents(latestEvents.filter((e) => e._id !== event._id));
        alert(response.data.message || "Event approved successfully!");
      } catch (error) {
        console.error("Error rejecting event:", error);
        alert("Error rejecting event: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="events-page" style={{ padding: "1rem" }}>
      {/* Search and Filters */}
      <div className="search-section">
        <SearchAndFilters handleSearchDataChange={handleSearchDataChange} />
      </div>

      {loading && <Loader />}
      <div style={{ marginTop: "2rem" }}>
        <h2>Latest Events</h2>
        <div style={{ overflowX: "auto", marginTop: "1rem" }}>
          {/* Header Row */}
          <div className="bg-[#EE7D45] grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] gap-2">
            <div style={cellHeaderStyle}>ID</div>
            <div style={cellHeaderStyle}>Name</div>
            <div style={cellHeaderStyle}>Host</div>
            <div style={cellHeaderStyle}>Start Date</div>
            <div style={cellHeaderStyle}>End Date</div>
            <div style={cellHeaderStyle}>Price</div>
            <div style={cellHeaderStyle}>Bookings</div>
            <div style={cellHeaderStyle}>View</div>
            <div style={cellHeaderStyle}>Edit</div>
            <div style={cellHeaderStyle}>Delete</div>
            <div style={cellHeaderStyle}>Approved</div>
          </div>

          {/* Data Rows */}
          {latestEvents.length > 0 ? (
            latestEvents.map((event) => (
              <>
                <div
                  key={event._id}
                  className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] gap-2 border-b border-[#000000]"
                  onMouseEnter={(e) => {
                    const btns = e.currentTarget.querySelectorAll(".action-btn");
                    btns.forEach(btn => btn.style.opacity = 1);
                  }}
                  onMouseLeave={(e) => {
                    const btns = e.currentTarget.querySelectorAll(".action-btn");
                    btns.forEach(btn => btn.style.opacity = 0.3);
                  }}
                >
                  <Button
                    title="Click to copy"
                    className="py-2"
                    style={cellStyle}
                    onClick={() => navigator.clipboard.writeText(event._id)}
                  >
                    {event._id.slice(-5)}
                  </Button>
                  <Button
                    title="Click to copy"
                    className="py-2"
                    style={cellStyle}
                    onClick={() => navigator.clipboard.writeText(event.eventName)}
                  >
                    {event.eventName}
                  </Button>
                  <Button
                    title="Click to copy"
                    className="py-2"
                    style={cellStyle}
                    onClick={() => navigator.clipboard.writeText(event.organizerName)}
                  >
                    {event.organizerName}
                  </Button>
                  <Button
                    title="Click to copy"
                    className="py-2"
                    style={cellStyle}
                    onClick={() => navigator.clipboard.writeText(new Date(event.startDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))}
                  >
                    {new Date(event.startDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </Button>
                  <Button
                    title="Click to copy"
                    className="py-2"
                    style={cellStyle}
                    onClick={() => navigator.clipboard.writeText(new Date(event.endDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))}
                  >
                    {new Date(event.endDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </Button>
                  <Button
                    title="Click to copy"
                    className="py-2"
                    style={cellStyle}
                    onClick={() => navigator.clipboard.writeText(event.eventPrice === "0" ? "Free" : `₹${event.eventPrice}`)}
                  >
                    {event.eventPrice === "0" ? "Free" : `₹${event.eventPrice}`}
                  </Button>
                  <Button
                    className="py-2"
                    style={cellStyle}
                  // onClick={() => event.bookings && event.bookings.length > 0 ? handleBookingsClick(event._id, event.eventName) : null}
                  >
                    {event.bookings && event.bookings.length > 0 ? event.bookings.length : "0"}
                  </Button>
                  <span className="flex items-center justify-start">
                    <View
                      onClick={() => {
                        window.open(`${process.env.REACT_APP_FRONTEND}/event/${event._id}`, "_blank", "noopener,noreferrer")
                      }}
                      titleAccess="View Event"
                      style={actionButtonStyle}
                    />
                  </span>
                  <div className="py-2 flex items-center justify-center">
                    <button className="action-btn" style={deleteButtonStyle} onClick={() => handleEditClick(event._id)}>
                      <Edit titleAccess="Edit Event" style={{ color: "#D26600" }} />
                    </button>
                  </div>
                  <div className="py-2 flex items-center justify-center">
                    <button className="action-btn" style={deleteButtonStyle} onClick={() => handleDeleteClick(event._id)}>
                      <Delete titleAccess="Delete Event" style={{ color: "#D26600" }} />
                    </button>
                  </div>
                  <button onClick={() => handleReject(event)} style={deleteButtonStyle} className="action-btn py-2 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={event.approved || false}
                    />
                  </button>
                </div>
                <Divider />
              </>

            ))
          ) : (
            <div style={{ padding: "8px 0", textAlign: "center" }}>
              <p>No latest events found</p>
            </div>
          )}
        </div>

        {latestPagination && latestPagination.hasNextPage && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button
              onClick={() => fetchLatestEvents(latestPage + 1)}
              disabled={loading}
              className="bg-[#EE7D45] text-white px-4 py-2 rounded hover:bg-[#D26600]"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Past Events */}
      <div style={{ marginTop: "2rem" }}>
        <h2>Past Events</h2>
        <div style={{ overflowX: "auto", marginTop: "1rem" }}>
          {/* Header Row */}
          <div className="bg-[#EE7D45] grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] gap-2">
            <div style={cellHeaderStyle}>ID</div>
            <div style={cellHeaderStyle}>Name</div>
            <div style={cellHeaderStyle}>Host</div>
            <div style={cellHeaderStyle}>Start Date</div>
            <div style={cellHeaderStyle}>End Date</div>
            <div style={cellHeaderStyle}>Price</div>
            <div style={cellHeaderStyle}>Bookings</div>
            <div style={cellHeaderStyle}>View</div>
            <div style={cellHeaderStyle}>Edit</div>
            <div style={cellHeaderStyle}>Delete</div>
          </div>

          {/* Data Rows */}
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <>
                <div
                  key={event._id}
                  className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] gap-2 border-b border-[#000000]"
                  onMouseEnter={(e) => {
                    const btns = e.currentTarget.querySelectorAll(".action-btn");
                    btns.forEach(btn => btn.style.opacity = 1);
                  }}
                  onMouseLeave={(e) => {
                    const btns = e.currentTarget.querySelectorAll(".action-btn");
                    btns.forEach(btn => btn.style.opacity = 0.3);
                  }}
                >
                  <Button
                    title="Click to copy"
                    className="py-2"
                    style={cellStyle}
                    onClick={() => navigator.clipboard.writeText(event._id)}
                  >
                    {event._id.slice(-5)}
                  </Button>
                  <Button
                    title="Click to copy"
                    className="py-2"
                    style={cellStyle}
                    onClick={() => navigator.clipboard.writeText(event.eventName)}
                  >
                    {event.eventName}
                  </Button>
                  <Button
                    title="Click to copy"
                    className="py-2"
                    style={cellStyle}
                    onClick={() => navigator.clipboard.writeText(event.organizerName)}
                  >
                    {event.organizerName}
                  </Button>
                  <Button
                    title="Click to copy"
                    className="py-2"
                    style={cellStyle}
                    onClick={() => navigator.clipboard.writeText(new Date(event.startDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))}
                  >
                    {new Date(event.startDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </Button>
                  <Button
                    title="Click to copy"
                    className="py-2"
                    style={cellStyle}
                    onClick={() => navigator.clipboard.writeText(new Date(event.endDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))}
                  >
                    {new Date(event.endDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </Button>
                  <Button
                    title="Click to copy"
                    className="py-2"
                    style={cellStyle}
                    onClick={() => navigator.clipboard.writeText(event.eventPrice === "0" ? "Free" : `₹${event.eventPrice}`)}
                  >
                    {event.eventPrice === "0" ? "Free" : `₹${event.eventPrice}`}
                  </Button>
                  <Button
                    className="py-2"
                    style={cellStyle}
                  // onClick={() => event.bookings && event.bookings.length > 0 ? handleBookingsClick(event._id, event.eventName) : null}
                  >
                    {event.bookings && event.bookings.length > 0 ? event.bookings.length : "0"}
                  </Button>
                  <span className="flex items-center justify-start">
                    <View
                      onClick={() => {
                        window.open(`${process.env.REACT_APP_FRONTEND}/event/${event._id}`, "_blank", "noopener,noreferrer")
                      }}
                      titleAccess="View Event"
                      style={actionButtonStyle}
                    />
                  </span>
                  <button className="action-btn" style={deleteButtonStyle} onClick={() => handleEditClick(event._id)}>
                    <Edit titleAccess="Edit Event" style={{ color: "#D26600" }} />
                  </button>
                  <div className="py-2 flex items-center justify-center">
                    <button className="action-btn" style={deleteButtonStyle} onClick={() => handleDeleteClick(event._id)}>
                      <Delete titleAccess="Delete Event" style={{ color: "#D26600" }} />
                    </button>
                  </div>
                </div>
                <Divider />
              </>

            ))
          ) : (
            <div style={{ padding: "8px 0", textAlign: "center" }}>
              <p>No past events found</p>
            </div>
          )}
        </div>

        {pastPagination && pastPagination.hasNextPage && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button
              onClick={() => fetchPastEvents(pastPage + 1)}
              disabled={loading}
              className="bg-[#EE7D45] text-white px-4 py-2 rounded hover:bg-[#D26600]"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              <p>Are you sure you want to delete this event? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;