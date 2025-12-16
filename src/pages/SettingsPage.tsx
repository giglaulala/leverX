import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery, useUpdateUserMutation } from "../store/api";
import type { Role, TAuthUser } from "../types";

export default function SettingsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [localUsers, setLocalUsers] = useState<TAuthUser[]>([]);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);

  const { data: users = [], isLoading, error } = useGetUsersQuery();

  const [updateUser] = useUpdateUserMutation();

  function handleChangeRole(userId: string, role: Role) {
    const current = localUsers.find((u) => u.id === userId);
    if (!current || current.role === role) return;

    setRoleError(null);
    setSavingUserId(userId);

    const prevRole = current.role;

  
    setLocalUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, role } : user))
    );

    updateUser({ id: userId, role })
      .unwrap()
      .then((updatedUser) => {
        setLocalUsers((prev) =>
          prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
      })
      .catch((err) => {
 
        setLocalUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, role: prevRole } : user
          )
        );
        setRoleError("cant update update role is the backend server restarted?");

        console.error("failed to update role", err);
      })
      .finally(() => {
        setSavingUserId((currentSaving) =>
          currentSaving === userId ? null : currentSaving
        );
      });
  }

  useEffect(() => {
    const raw = localStorage.getItem("currentUser");
    const currentUser = raw ? JSON.parse(raw) : null;
    setCurrentUserId(currentUser ? currentUser.id : null);
  }, []);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const visibleUsers = localUsers.filter((user) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      (user.name || "").toLowerCase().includes(q) ||
      (user.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <main className="roles-page">
      <section className="roles-card">
        <header className="roles-header">
          <h1 className="roles-title">Roles Permissions</h1>
          <div className="roles-search">
            <input
              type="text"
              className="roles-search-input"
              placeholder="..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </header>

        <div className="roles-table">
          <div className="roles-table-header">
            <div className="roles-col-user">User</div>
            <div className="roles-col-address">Address book role</div>
            <div className="roles-col-admin">Admin</div>
          </div>
          {roleError && <div className="roles-error">{roleError}</div>}
          <div className="roles-table-body">
            {isLoading && <div>Loading...</div>}
            {error && !isLoading && <div>Failed to load users</div>}
            {!isLoading && !error && visibleUsers.length === 0 && (
              <div>No users found</div>
            )}
            {!isLoading &&
              !error &&
              visibleUsers.map((user) => {
                const isSelf = currentUserId === user.id;

                const employeeBtnClass =
                  "roles-role-btn" +
                  (user.role === "employee" ? " roles-role-btn--active" : "") +
                  (isSelf ? " roles-role-btn--muted" : "");

                const hrBtnClass =
                  "roles-role-btn" +
                  (user.role === "hr" ? " roles-role-btn--active" : "") +
                  (isSelf ? " roles-role-btn--muted" : "");

                const adminBtnClass =
                  "roles-role-btn" +
                  (user.role === "admin" ? " roles-role-btn--active" : "") +
                  (isSelf ? " roles-role-btn--muted" : "");

                return (
                  <div
                    key={user.id}
                    className={"roles-row" + (isSelf ? " roles-row--self" : "")}
                  >
                    <div className="roles-cell roles-user-cell">
                      <div className="roles-user-avatar">
                        <img
                          src="./assets/usericon.png"
                          className="settings-img"
                          alt="avatar"
                        />
                      </div>
                      <div className="roles-user-info">
                        <div className="roles-user-name">{user.name || ""}</div>
                        <div className="roles-user-email">
                          {user.email || ""}
                        </div>
                      </div>
                    </div>

                    <div className="roles-cell roles-address-cell">
                      <div className="roles-role-group">
                        <button
                          type="button"
                          className={employeeBtnClass}
                          disabled={isSelf || savingUserId === user.id}
                          onClick={() => handleChangeRole(user.id, "employee")}
                        >
                          EMPLOYEE
                        </button>
                        <button
                          type="button"
                          className={hrBtnClass}
                          disabled={isSelf || savingUserId === user.id}
                          onClick={() => handleChangeRole(user.id, "hr")}
                        >
                          HR
                        </button>
                      </div>
                    </div>

                    <div className="roles-cell roles-admin-cell">
                      <button
                        type="button"
                        className={adminBtnClass}
                        disabled={isSelf || savingUserId === user.id}
                        onClick={() => handleChangeRole(user.id, "admin")}
                      >
                        ADMIN
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </main>
  );
}
