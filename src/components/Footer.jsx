
import { Globe, Heart } from "lucide-react";
import {
  SiGithub,
  SiInstagram,
  SiX,
  SiItchdotio,
  SiFacebook,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

import { LogoMark } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-sidebar px-6 py-7 transition-colors duration-200 lg:px-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Project identity */}
        <div className="flex items-center gap-3">
          <LogoMark size={44} />

          <div>
            <h3 className="display text-xl text-foreground">
              Minha Mangateca
            </h3>

            <p className="text-xs text-muted">
              Sua coleção, sua história.
            </p>
          </div>
        </div>

        {/* Developer links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Onde me encontrar
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://pedrohqcoelho.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              title="Portfólio"
              aria-label="Portfólio"
              className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-primary"
            >
              <Globe size={18} />
            </a>

            <a
              href="https://github.com/PedroHQCoelho"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              aria-label="GitHub"
              className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-primary"
            >
              <SiGithub size={18} />
            </a>

            <a
              href="https://www.linkedin.com/in/pedrohqcoelho/"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              aria-label="LinkedIn"
              className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-primary"
            >
              <FaLinkedin size={18} />
            </a>

            <a
              href="https://www.instagram.com/pedro.hq.coelho"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              aria-label="Instagram"
              className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-primary"
            >
              <SiInstagram size={18} />
            </a>

            <a
              href="https://x.com/pedrohqcoelho"
              target="_blank"
              rel="noopener noreferrer"
              title="X"
              aria-label="X"
              className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-primary"
            >
              <SiX size={18} />
            </a>

            <a
              href="https://pedrocoelho.itch.io"
              target="_blank"
              rel="noopener noreferrer"
              title="itch.io"
              aria-label="itch.io"
              className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-primary"
            >
              <SiItchdotio size={18} />
            </a>

            <a
              href="https://www.facebook.com/pedrohqcoelho"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              aria-label="Facebook"
              className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-primary"
            >
              <SiFacebook size={18} />
            </a>

          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-7 flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Pedro Coelho.
          Todos os direitos reservados.
        </p>

        <p className="flex items-center gap-1">
          Feito com
          <Heart size={13} className="fill-primary text-primary" />
          e muito amor por mangás.
        </p>
      </div>
    </footer>
  );
}