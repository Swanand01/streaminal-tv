'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

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
    <nav className="fixed top-0 z-50 w-full bg-gradient-to-b from-background to-background/0 transition-colors duration-300">
      <div className="mx-auto flex max-w-[1920px] items-center justify-between px-4 py-4 md:px-8 lg:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
            STREAMINAL
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
              Home
            </Link>
            <Link href="/movies" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
              Movies
            </Link>
            <Link href="/tv" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
              TV Shows
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px] md:w-[400px]"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="flex-shrink-0 text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Menu"
                  >
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
                      className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link 
                      href="/movies" 
                      className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Movies
                    </Link>
                    <Link 
                      href="/tv" 
                      className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      TV Shows
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
