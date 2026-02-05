import Link from 'next/link';
import { getImageUrl, type Person } from '@/lib/tmdb';
import { User } from 'lucide-react';

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  const name = person.name;

  return (
    <Link
      href={`/person/${person.id}`}
      className="group flex items-center gap-3 rounded-lg border border-border p-2 transition-all hover:border-primary/50 hover:bg-muted/50"
    >
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted">
        {person.profile_path ? (
          <img
            src={getImageUrl(person.profile_path, 'w500')}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <User className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold group-hover:text-primary">
          {name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {person.known_for_department}
        </p>
      </div>
    </Link>
  );
}
