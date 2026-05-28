"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        if (!e.target.closest(`.${styles.navbar}`)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Mostafa <span>Mohy</span>
        </Link>

        {/* Desktop Links */}
        <div className={styles.links}>
          <Link href="/">الرئيسية</Link>
          <Link href="/posts">المحتوى</Link>
          <Link href="/gallery">المعرض</Link>
          <Link href="/ads">الإعلانات</Link>
          <Link href="/#contact">راسلني</Link>
        </div>

        <div className={styles.actions}>
          <ThemeToggle />
          <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" onClick={toggleMenu}>الرئيسية</Link>
          <Link href="/posts" onClick={toggleMenu}>المحتوى</Link>
          <Link href="/gallery" onClick={toggleMenu}>المعرض</Link>
          <Link href="/ads" onClick={toggleMenu}>الإعلانات</Link>
          <Link href="/#contact" onClick={toggleMenu}>راسلني</Link>
        </div>
      )}
    </nav>
  );
}
