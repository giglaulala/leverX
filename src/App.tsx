import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AddressBookPage from "./pages/AddressBookPage";
import DetailsPage from "./pages/DetailsPage";
import SettingsPage from "./pages/SettingsPage";
import SignInPage from "./pages/SignInPage";
import NotFoundPage from "./pages/NotFoundPage";
import { RequireAuth } from "./auth/RequireAuth";

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout>
              <AddressBookPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/employees/:id"
        element={
          <RequireAuth>
            <Layout>
              <DetailsPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth roles={["admin"]}>
            <Layout>
              <SettingsPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default App;
