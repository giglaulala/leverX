import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main className="not-found-main">
      <div className="not-found-container">
        <img
          className="not-found-image"
          src="./assets/221587-P16MQB-374.jpg"
          alt="page not found"
        />

        <div className="not-found-title">404 Page not found</div>
        <span className="not-found-desc">
          Sorry we can't find that page! It might be an old link or maybe it was
          moved
        </span>
        <div onClick={() => navigate("/")} className="not-found-btn">
          GO TO THE HOME PAGE
        </div>
      </div>
    </main>
  );
}
