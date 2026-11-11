
import {
  Search,
  Moon,
  Sun,
  Menu,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";

export function Header({ onMenuToggle, mobileMenuOpen }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const pageTitles = {
    "/": {
      title: "Dashboard",
      subtitle: "Acompanhe sua coleção de mangás.",
    },

    "/colecao": {
      title: "Minha Coleção",
      subtitle: "Gerencie e organize seus mangás.",
    },

    "/desejos": {
      title: "Lista de Desejos",
      subtitle: "Acompanhe os mangás que deseja adquirir.",
    },

    "/configuracoes": {
      title: "Configurações",
      subtitle: "Personalize sua experiência.",
    },
  };

  const currentPage =
    pageTitles[location.pathname] ||
    (
      location.pathname.startsWith("/colecao/")
        ? {
            title: "Detalhes do mangá",
            subtitle: "Gerencie seus volumes.",
          }
        : pageTitles["/"]
    );

  return (
    <header className="flex flex-col gap-4 border-b
      border-border bg-background px-6 py-5
      sm:flex-row sm:items-center sm:justify-between
      lg:px-10 transition-colors duration-200">

      {/* Título e menu mobile */}

      <div className="flex items-center justify-between gap-3">

        <div>
          <h2 className="text-2xl font-bold">
            {currentPage.title}
          </h2>

          <p className="mt-1 text-sm text-muted">
            {currentPage.subtitle}
          </p>
        </div>

        {/* Botão do menu mobile */}

        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={
            mobileMenuOpen
              ? "Fechar menu de navegação"
              : "Abrir menu de navegação"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          className="shrink-0 rounded-lg border
            border-border bg-card p-3
            text-foreground transition
            hover:border-primary hover:text-primary
            lg:hidden"
        >
          <Menu size={22} />
        </button>

      </div>

      {/* Pesquisa e tema */}

      <div className="flex items-center gap-3">

        <div className="flex min-w-0 flex-1 items-center
          gap-2 rounded-lg border border-border
          bg-card px-3 py-2 sm:w-72 sm:flex-none">

          <Search size={19} className="shrink-0 text-muted" />

          <input
            type="text"
            placeholder="Buscar mangá..."
            className="w-full min-w-0 bg-transparent
              text-sm text-foreground outline-none
              placeholder:text-muted"
          />
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            theme === "dark"
              ? "Ativar tema claro"
              : "Ativar tema escuro"
          }
          title={
            theme === "dark"
              ? "Ativar tema claro"
              : "Ativar tema escuro"
          }
          className="shrink-0 rounded-lg border
            border-border bg-card p-3
            text-foreground transition
            hover:border-primary hover:text-primary"
        >
          {theme === "dark" ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

      </div>

    </header>
  );
}