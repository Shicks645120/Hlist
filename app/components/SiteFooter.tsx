export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-cream/5 px-6 py-6 md:px-10">
      <p className="text-center text-xs leading-relaxed text-muted/70">
        Affiches et métadonnées fournies par{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-cream/20 underline-offset-2 transition-colors hover:text-cream hover:decoration-cream/50"
        >
          TMDB
        </a>
        . Ce site n&apos;est pas affilié à The Movie Database.
      </p>
    </footer>
  );
}
