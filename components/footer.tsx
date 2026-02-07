import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-border/40 border-t py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 text-sm sm:flex-row md:px-8 lg:px-12">
        <p className="text-muted-foreground flex items-center gap-2">
          <span>
            Built with ❤️ by{' '}
            <a
              href="https://github.com/Swanand01"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-4"
            >
              Swanand
            </a>
          </span>
          <span>·</span>
          <a
            href="https://github.com/Swanand01/streaminal-tv"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
        </p>
        <p className="text-muted-foreground text-xs">
          We do not host any media files.
        </p>
      </div>
    </footer>
  );
}
