export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2024 Prognos. Todos os direitos reservados.
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:underline"
          >
            Termos
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:underline"
          >
            Privacidade
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:underline"
          >
            Contato
          </a>
        </div>
      </div>
    </footer>
  );
} 