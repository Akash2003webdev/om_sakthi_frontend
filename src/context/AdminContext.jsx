import React from "react";
import { createContext, useContext, useState } from "react";
import { adminLogin, adminLogout } from "../api";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(
    () => !!sessionStorage.getItem("osp-token"),
  );

  const login = async (password) => {
    try {
      await adminLogin(password);
      sessionStorage.setItem("osp-admin", "true");
      setIsAdmin(true);
      return true;
    } catch (err) {
      console.error("Login failed:", err.message);
      return false;
    }
  };

  const logout = () => {
    adminLogout();
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
