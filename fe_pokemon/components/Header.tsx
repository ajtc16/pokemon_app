"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { logout, user } = useAuth();

  return (
    <header
      className={cn(
        "sticky top-0 z-10 bg-pokemon-red px-4 py-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          {/* Pokeball Icon */}
          <svg
            className="h-6 w-6 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <line x1="2" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="15" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
          </svg>
          <h1 className="font-poppins text-headline text-white">Pokédex</h1>
        </div>

        {/* User info and Logout */}
        <div className="flex items-center gap-2">
          {user && (
            <span className="hidden sm:inline font-poppins text-body-3 text-white/80">
              {user.username}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-white hover:bg-white/20"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
