import Link from 'next/link';
import { getImageUrl, getTitle, type Person } from '@/lib/tmdb';
import { User } from 'lucide-react';

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  const name = person.name;
  const knownFor = person.known_for?.map((item) => getTitle(item)).slice(0, 2).join(', ');

  return (
    <Link
      href={`/person/${person.id}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {person.profile_path ? (
          <img
            src={getImageUrl(person.profile_path)}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <User className="h-16 w-16" />
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 font-semibold leading-tight group-hover:text-primary">
          {name}
        </h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {person.known_for_department}
        </p>
        {knownFor && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            Known for: {knownFor}
          </p>
        )}
      </div>
    </Link>
  );
}
