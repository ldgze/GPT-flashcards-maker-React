import { useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "./BasePage";
import { ErrorContext } from "../main";
import "../style/Register.css";

export default function Register() {
  const registerFormRef = useRef(null);
  const navigate = useNavigate();
  const { addError } = useContext(ErrorContext);

  useEffect(() => {
    document.body.classList.add("register-page-body");

    return () => {
      document.body.classList.remove("register-page-body");
    };
  }, []);

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
      <div className="container py-5">
        <h1 className="text-center mb-5 register-title">
          GPT Flashcards Maker - Register
        </h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <form ref={registerFormRef} onSubmit={handleSubmit}>
                  <h2 className="card-title text-center mb-4">
                    Please sign up
                  </h2>
                  <div className="form-floating mb-3">
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
                  <div className="form-floating mb-3">
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
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
}
