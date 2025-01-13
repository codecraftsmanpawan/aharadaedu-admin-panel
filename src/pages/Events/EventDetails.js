import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import base_url from "../../config";
const EventDetails = () => {
  const { title } = useParams(); // Extract the title from the URL
  const [event, setEvent] = useState(null);
  const navigate = useNavigate(); // The hook should be inside the component

  useEffect(() => {
    // Fetch event details by title from the URL
    axios
      .get(`${base_url}/api/events/${title}`)
      .then((response) => {
        setEvent(response.data.event);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
      });
  }, [title]); // Dependency array includes title to fetch new data when title changes

  if (!event) {
    return (
      <div className="text-center p-6">
        <p>Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{event.title} Events Details</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>

      <img
        src={`${base_url}${event.image}`}
        alt={event.title}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />

      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600 font-medium">Location: {event.location}</p>
        <p className="text-gray-600 font-medium">
          Date: {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-gray-600 font-medium">Time: {event.time}</p>
      </div>

      <div
        className="text-gray-700 mb-4"
        dangerouslySetInnerHTML={{ __html: event.description }}
      />
    </div>
  );
};

export default EventDetails;
