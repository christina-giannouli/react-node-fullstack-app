import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getProperties } from '@/api/properties.ts';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { areaLabel } from '@/hooks/useAreaSearch.ts';
import type { Property } from '@/types/property.ts';
import { toast } from 'sonner';

const priceFormat = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    getProperties(controller.signal)
      .then(setProperties)
      .catch((err: Error) => {
        // Ignore failures from aborted requests.
        if (controller.signal.aborted) return;

        toast.error(err.message);
        setProperties([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    // Abort the request if the page is left before it finishes.
    return () => controller.abort();
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your listings</h1>
        <Button asChild className="h-8" variant="outline-white" size="sm">
          <Link to="/">Add a property</Link>
        </Button>
      </div>

      {!loading && properties.length === 0 && (
        <p className="text-muted-foreground">You have no listings yet.</p>
      )}

      {/* 1 column on phones, 2 on tablets (from 640px), 3 on desktop (from 1024px). */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy={loading}>
        {loading && (
          <>
            <span className="sr-only">Loading listings...</span>
            {[1, 2, 3].map((i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </>
        )}
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle className="text-secondary-ink text-lg font-bold tracking-tight">
                {property.title}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {property.type} · {areaLabel(property.area)}
              </p>
            </CardHeader>
            {/* flex-1 pushes the footer to the bottom, so dates line up across a grid row. */}
            <CardContent className="flex flex-1 flex-col gap-2">
              <p className="text-lg font-bold tracking-tight">
                {priceFormat.format(property.price)}
              </p>
              {property.description && <p className="text-sm">{property.description}</p>}
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground text-xs">
                Listed on {new Date(property.createdAt).toLocaleDateString()}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Placeholder shaped like a listing card: title, type · area, price, description, date.
function PropertyCardSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardHeader className="flex flex-col gap-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-3 w-2/5" />
      </CardFooter>
    </Card>
  );
}
