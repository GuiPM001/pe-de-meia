import Link, { LinkProps } from "next/link";
import React from "react";

interface NavLinkProps extends LinkProps {
  pathname: string;
  label: string;
}

export default function NavLink(props: NavLinkProps) {
  return (
    <Link
      href={props.href}
      className={`${
        props.pathname === props.href
          ? "text-green-text font-semibold"
          : "text-black"
      }`}
    >
      {props.label}
    </Link>
  );
}
