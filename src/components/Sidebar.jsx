
import {
  LayoutDashboard,
  Library,
  Heart,
  Settings,
  BookOpen,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Minha Coleção",
    icon: Library,
    href: "/colecao",
  },
  {
    label: "Lista de Desejos",
    icon: Heart,
    href: "/desejos",
  },
  {
    label: "Configurações",
    icon: Settings,
    href: "/configuracoes",
  },
];

export function Sidebar({ mobileOpen = false, onClose }) {

  function renderNavigation() {
    return (
      <nav className="flex flex-col gap-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.href === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg
                px-4 py-3 transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.label}
              </span>
            </NavLink>
          );
        })}

      </nav>
    );
  }

  function renderLogo() {
    return (
      <div className="flex items-center gap-3">

        <div className="flex h-12 w-12 items-center
          justify-center rounded-xl bg-primary text-white">
          <BookOpen size={27} />
        </div>

        <div>
          <h1 className="text-lg font-bold leading-tight">
            Minha
          </h1>

          <h1 className="text-lg font-bold leading-tight">
            Mangateca
          </h1>
        </div>

      </div>
    );
  }

  return (
    <>
      {/* Sidebar desktop */}

      <aside className="hidden w-64 min-h-screen
        flex-col border-r border-border
        bg-sidebar p-5 transition-colors duration-200
        lg:flex">

        <div className="mb-12">
          {renderLogo()}
        </div>

        {renderNavigation()}

        <div className="mt-auto border-t border-border pt-5">
          <p className="text-xs text-muted">
            Sua coleção, sua história.
          </p>
        </div>

      </aside>

      {/* Menu mobile */}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* Fundo escuro para fechar ao clicar fora */}

          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onClose}
            className="absolute inset-0 h-full w-full
              bg-black/60 backdrop-blur-sm"
          />

          {/* Painel lateral */}

          <aside
            id="mobile-navigation"
            className="absolute left-0 top-0
              flex h-full w-72 max-w-[85vw]
              flex-col border-r border-border
              bg-sidebar p-5 shadow-2xl
              animate-in slide-in-from-left
              duration-200"
          >

            <div className="mb-12 flex items-center
              justify-between gap-3">

              {renderLogo()}

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar menu"
                className="rounded-lg p-2
                  text-muted transition
                  hover:bg-secondary hover:text-foreground"
              >
                <X size={22} />
              </button>

            </div>

            {renderNavigation()}

            <div className="mt-auto border-t border-border pt-5">
              <p className="text-xs text-muted">
                Sua coleção, sua história.
              </p>
            </div>

          </aside>

        </div>
      )}

    </>
  );
}