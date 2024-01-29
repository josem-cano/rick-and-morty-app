import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context.tsx";
import { Button } from "../button/button.tsx";
import styles from "./navbar.module.css";

export function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>Rick and Morty App</h1>
      <div className={styles.navItems}>
        <Link to="/characters">Characters</Link>
      </div>
      <div className={styles.rightBar}>
        <div>Hi, {user?.name}</div>
        <Button
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
