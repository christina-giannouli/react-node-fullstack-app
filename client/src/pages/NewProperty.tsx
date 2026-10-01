import { Link, useNavigate } from 'react-router';
import { Form } from '@/components/Form.tsx';
import { Button } from '@/components/ui/button.tsx';

export function NewProperty() {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-2xl">New property classified</h3>
        <Button asChild className="h-8" variant="outline" size="sm">
          <Link to="/properties">See your listings</Link>
        </Button>
      </div>
      <Form onViewListings={() => navigate('/properties')} />
    </>
  );
}
