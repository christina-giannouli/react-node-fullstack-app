import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getProperties } from '@/api/properties.ts';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your listings</h1>
        <Button asChild className="h-8" variant="outline" size="sm" disabled={loading}>
          <Link to="/">Add a property</Link>
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Loading...</p>}
      {!loading && properties.length === 0 && (
        <p className="text-muted-foreground">You have no listings yet.</p>
      )}

      {properties.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle>{property.title}</CardTitle>
            <p className="text-muted-foreground text-sm">
              {property.type} · {areaLabel(property.area)}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="font-medium">{priceFormat.format(property.price)}</p>
            {property.description && <p className="text-sm">{property.description}</p>}
            <p className="text-muted-foreground text-xs">
              Listed on {new Date(property.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
