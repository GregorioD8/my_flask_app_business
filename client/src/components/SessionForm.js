import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SessionForm = ({ onSubmitSuccess, selectedCoach, clients }) => {
  const formSchema = yup.object().shape({
    client_id: yup.string().required("Must select a client"),
    date: yup.date().required("Must enter a date"),
    hour: yup.string().required("Must select an hour"),
    period: yup.string().required("Must select AM or PM"),
    notes: yup.string().required("Must enter notes"),
    goal_progress: yup
      .number()
      .min(1, "Must enter goal progress between 1 and 10")
      .max(10, "Must enter goal progress between 1 and 10")
      .required("Must enter goal progress"),
  });

  const formik = useFormik({
    initialValues: {
      client_id: "",
      date: "",
      hour: "",
      period: "AM", // default to AM
      notes: "",
      goal_progress: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      let hour = parseInt(values.hour);
      if (values.period === "PM" && hour !== 12) {
        hour += 12;
      } else if (values.period === "AM" && hour === 12) {
        hour = 0;
      }
      const time = `${hour.toString().padStart(2, "0")}:00:00`; // Format hour to 'HH:00:00'
      const dateTime = `${values.date} ${time}`;  // Combine date and time into single timestamp

      fetch(`${BACKEND_URL}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateTime, // Send session datetime to backend
          client_id: values.client_id, // Associate session with selected client
          coach_id: selectedCoach, // Associate session with logged-in coach
          notes: values.notes,
          goal_progress: values.goal_progress,
        }),
      })
        .then((res) => {
          if (res.status === 201) {  // Check for successful response
            formik.resetForm(); // Clear form on success
            onSubmitSuccess && onSubmitSuccess(); // Notify parent of successful submission
          }
        })
        .catch((error) => console.error("Error adding session:", error));
    },
  });

  const generateHours = () => {
    const hours = [];
    for (let i = 1; i <= 12; i++) {
      hours.push(i.toString().padStart(2, "0"));
    }
    return hours;
  };

  return (
    <div className="custom-shadow form-container">
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="client_id">Client</label>
          <select
            id="client_id"
            name="client_id"
            onChange={formik.handleChange}
            value={formik.values.client_id}
            className="form-control"
          >
            <option value="" label="Select client" />
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {formik.errors.client_id && <p className="text-danger">{formik.errors.client_id}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            onChange={formik.handleChange}
            value={formik.values.date}
            className="form-control"
          />
          {formik.errors.date && <p className="text-danger">{formik.errors.date}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="hour">Time</label>
          <select
            id="hour"
            name="hour"
            onChange={formik.handleChange}
            value={formik.values.hour}
            className="form-control-inline"
          >
            <option value="" label="Select hour" />
            {generateHours().map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          <select
            id="period"
            name="period"
            onChange={formik.handleChange}
            value={formik.values.period}
            className="form-control-inline"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
          {formik.errors.hour && <p className="text-danger">{formik.errors.hour}</p>}
          {formik.errors.period && <p className="text-danger">{formik.errors.period}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            onChange={formik.handleChange}
            value={formik.values.notes}
            className="form-control"
          />
          {formik.errors.notes && <p className="text-danger">{formik.errors.notes}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="goal_progress">Goal Progress (1-10)</label>
          <input
            id="goal_progress"
            name="goal_progress"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.goal_progress}
            className="form-control"
          />
          {formik.errors.goal_progress && <p className="text-danger">{formik.errors.goal_progress}</p>}
        </div>

        <button type="submit" className="btn-session">Submit</button>
      </form>
    </div>
  );
};

export default SessionForm;