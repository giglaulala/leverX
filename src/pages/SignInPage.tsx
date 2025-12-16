import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useSignInMutation } from "../store/api";
import InlineAlert from "../components/InlineAlert";

export default function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [signIn, { isLoading }] = useSignInMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    const form = e.currentTarget;
    const emailInput = form.elements.namedItem(
      "email"
    ) as HTMLInputElement | null;
    const passInput = form.elements.namedItem(
      "password"
    ) as HTMLInputElement | null;

    const email = (emailInput?.value || "").trim();
    const password = passInput?.value || "";

    if (!email || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    signIn({ email, password })
      .unwrap()
      .then((data) => {
        login(data.user);
        navigate("/");
      })
      .catch((err: any) => {
        console.error(err);
        const message =
          err?.data?.message || err?.message || "something went wrong";
        setErrorMessage(message);
      });
  }

  return (
    <main className="signin-container">
      <div className="greeting-text">Welcome Back!</div>
      <form className="signin-form" onSubmit={handleSubmit}>
        <h1 className="singin-title">Sign in</h1>
        {errorMessage && (
          <InlineAlert variant="error" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </InlineAlert>
        )}

        <label htmlFor="email" className="email-text">
          Email
        </label>
        <input
          type="email"
          className="input email"
          name="email"
          required
          placeholder="name@gmail.com"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="input password"
          name="password"
          required
          placeholder="••••••••"
        />

        <button className="details-edit-btn" type="submit">
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <div className="signup">
          new here{" "}
          <a href="" className="signup-link">
            sign up
          </a>
        </div>
      </form>
    </main>
  );
}
