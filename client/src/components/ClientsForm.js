// ClientsForm.js
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";

const ClientsForm = ({ onSubmitSuccess }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const formik = useFormik({
    initialValues: {
      name: "",
      goals: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
      goals: yup.string().required("Goals are required"),
    }),
    onSubmit: (values) => {
      fetch(`${BACKEND_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then(res => res.json())
        .then(newClient => {
          onSubmitSuccess(newClient);
          formik.resetForm();
        })
        .catch(error => console.error("Error adding client:", error));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="name">Name: </label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        {formik.errors.name ? <div>{formik.errors.name}</div> : null}
      </div>
      <br/>
      <div>
        <label htmlFor="goals">Goals: </label>
        <input
          id="goals"
          name="goals"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.goals}
        />
        {formik.errors.goals ? <div>{formik.errors.goals}</div> : null}
      </div>
      <br/>
      <button type="submit">Submit</button>
      <br/>
    </form>
  );
};

export default ClientsForm;