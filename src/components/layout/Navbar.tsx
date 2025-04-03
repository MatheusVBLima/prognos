'use client';

import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Prognos</h2>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button size="sm">
            Começar Grátis
          </Button>
        </div>
      </div>
    </nav>
  );
} 