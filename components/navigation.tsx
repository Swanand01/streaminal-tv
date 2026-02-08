'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function Navigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <nav className="from-background to-background/0 fixed top-0 z-50 w-full bg-linear-to-b transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-8 lg:px-12">
        <div className={`flex items-center gap-8 ${showSearch ? 'hidden md:flex' : ''}`}>
          <Link href="/" className="text-primary text-2xl font-bold tracking-tight">
            STREAMINAL TV
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/movies"
              className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors"
            >
              Movies
            </Link>
            <Link
              href="/tv-shows"
              className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors"
            >
              TV Shows
            </Link>
          </div>
        </div>

        {showSearch ? (
          <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 md:flex-none">
            <Input
              type="text"
              placeholder="Search movies, TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-75"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="text-muted-foreground hover:text-foreground shrink-0 text-sm"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSearch(true)}
              className="text-foreground/80 hover:text-foreground flex items-center gap-2 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  <Link
                    href="/"
                    className="text-foreground/80 hover:text-foreground text-lg font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/movies"
                    className="text-foreground/80 hover:text-foreground text-lg font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Movies
                  </Link>
                  <Link
                    href="/tv-shows"
                    className="text-foreground/80 hover:text-foreground text-lg font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    TV Shows
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </nav>
  );
}
