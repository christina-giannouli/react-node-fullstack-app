import { Link, useNavigate } from 'react-router';
import { Form } from '@/components/Form.tsx';
import { Button } from '@/components/ui/button.tsx';

export function NewProperty() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full sm:max-w-[600px]">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New property</h1>
        <Button asChild className="h-8" variant="outline-white" size="sm">
          <Link to="/properties">See your listings</Link>
        </Button>
      </div>
      <Form onViewListings={() => navigate('/properties')} />
    </div>
  );
}
