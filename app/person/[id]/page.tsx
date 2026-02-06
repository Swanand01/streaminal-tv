import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { PersonDetailsSkeleton } from '@/components/person-details-skeleton';
import { PersonContent } from './person-content';

interface PersonPageProps {
    params: Promise<{ id: string }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
    const { id } = await params;
    const personId = parseInt(id);

    // Check for invalid ID
    if (isNaN(personId)) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
                    <p className="text-xl text-muted-foreground">Invalid person ID</p>
                    <p className="text-sm text-muted-foreground">Please check the URL and try again</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <Suspense fallback={<PersonDetailsSkeleton />}>
                <PersonContent personId={personId} />
            </Suspense>
        </div>
    );
}

