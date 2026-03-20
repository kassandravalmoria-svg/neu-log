import React, { useState, useEffect } from "react";
import "./App.css";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

function App() {
  // --- States ---
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reason, setReason] = useState("");
  const [college, setCollege] = useState("");
  const [isEmployee, setIsEmployee] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [visits, setVisits] = useState([]);
  const [filters, setFilters] = useState({
    college: "",
    reason: "",
    type: "",
    start: "",
    end: ""
  });

  // ✅ AUTHORIZED ADMIN EMAILS
  const adminEmails = [
    "jcesperanza@neu.edu.ph",
    "kassandra.valmoria@neu.edu.ph"
  ];

  // Date Normalizer
  const normalizeDate = (d) => {
    if (!d) return new Date();
    return d.toDate ? d.toDate() : new Date(d);
  };

  // ================= AUTHENTICATION =================

  const loginWithGoogle = async (asAdmin = false) => {
    try {
      const res = await signInWithPopup(auth, provider);
      const userEmail = res.user.email;

      if (asAdmin) {
        // Admin Check
        if (!adminEmails.includes(userEmail)) {
          alert("Access Denied: You are not an authorized administrator.");
          signOut(auth);
          return;
        }
        setIsAdmin(true);
      } else {
        // Regular User Check (@neu.edu.ph only)
        if (!userEmail.endsWith("@neu.edu.ph")) {
          alert("Please use your @neu.edu.ph institutional email.");
          signOut(auth);
          return;
        }
        setIsAdmin(false);
      }
      setUser(res.user);
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again.");
    }
  };

  const onLogout = () => {
    signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  // ================= DATA (REAL-TIME) =================

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, "visits"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setVisits(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: normalizeDate(doc.data().date)
      })));
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const onFormSubmit = async () => {
    if (!reason || !college) return alert("Please fill out all fields!");

    try {
      await addDoc(collection(db, "visits"), {
        user_email: user.email,
        reason,
        college,
        isEmployee,
        date: new Date()
      });

      setSuccessMsg("✅ Welcome to NEU Library!");
      setReason("");
      setCollege("");
      setIsEmployee(false);
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      alert("Error submitting form.");
    }
  };

  // ================= FILTER LOGIC =================

  const filteredVisits = visits.filter((v) => {
    const d = normalizeDate(v.date);
    const start = filters.start ? new Date(filters.start) : null;
    const end = filters.end ? new Date(filters.end) : null;
    if (end) end.setHours(23, 59, 59);

    return (
      (!start || d >= start) &&
      (!end || d <= end) &&
      (filters.college === "" || v.college === filters.college) &&
      (filters.reason === "" || v.reason === filters.reason) &&
      (filters.type === "" || (filters.type === "yes" ? v.isEmployee : !v.isEmployee))
    );
  });

  // ================= UI RENDERING =================

  // 1. LOGIN PAGE
  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h1 className="title">NEU Library Log</h1>
          <p className="subtitle">Sign in with your Google account</p>
          
          <div className="button-stack">
            <button className="google-btn student" onClick={() => loginWithGoogle(false)}>
              Student / Employee Login
            </button>

            <div className="divider"><span>Administrator</span></div>

            <button className="google-btn admin" onClick={() => loginWithGoogle(true)}>
              Google Admin Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOGGED IN UI (DASHBOARD OR FORM)
  return (
    <div className="container">
      <div className="header-card card">
        <h1>{isAdmin ? "Admin Dashboard" : "Library Check-in"}</h1>
        <div className="user-info">
          <span>{user.email}</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {isAdmin ? (
        <>
          <div className="card filters">
            <h3>Analytics Filters</h3>
            <div className="filter-grid">
              <input type="date" onChange={(e) => setFilters({...filters, start: e.target.value})} />
              <input type="date" onChange={(e) => setFilters({...filters, end: e.target.value})} />
              <select onChange={(e) => setFilters({...filters, college: e.target.value})}>
                <option value="">All Colleges</option>
                <option value="CCS">CCS</option>
                <option value="CBA">CBA</option>
                <option value="CAS">CAS</option>
                <option value="COE">COE</option>
              </select>
              <select onChange={(e) => setFilters({...filters, reason: e.target.value})}>
                <option value="">All Reasons</option>
                <option value="Reading">Reading</option>
                <option value="Research">Research</option>
                <option value="Computer Use">Computer Use</option>
                <option value="Meeting">Meeting</option>
              </select>
              <select onChange={(e) => setFilters({...filters, type: e.target.value})}>
                <option value="">All Users</option>
                <option value="yes">Employee</option>
                <option value="no">Student</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Email</th><th>Reason</th><th>College</th><th>Type</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((v) => (
                  <tr key={v.id}>
                    <td>{v.user_email}</td>
                    <td>{v.reason}</td>
                    <td>{v.college}</td>
                    <td>{v.isEmployee ? "Faculty" : "Student"}</td>
                    <td>{v.date.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="card entry-form">
          <h3>Visitor Entry Form</h3>
          {successMsg && <div className="success-banner">{successMsg}</div>}

          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Select Reason</option>
            <option value="Reading">Reading</option>
            <option value="Research">Research</option>
            <option value="Computer Use">Computer Use</option>
            <option value="Meeting">Meeting</option>
          </select>

          <select value={college} onChange={(e) => setCollege(e.target.value)}>
            <option value="">Select College</option>
            <option value="CCS">CCS</option>
            <option value="CBA">CBA</option>
            <option value="CAS">CAS</option>
            <option value="COE">COE</option>
          </select>

          <label className="checkbox-container">
            <input type="checkbox" checked={isEmployee} onChange={(e) => setIsEmployee(e.target.checked)} />
            Check if Faculty/Employee
          </label>

          <button className="submit-btn" onClick={onFormSubmit}>Submit Visit</button>
        </div>
      )}
    </div>
  );
}

export default App;