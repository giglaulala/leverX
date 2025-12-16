const express = require("express");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");

const users = require("./users.json");
const employees = require("./data/data.json");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.post("/sign-in", async (request, res) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return res.status(400).json({ message: "password adn mail required" });
  }
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ message: "invalid user" });
  }
  const passsword = await bcrypt.compare(password, user.hashedPassword);
  if (!passsword) {
    return res.status(401).json({ message: "invalid user" });
  }

  res.json({
    message: "success",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

app.get("/users", (request, res) => {
  const safeUsers = users.map(({ hashedPassword, ...rest }) => rest);
  res.json(safeUsers);
});
app.get("/users/:id", (request, res) => {
  const user = users.find((u) => u.id === request.params.id);

  const { hashedPassword, ...safeUser } = user;
  res.json(safeUser);
});

app.patch("/users/:id", (request, res) => {
  const userId = request.params.id;
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const { role } = request.body || {};

  if (!role || !["admin", "hr", "employee"].includes(role)) {
    return res.status(400).json({ message: "invalid role" });
  }

  user.role = role;

  const { hashedPassword, ...safeUser } = user;
  res.json(safeUser);
});

app.get("/employees", (req, res) => {
  res.json(employees);
});

app.get("/employees/:id", (request, res) => {
  const empId = request.params.id;
  const employee = employees.find((e) => e._id === empId);

  if (!employee) {
    return res.status(404).json({ message: "user not found" });
  }

  res.json(employee);
});

app.patch("/employees/:id", (request, res) => {
  const empId = request.params.id;
  const employee = employees.find((e) => e._id === empId);

  if (!employee) {
    return res.status(404).json({ message: "usre not found" });
  }

  const allowedFields = [
    "first_name",
    "last_name",
    "first_native_name",
    "last_native_name",
    "middle_native_name",
    "department",
    "building",
    "room",
    "desk_number",
    "phone",
    "email",
    "skype",
    "cnumber",
    "citizenship",
  ];

  const body = request.body || {};

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      employee[field] = body[field];
    }
  });

  res.json(employee);
});

app.listen(3000);
