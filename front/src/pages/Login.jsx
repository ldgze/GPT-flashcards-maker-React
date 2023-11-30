import { useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "./BasePage";
import { ErrorContext } from "../main";

export default function Login() {
  const loginFormRef = useRef(null);
  const navigate = useNavigate();
  const { addError, clearErrors } = useContext(ErrorContext);

  useEffect(() => {
    document.body.style.backgroundColor = "#343a40";
    document.body.style.color = "#fff";

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(loginFormRef.current);

    const response = await fetch("/api/login/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    if (!response.ok) {
      const data = await response.json();
      addError({ msg: data.msg, type: "danger" });
    } else {
      clearErrors();
      addError({ msg: "Login successful", type: "success" });
      navigate("/");
    }
  };

  return (
    <BasePage>
      <div className="container py-5">
        <h1 className="text-center mb-5" style={{ color: "#fff" }}>
          GPT Flashcards Maker
        </h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <form ref={loginFormRef} onSubmit={handleSubmit}>
                  <h2 className="card-title text-center mb-4">
                    Please sign in
                  </h2>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="username"
                      name="username"
                      required
                    />
                    <label htmlFor="floatingInput">Username</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="floatingPassword"
                      placeholder="Password"
                      name="password"
                      required
                    />
                    <label htmlFor="floatingPassword">Password</label>
                  </div>
                  <button className="btn btn-primary w-100 py-2" type="submit">
                    Sign in
                  </button>
                  <button
                    className="btn btn-secondary w-100 py-2 mt-3"
                    onClick={() => navigate("/register")}
                  >
                    Go to Sign Up
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
}
