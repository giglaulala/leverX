import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetEmployeesQuery } from "../store/api";
import type { TUser } from "../types";

type TLayoutMode = "grid" | "list";

export default function AddressBookPage() {
  const { data: users = [], isLoading, error } = useGetEmployeesQuery();
  const [filteredUsers, setFilteredUsers] = useState<TUser[]>([]);

  const [layout, setLayout] = useState<TLayoutMode>("grid");

  const [searchMode, setSearchMode] = useState<"basic" | "advanced">("basic");

  const [basicQuery, setBasicQuery] = useState("");

  const [advName, setAdvName] = useState("");
  const [advEmail, setAdvEmail] = useState("");

  const [advPhone, setAdvPhone] = useState("");

  const [advSkype, setAdvSkype] = useState("");

  const [advBuilding, setAdvBuilding] = useState("");
  const [advRoom, setAdvRoom] = useState("");

  const [advDepartment, setAdvDepartment] = useState("");

  const navigate = useNavigate();

  function getFullName(user: TUser) {
    const first = user.first_name || "";
    const last = user.last_name || "";
    return `${first} ${last}`.trim();
  }

  function filterUsersByBasicQuery(rawQuery: string) {
    const query = rawQuery.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const id = (user._id || "").toLowerCase();

      const first = (user.first_name || "").toLowerCase();

      const last = (user.last_name || "").toLowerCase();

      const full = `${first} ${last}`.trim();

      return (
        id.includes(query) ||
        first.includes(query) ||
        last.includes(query) ||
        full.includes(query)
      );
    });
  }

  function handleBasicSearch(event: React.FormEvent) {
    event.preventDefault();
    const filtered = filterUsersByBasicQuery(basicQuery);
    setFilteredUsers(filtered);
  }

  function filterUsersByAdvancedQuery() {
    const nameQuery = advName.trim().toLowerCase();

    const emailQuery = advEmail.trim().toLowerCase();

    const phoneQuery = advPhone.trim().toLowerCase();

    const skypeQuery = advSkype.trim().toLowerCase();
    const buildingQuery = advBuilding.trim().toLowerCase();
    const roomQuery = advRoom.trim().toLowerCase();

    const deptQuery = advDepartment.trim().toLowerCase();

    const filtered = users.filter((user) => {
      const fullName = getFullName(user).toLowerCase();
      const email = (user.email || "").toLowerCase();

      const phone = (user.phone || "").toLowerCase();
      const skype = (user.skype || "").toLowerCase();

      const building = (user.building || "").toLowerCase();
      const room = (user.room || "").toLowerCase();
      const department = (user.department || "").toLowerCase();

      if (nameQuery && !fullName.includes(nameQuery)) return false;
      if (emailQuery && !email.includes(emailQuery)) return false;

      if (phoneQuery && !phone.includes(phoneQuery)) return false;
      if (skypeQuery && !skype.includes(skypeQuery)) return false;

      if (buildingQuery && !building.includes(buildingQuery)) return false;
      if (roomQuery && !room.includes(roomQuery)) return false;
      if (deptQuery && !department.includes(deptQuery)) return false;

      return true;
    });

    return filtered;
  }

  function handleAdvancedSearch(event: React.FormEvent) {
    event.preventDefault();
    setFilteredUsers(filterUsersByAdvancedQuery());
  }

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    if (searchMode === "basic") {
      setFilteredUsers(filterUsersByBasicQuery(basicQuery));
      return;
    }

    setFilteredUsers(filterUsersByAdvancedQuery());
  }, [
    searchMode,
    basicQuery,
    advName,
    advEmail,
    advPhone,
    advSkype,
    advBuilding,
    advRoom,
    advDepartment,
    users,
  ]);

  const employeesSectionClass =
    "employees-section " +
    (layout === "grid" ? "employees-section--grid" : "employees-section--list");

  return (
    <main>
      <input
        type="radio"
        name="employees-view"
        id="view-grid"
        className="view-toggle-input"
        checked={layout === "grid"}
        onChange={() => setLayout("grid")}
      />
      <input
        type="radio"
        name="employees-view"
        id="view-list"
        className="view-toggle-input"
        checked={layout === "list"}
        onChange={() => setLayout("list")}
      />
      <section className="search-section">
        <input
          type="radio"
          name="search-mode"
          id="search-basic"
          className="search-toggle-input"
          checked={searchMode === "basic"}
          onChange={() => setSearchMode("basic")}
        />
        <input
          type="radio"
          name="search-mode"
          id="search-advanced"
          className="search-toggle-input"
          checked={searchMode === "advanced"}
          onChange={() => setSearchMode("advanced")}
        />

        <div className="search-tabs">
          <label
            className="search-tab search-tab--basic"
            htmlFor="search-basic"
          >
            BASIC SEARCH
          </label>
          <label
            className="search-tab search-tab--advanced"
            htmlFor="search-advanced"
          >
            ADVANCED SEARCH
          </label>
        </div>

        <div className="search-card search-card--basic">
          <form onSubmit={handleBasicSearch}>
            <div className="search-input-wrapper">
              <img
                className="search-icon"
                src="./assets/search-svgrepo-com.svg"
                alt="Search icon"
              />
              <input
                type="text"
                className="search-input"
                placeholder="John Smith"
                aria-label="Search employee by name"
                value={basicQuery}
                onChange={(event) => setBasicQuery(event.target.value)}
              />
            </div>
            <button className="search-submit search-link" type="submit">
              SEARCH
            </button>
          </form>
        </div>

        <div className="search-card search-card--advanced">
          <form
            className="advanced-search-form"
            onSubmit={handleAdvancedSearch}
          >
            <div className="advanced-field-group">
              <label className="advanced-label" htmlFor="adv-name">
                Name
              </label>
              <div className="search-input-wrapper">
                <input
                  id="adv-name"
                  type="text"
                  className="search-input"
                  placeholder="John Smith"
                  aria-label="Search by name"
                  value={advName}
                  onChange={(event) => setAdvName(event.target.value)}
                />
              </div>
            </div>

            <div className="advanced-field-group">
              <label className="advanced-label" htmlFor="adv-email">
                Email
              </label>
              <div className="search-input-wrapper">
                <input
                  id="adv-email"
                  type="email"
                  className="search-input"
                  placeholder="john.smith@leverx.com"
                  aria-label="Search by email"
                  value={advEmail}
                  onChange={(event) => setAdvEmail(event.target.value)}
                />
              </div>
            </div>

            <div className="advanced-row">
              <div className="advanced-field-group">
                <label className="advanced-label" htmlFor="adv-phone">
                  Phone
                </label>
                <div className="search-input-wrapper">
                  <input
                    id="adv-phone"
                    type="tel"
                    className="search-input"
                    placeholder="Phone number"
                    aria-label="Search by phone"
                    value={advPhone}
                    onChange={(event) => setAdvPhone(event.target.value)}
                  />
                </div>
              </div>

              <div className="advanced-field-group">
                <label className="advanced-label" htmlFor="adv-skype">
                  Telegram
                </label>
                <div className="search-input-wrapper">
                  <input
                    id="adv-skype"
                    type="text"
                    className="search-input"
                    placeholder="SkypeID"
                    aria-label="Search by Skype ID"
                    value={advSkype}
                    onChange={(event) => setAdvSkype(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="advanced-row">
              <div className="advanced-field-group">
                <label className="advanced-label" htmlFor="adv-building">
                  Building
                </label>
                <div className="search-input-wrapper">
                  <select
                    id="adv-building"
                    className="search-input advanced-select"
                    aria-label="Filter by building"
                    value={advBuilding}
                    onChange={(event) => setAdvBuilding(event.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="LPT (Main Office)">LPT (Main Office)</option>
                    <option value="LPT (Secondary Office)">
                      LPT (Secondary Office)
                    </option>
                  </select>
                </div>
              </div>

              <div className="advanced-field-group">
                <label className="advanced-label" htmlFor="adv-room">
                  Room
                </label>
                <div className="search-input-wrapper">
                  <input
                    id="adv-room"
                    type="text"
                    className="search-input"
                    placeholder="303.1"
                    aria-label="Search by room"
                    value={advRoom}
                    onChange={(event) => setAdvRoom(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="advanced-field-group">
              <label className="advanced-label" htmlFor="adv-department">
                Department
              </label>
              <div className="search-input-wrapper">
                <select
                  id="adv-department"
                  className="search-input advanced-select"
                  aria-label="Filter by department"
                  value={advDepartment}
                  onChange={(event) => setAdvDepartment(event.target.value)}
                >
                  <option value="">Any</option>
                  <option value="Web & Mobile">Web &amp; Mobile</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>
            </div>

            <button
              className="search-submit advanced-submit search-link"
              type="submit"
            >
              SEARCH
            </button>
          </form>
        </div>
      </section>
      <section className={employeesSectionClass}>
        <div className="employees-header">
          <div className="employees-count">
            {filteredUsers.length} employees displayed
          </div>
          <div className="employees-view-toggle">
            <label
              htmlFor="view-grid"
              className="employees-view-btn employees-view-btn--grid"
              aria-label="Grid view"
            >
              <img
                src="./assets/grid-svgrepo-com.svg"
                alt=""
                className="employees-view-icon"
              />
            </label>
            <label
              htmlFor="view-list"
              className="employees-view-btn employees-view-btn--list"
              aria-label="List view"
            >
              <img
                src="./assets/list-svgrepo-com.svg"
                alt=""
                className="employees-view-icon"
              />
            </label>
          </div>
        </div>
        <div className="employee-list-header">
          <div className="employee-list-header-cell">Photo</div>
          <div className="employee-list-header-cell">Name</div>
          <div className="employee-list-header-cell">Department</div>
          <div className="employee-list-header-cell">Room</div>
        </div>
        <div className="employee-list">
          {isLoading && <div>Loading...</div>}
          {error && !isLoading && <div>Failed to load employees</div>}
          {!isLoading && !error && filteredUsers.length === 0 && (
            <div className="not-found-card">
              <div className="not-found-illustration">
                <div className="not-found-avatar">
                  <img
                    src="./assets/usericon.png"
                    alt="No results"
                    className="not-found-avatar-img"
                  />
                </div>
              </div>
              <div className="not-found-text-title">Nothing found</div>
              <div className="not-found-text-subtitle">
                No result match your search. Consider
                <br />
                trying a different search request
              </div>
            </div>
          )}
          {!isLoading &&
            !error &&
            filteredUsers.map((user) => (
              <article
                key={user._id}
                className="employee-card"
                onClick={() => navigate(`/employees/${user._id}`)}
              >
                <img
                  className="employee-photo"
                  src={user.user_avatar || "./assets/usericon.png"}
                  alt={`Portrait of ${getFullName(user) || "Employee"}`}
                />
                <h2 className="employee-name">
                  {getFullName(user) || "Unknown"}
                </h2>
                <hr className="employee-divider" />
                <div className="employee-meta">
                  <div className="employee-meta-item">
                    <img
                      className="employee-meta-icon"
                      src="./assets/briefcase-svgrepo-com.svg"
                      alt="Department icon"
                    />
                    <span className="employee-dept">
                      {user.department || ""}
                    </span>
                  </div>
                  <div className="employee-meta-item">
                    <img
                      className="employee-meta-icon"
                      src="./assets/door-closed-svgrepo-com.svg"
                      alt="Room icon"
                    />
                    <span className="employee-room">{user.room || ""}</span>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </section>
    </main>
  );
}
