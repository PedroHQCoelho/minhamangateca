import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import { Dashboard } from "./pages/Dashboard";
import { MyCollection } from "./pages/MyCollection";
import { MangaDetails } from "./pages/MangaDetails";
import { Wishlist } from "./pages/Wishlist";
import { Settings } from "./pages/Settings";

import { ThemeProvider } from "./context/ThemeContext";
import { MangaProvider } from "./context/MangaContext";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function toggleMobileMenu() {
    setMobileMenuOpen((current) => !current);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <ThemeProvider>
      <MangaProvider>
        <BrowserRouter>
          <div className="flex min-h-screen bg-background
            text-foreground transition-colors duration-200">

            <Sidebar
              mobileOpen={mobileMenuOpen}
              onClose={closeMobileMenu}
            />

            <div className="flex min-w-0 flex-1 flex-col">

              <Header
                onMenuToggle={toggleMobileMenu}
                mobileMenuOpen={mobileMenuOpen}
              />

              <Routes>
                <Route path="/" element={<Dashboard />} />

                <Route path="/colecao" element={<MyCollection />} />

                <Route
                  path="/colecao/:id"
                  element={<MangaDetails />}
                />

                <Route 
                path="/desejos" 
                element={<Wishlist />} 
                />

                <Route
                  path="/configuracoes"
                  element={<Settings />}
                />

                <Route
                  path="*"
                  element={<Navigate to="/" replace />}
                />
              </Routes>

              <Footer />

            </div>
          </div>
        </BrowserRouter>
      </MangaProvider>
    </ThemeProvider>
  );
}

function PlaceholderPage({ title }) {
  return (
    <main className="flex-1 px-6 py-8 lg:px-10">
      <h1 className="text-2xl font-bold">{title}</h1>

      <p className="mt-2 text-sm text-muted">
        Esta seção estará disponível em breve.
      </p>
    </main>
  );
}

export default App;
