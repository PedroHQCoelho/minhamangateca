import { useState } from "react";
import { Search, Moon, Sun, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "../context/ThemeContext";

// Barra do topo enxuta: o título de cada tela agora fica na própria tela,
// então não há mais o mesmo título repetido duas vezes.
export function Header({ onMenuToggle, mobileMenuOpen }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  // A busca leva para Minha Coleção já filtrada (?q=termo)
  function handleSearch(event) {
    event.preventDefault();

    const query = term.trim();

    navigate(
      query ? `/colecao?q=${encodeURIComponent(query)}` : "/colecao"
    );
  }

  return (
    <header className="flex items-center gap-3 border-b
      border-border bg-background px-6 py-3
      transition-colors duration-200 lg:px-10">

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
          border-border bg-card p-2.5
          text-foreground transition
          hover:border-primary hover:text-primary
          lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Pesquisa */}

      <form
        role="search"
        onSubmit={handleSearch}
        className="flex min-w-0 flex-1 items-center gap-2
          rounded-lg border border-border bg-card px-3 py-2
          focus-within:border-primary sm:max-w-md"
      >
        <Search size={18} className="shrink-0 text-muted" />

        <input
          type="text"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          aria-label="Buscar mangá na coleção"
          placeholder="Buscar mangá..."
          enterKeyHint="search"
          className="w-full min-w-0 bg-transparent
            text-sm text-foreground outline-none
            placeholder:text-muted"
        />
      </form>

      {/* Tema */}

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
        className="ml-auto shrink-0 rounded-lg border
          border-border bg-card p-2.5
          text-foreground transition
          hover:border-primary hover:text-primary"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

    </header>
  );
}
