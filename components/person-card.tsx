import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, type Person } from '@/lib/tmdb';
import { generateSlug } from '@/lib/utils';
import { User } from 'lucide-react';

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  const name = person.name;

  return (
    <Link
      href={`/person/${generateSlug(person.name, person.id)}`}
      className="group border-border hover:border-primary/50 hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-2 transition-all"
    >
      <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
        {person.profile_path ? (
          <Image
            src={getImageUrl(person.profile_path, 'w500')}
            alt={name}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <User className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="group-hover:text-primary truncate text-sm font-semibold">{name}</p>
        <p className="text-muted-foreground truncate text-xs">{person.known_for_department}</p>
      </div>
    </Link>
  );
}
