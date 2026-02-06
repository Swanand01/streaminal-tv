import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';
import { Calendar, MapPin, User } from 'lucide-react';
import type { PersonDetails } from '@/lib/tmdb';

interface PersonHeaderProps {
  person: PersonDetails;
}

export function PersonHeader({ person }: PersonHeaderProps) {
  const age = person.birthday
    ? new Date().getFullYear() - new Date(person.birthday).getFullYear()
    : null;

  return (
    <div className="mb-12 flex flex-col gap-8 md:flex-row">
      {/* Profile Image */}
      <div className="shrink-0">
        <div className="bg-muted relative h-80 w-64 overflow-hidden rounded-lg md:h-96 md:w-72">
          {person.profile_path ? (
            <Image
              src={getImageUrl(person.profile_path, 'w500')}
              alt={person.name}
              fill
              sizes="(max-width: 768px) 256px, 288px"
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              <User className="h-24 w-24" />
            </div>
          )}
        </div>
      </div>

      {/* Person Info */}
      <div className="flex-1">
        <h1 className="mb-4 text-4xl font-bold text-balance md:text-5xl">{person.name}</h1>

        <div className="text-muted-foreground mb-6 flex flex-wrap gap-4 text-sm">
          {person.known_for_department && (
            <div className="flex items-center gap-1">
              <span className="text-foreground font-medium">{person.known_for_department}</span>
            </div>
          )}
          {person.birthday && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(person.birthday).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {age && ` (${age} years old)`}
              </span>
            </div>
          )}
          {person.place_of_birth && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{person.place_of_birth}</span>
            </div>
          )}
        </div>

        {person.biography && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Biography</h2>
            <p className="text-foreground/90 max-w-4xl leading-relaxed text-pretty">
              {person.biography}
            </p>
          </div>
        )}

        {person.also_known_as && person.also_known_as.length > 0 && (
          <div className="mt-6">
            <h3 className="text-muted-foreground mb-2 text-sm font-semibold">Also Known As</h3>
            <div className="flex flex-wrap gap-2">
              {person.also_known_as.slice(0, 5).map((name, index) => (
                <span key={index} className="bg-muted rounded-full px-3 py-1 text-xs font-medium">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
