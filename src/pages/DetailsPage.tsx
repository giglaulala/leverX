import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetEmployeeQuery, useUpdateEmployeeMutation } from "../store/api";
import type { TAuthUser, TDateBirth, TVisa, TUser } from "../types";
import InlineAlert from "../components/InlineAlert";

type TFormState = {
  fullName: string;
  nativeName: string;
  department: string;
  building: string;
  room: string;
  desk: string;
  phone: string;
  email: string;
  skype: string;
  cnumber: string;
  citizenship: string;
};

function getFullNameDetails(user: TUser) {
  const first = user.first_name || "";

  const last = user.last_name || "";

  return `${first} ${last}`.trim();
}

function getNativeName(user: TUser) {
  const first = user.first_native_name || "";

  const middle = user.middle_native_name || "";

  const last = user.last_native_name || "";
  return `${first} ${middle} ${last}`.trim();
}

function formatBirth(dateObj: TDateBirth) {
  if (!dateObj) return "";
  const { year, month, day } = dateObj;

  if (!year || !month || !day) return "";

  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatVisa(visaArr: TVisa[]) {
  if (!Array.isArray(visaArr) || visaArr.length === 0) {
    return { type: "", period: "" };
  }
  const v = visaArr[0];

  const start = new Date(v.start_date);

  const end = new Date(v.end_date);

  const period = `${start.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} - ${end.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;
  return { type: v.type || "", period };
}

function buildForm(user: TUser): TFormState {
  return {
    fullName: getFullNameDetails(user),
    nativeName: getNativeName(user),
    department: user.department || "",
    building: user.building || "",
    room: user.room || "",
    desk:
      user.desk_number != null && !Number.isNaN(user.desk_number)
        ? String(user.desk_number)
        : "",
    phone: user.phone || "",
    email: user.email || "",
    skype: user.skype || "",
    cnumber: user.cnumber || "",
    citizenship: user.citizenship || "",
  };
}

export default function DetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: employee,
    isLoading,
    error,
  } = useGetEmployeeQuery(id ?? "", {
    skip: !id,
  });

  const [updateEmployee, { isLoading: isSaving }] = useUpdateEmployeeMutation();

  const [form, setForm] = useState<TFormState | null>(null);

  const [canEdit, setCanEdit] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/404", { replace: true });
      return;
    }

    const raw = localStorage.getItem("currentUser");
    if (raw) {
      try {
        const user = JSON.parse(raw) as TAuthUser;
        if (user.role === "admin" || user.role === "hr") {
          setCanEdit(true);
        }
      } catch {}
    }
  }, [id, navigate]);
  useEffect(() => {
    if (employee && !form) {
      setForm(buildForm(employee));
    }
  }, [employee, form]);

  if (isLoading) {
    return (
      <main className="details-page">
        <div className="details-card">
          <div>Loading...</div>
        </div>
      </main>
    );
  }

  if (error || !employee || !form) {
    return (
      <main className="details-page">
        <div className="details-card">
          <div>{error || "Employee not found"}</div>
        </div>
      </main>
    );
  }

  const visaInfo = formatVisa(employee.visa);

  function handleFormChange<K extends keyof TFormState>(key: K, value: string) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function handleToggleEdit() {
    if (!canEdit) {
      return;
    }

    if (!employee || !form) {
      return;
    }

    if (!isEditMode) {
      setSaveError(null);
      setForm(buildForm(employee));
      setIsEditMode(true);
      return;
    }

    const updated: TUser = { ...employee };

    if (form.fullName.trim()) {
      const parts = form.fullName.trim().split(" ").filter(Boolean);

      updated.first_name = parts[0] || "";

      updated.last_name = parts.slice(1).join(" ") || "";
    }

    if (form.nativeName.trim()) {
      const parts = form.nativeName.trim().split(" ").filter(Boolean);
      updated.first_native_name = parts[0] || "";

      updated.last_native_name = parts.slice(1).join(" ") || "";
    }

    updated.department = form.department || updated.department;

    updated.building = form.building || updated.building;

    updated.room = form.room || updated.room;

    if (form.desk) {
      const num = Number(form.desk);
      if (!Number.isNaN(num)) {
        updated.desk_number = num;
      }
    }

    updated.phone = form.phone || updated.phone;

    updated.email = form.email || updated.email;

    updated.skype = form.skype || updated.skype;

    updated.cnumber = form.cnumber || updated.cnumber;

    updated.citizenship = form.citizenship || updated.citizenship;

    const payload: Partial<TUser> = {
      first_name: updated.first_name,
      last_name: updated.last_name,
      first_native_name: updated.first_native_name,
      last_native_name: updated.last_native_name,
      middle_native_name: updated.middle_native_name,
      department: updated.department,
      building: updated.building,
      room: updated.room,
      desk_number: updated.desk_number,
      phone: updated.phone,
      email: updated.email,
      skype: updated.skype,
      cnumber: updated.cnumber,
      citizenship: updated.citizenship,
    };

    updateEmployee({ id: updated._id, body: payload })
      .unwrap()
      .then((saved) => {
        setSaveError(null);
        setForm(buildForm(saved));
        setIsEditMode(false);
      })
      .catch((err: unknown) => {
        console.error("Save error:", err);
        setSaveError("Failed to save changes. Please try again.");
      });
  }

  const fullName = getFullNameDetails(employee) || "Unknown";
  const nativeName = getNativeName(employee);

  return (
    <main>
      <section className="details-page">
        <div className="details-left">
          <button className="details-back" onClick={() => navigate("/")}>
            ←
          </button>

          <div className="details-avatar-wrapper">
            <img
              className="details-avatar"
              src={employee.user_avatar || "./assets/usericon.png"}
              alt="Employee avatar"
            />
          </div>

          <h1 className="details-name">
            {isEditMode ? (
              <input
                className="details-input"
                type="text"
                value={form.fullName}
                onChange={(event) =>
                  handleFormChange("fullName", event.target.value)
                }
              />
            ) : (
              fullName
            )}
          </h1>
          <div className="details-native-name">
            {isEditMode ? (
              <input
                className="details-input"
                type="text"
                value={form.nativeName}
                onChange={(event) =>
                  handleFormChange("nativeName", event.target.value)
                }
              />
            ) : (
              nativeName
            )}
          </div>

          <button className="details-copy-link" type="button" disabled>
            Copy link
          </button>

          {canEdit && (
            <>
              {saveError && (
                <InlineAlert variant="error" onClose={() => setSaveError(null)}>
                  {saveError}
                </InlineAlert>
              )}
              <button
                className="details-edit-btn"
                type="button"
                onClick={handleToggleEdit}
                disabled={isSaving}
              >
                {isEditMode ? "SAVE" : "EDIT"}
              </button>
            </>
          )}
        </div>

        <div className="details-right">
          <div className="details-card">
            <div className="details-section">
              <h2 className="details-section-title">GENERAL INFO</h2>
              <div className="details-grid">
                <div className="details-row">
                  <span className="details-label">Department</span>
                  <span className="details-value">
                    {isEditMode ? (
                      <input
                        className="details-input"
                        type="text"
                        value={form.department}
                        onChange={(event) =>
                          handleFormChange("department", event.target.value)
                        }
                      />
                    ) : (
                      employee.department || ""
                    )}
                  </span>
                </div>
                <div className="details-row">
                  <span className="details-label">Building</span>
                  <span className="details-value">
                    {isEditMode ? (
                      <input
                        className="details-input"
                        type="text"
                        value={form.building}
                        onChange={(event) =>
                          handleFormChange("building", event.target.value)
                        }
                      />
                    ) : (
                      employee.building || ""
                    )}
                  </span>
                </div>
                <div className="details-row">
                  <span className="details-label">Room</span>
                  <span className="details-value">
                    {isEditMode ? (
                      <input
                        className="details-input"
                        type="text"
                        value={form.room}
                        onChange={(event) =>
                          handleFormChange("room", event.target.value)
                        }
                      />
                    ) : (
                      employee.room || ""
                    )}
                  </span>
                </div>
                <div className="details-row">
                  <span className="details-label">Desk number</span>
                  <span className="details-value">
                    {isEditMode ? (
                      <input
                        className="details-input"
                        type="text"
                        value={form.desk}
                        onChange={(event) =>
                          handleFormChange("desk", event.target.value)
                        }
                      />
                    ) : employee.desk_number != null ? (
                      String(employee.desk_number)
                    ) : (
                      ""
                    )}
                  </span>
                </div>
                <div className="details-row">
                  <span className="details-label">Date of birth</span>
                  <span className="details-value">
                    {formatBirth(employee.date_birth)}
                  </span>
                </div>
                <div className="details-row">
                  <span className="details-label">Manager</span>
                  <a href="#" className="details-value details-link">
                    {`${employee.manager?.first_name || ""} ${
                      employee.manager?.last_name || ""
                    }`.trim()}
                  </a>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h2 className="details-section-title">CONTACTS</h2>
              <div className="details-grid">
                <div className="details-row">
                  <span className="details-label">Mobile phone</span>
                  <a
                    className="details-value details-link"
                    href={employee.phone ? `tel:${employee.phone}` : "#"}
                  >
                    {isEditMode ? (
                      <input
                        className="details-input"
                        type="text"
                        value={form.phone}
                        onChange={(event) =>
                          handleFormChange("phone", event.target.value)
                        }
                      />
                    ) : (
                      employee.phone || ""
                    )}
                  </a>
                </div>
                <div className="details-row">
                  <span className="details-label">Email</span>
                  <a
                    className="details-value details-link"
                    href={employee.email ? `mailto:${employee.email}` : "#"}
                  >
                    {isEditMode ? (
                      <input
                        className="details-input"
                        type="text"
                        value={form.email}
                        onChange={(event) =>
                          handleFormChange("email", event.target.value)
                        }
                      />
                    ) : (
                      employee.email || ""
                    )}
                  </a>
                </div>
                <div className="details-row">
                  <span className="details-label">Skype</span>
                  <a className="details-value details-link" href="#">
                    {isEditMode ? (
                      <input
                        className="details-input"
                        type="text"
                        value={form.skype}
                        onChange={(event) =>
                          handleFormChange("skype", event.target.value)
                        }
                      />
                    ) : (
                      employee.skype || ""
                    )}
                  </a>
                </div>
                <div className="details-row">
                  <span className="details-label">C-Number</span>
                  <span className="details-value">
                    {isEditMode ? (
                      <input
                        className="details-input"
                        type="text"
                        value={form.cnumber}
                        onChange={(event) =>
                          handleFormChange("cnumber", event.target.value)
                        }
                      />
                    ) : (
                      employee.cnumber || ""
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h2 className="details-section-title">TRAVEL INFO</h2>
              <div className="details-grid">
                <div className="details-row">
                  <span className="details-label">Citizenship</span>
                  <span className="details-value">
                    {isEditMode ? (
                      <input
                        className="details-input"
                        type="text"
                        value={form.citizenship}
                        onChange={(event) =>
                          handleFormChange("citizenship", event.target.value)
                        }
                      />
                    ) : (
                      employee.citizenship || ""
                    )}
                  </span>
                </div>
                <div className="details-row">
                  <span className="details-label">Visa</span>
                  <span className="details-value">{visaInfo.type}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Visa validity period</span>
                  <span className="details-value">{visaInfo.period}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
