import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to access the Pokédex",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
