// Calendar.js
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

const Calendar = ({ sessions }) => {
  const getClientInitials = name => 
    name.split(" ").map(part => part[0].toUpperCase()).join(".");

  const events = sessions.map(session => ({
    title: getClientInitials(session.client_name), // Set event title as client initials
    start: session.date, // Set event start date and time
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
};

export default Calendar;