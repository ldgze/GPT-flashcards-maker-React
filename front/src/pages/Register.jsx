import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "./BasePage";
import { ErrorContext } from "../main";

export default function Register() {
  const registerFormRef = useRef(null);
  const navigate = useNavigate();
  const { addError } = useContext(ErrorContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(registerFormRef.current);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    if (!res.ok) {
      const data = await res.json();
      addError({ msg: data.msg, type: "danger" });
    } else {
      addError({ msg: "Signup successful, please log in", type: "success" });
      navigate("/login"); // Navigate to login page
    }
  };

  return (
    <BasePage>
      <div className="form-signin w-100 m-auto">
        <form ref={registerFormRef} onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal">Register</h1>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingInputRegister"
              placeholder="username"
              name="username"
              required
            />
            <label htmlFor="floatingInputRegister">Username</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPasswordRegister"
              placeholder="Password"
              name="password"
              required
            />
            <label htmlFor="floatingPasswordRegister">Password</label>
          </div>
          <button className="btn btn-primary w-100 py-2" type="submit">
            Sign Up
          </button>
        </form>
        <button
          className="btn btn-secondary w-100 py-2 mt-2"
          onClick={() => navigate("/login")}
        >
          Go to Sign In
        </button>
      </div>
    </BasePage>
  );
}
