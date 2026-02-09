import { getPersonDetails } from '@/lib/tmdb';
import { PersonHeader } from './person-header';
import { PersonFilmography } from './person-filmography';

interface PersonContentProps {
  personId: number;
}

export async function PersonContent({ personId }: PersonContentProps) {
  const person = await getPersonDetails(personId).catch(() => null);

  if (!person) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-muted-foreground">Person not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 md:px-8 lg:px-12">
      <PersonHeader person={person} />
      <PersonFilmography person={person} />
    </div>
  );
}
