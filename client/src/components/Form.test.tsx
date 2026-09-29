import { afterEach, describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from './Form';
import { getAreas } from '@/api/areas.ts';

// Replace the API call, so the Area field gets predictable suggestions.
vi.mock('@/api/areas.ts', () => ({ getAreas: vi.fn() }));

const areas = [
  { placeId: '1', mainText: 'Mount Olympus', secondaryText: 'Greece' },
  { placeId: '2', mainText: 'Olympia', secondaryText: 'Greece' },
];

const fakeDebounce = () => new Promise((resolve) => setTimeout(resolve, 400));

afterEach(() => {
  vi.mocked(getAreas).mockReset();
});

describe('Form', () => {
  it('should display all fields', () => {
    const { getByLabelText, getByRole } = render(<Form />);

    // Finding each field by its label also checks the label is linked to the right input.
    expect(getByLabelText('Title*')).toBeVisible();
    expect(getByLabelText('Type*')).toBeVisible();
    expect(getByLabelText('Area*')).toBeVisible();
    expect(getByLabelText('Price in euros*')).toBeVisible();
    expect(getByLabelText('Extra description')).toBeVisible();

    expect(getByRole('button', { name: 'Reset' })).toBeVisible();
    expect(getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  describe('Validation', () => {
    it('should display validation errors on empty form submit', async () => {
      const user = userEvent.setup();
      const { getByRole, findByText, findAllByRole } = render(<Form />);

      await user.click(getByRole('button', { name: 'Submit' }));

      // Validation is async, so wait for the errors with findBy.
      expect(await findByText('Property title is required.')).toBeVisible();
      expect(await findByText('Property listing type is required.')).toBeVisible();
      expect(await findByText('Property area is required.')).toBeVisible();
      expect(await findByText('Property price is required.')).toBeVisible();

      // The description is optional, so there should be exactly 4 errors.
      expect(await findAllByRole('alert')).toHaveLength(4);
    });

    it('should display an error for a title with only spaces', async () => {
      const user = userEvent.setup();
      const { getByLabelText, getByRole, findByText } = render(<Form />);

      await user.type(getByLabelText('Title*'), '   ');
      await user.click(getByRole('button', { name: 'Submit' }));

      expect(await findByText('Property title is required.')).toBeVisible();
    });

    it('should display an error for a title longer than 155 characters', async () => {
      const user = userEvent.setup();
      const { getByLabelText, getByRole, findByText } = render(<Form />);

      // Paste instead of type, so we don't simulate 156 key presses.
      await user.click(getByLabelText('Title*'));
      await user.paste('a'.repeat(156));
      await user.click(getByRole('button', { name: 'Submit' }));

      expect(await findByText('Property title must be at most 155 characters.')).toBeVisible();
    });

    it('should display an error for a price of 0', async () => {
      const user = userEvent.setup();
      const { getByLabelText, getByRole, findByText } = render(<Form />);

      await user.type(getByLabelText('Price in euros*'), '0');
      await user.click(getByRole('button', { name: 'Submit' }));

      expect(await findByText('Property price must be greater than 0.')).toBeVisible();
    });
  });

  describe('Autocomplete', () => {
    it('should not search for fewer than 3 characters', async () => {
      const user = userEvent.setup();
      const { getByLabelText } = render(<Form />);

      await user.type(getByLabelText('Area*'), 'Ol');
      await fakeDebounce();

      expect(getAreas).not.toHaveBeenCalled();
    });

    it('should show suggestions for the typed area', async () => {
      vi.mocked(getAreas).mockResolvedValue(areas);
      const user = userEvent.setup();
      const { getByLabelText, findByRole } = render(<Form />);

      await user.type(getByLabelText('Area*'), 'Olymp');

      expect(await findByRole('option', { name: 'Mount Olympus, Greece' })).toBeVisible();
      expect(await findByRole('option', { name: 'Olympia, Greece' })).toBeVisible();

      expect(getAreas).toHaveBeenCalledTimes(1);
      expect(getAreas).toHaveBeenCalledWith('Olymp', expect.any(AbortSignal));
    });

    it('should fill in and accept the selected area', async () => {
      vi.mocked(getAreas).mockResolvedValue(areas);
      const user = userEvent.setup();
      const { getByLabelText, findByRole } = render(<Form />);
      const areaInput = getByLabelText('Area*');

      await user.type(areaInput, 'Olymp');
      await user.click(await findByRole('option', { name: 'Mount Olympus, Greece' }));

      expect(areaInput).toHaveValue('Mount Olympus, Greece');

      // Selecting a suggestion must not trigger another search for its label.
      await fakeDebounce();
      expect(getAreas).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reset', () => {
    it('should reset form fields', async () => {
      vi.mocked(getAreas).mockResolvedValue(areas);
      const user = userEvent.setup();
      const { getByLabelText, getByRole, findByRole } = render(<Form />);

      const titleInput = getByLabelText('Title*');
      const typeSelect = getByLabelText('Type*');
      const areaInput = getByLabelText('Area*');
      const priceInput = getByLabelText('Price in euros*');
      const descriptionInput = getByLabelText('Extra description');

      // Fill in every field first, so there is something to reset.
      await user.type(titleInput, 'Mount Olympus villa');
      await user.click(typeSelect);
      await user.click(await findByRole('option', { name: 'Rent' }));
      await user.type(areaInput, 'Olymp');
      await user.click(await findByRole('option', { name: 'Mount Olympus, Greece' }));
      await user.type(priceInput, '800');
      await user.type(descriptionInput, 'Sea view');

      expect(typeSelect).toHaveTextContent('Rent');

      await user.click(getByRole('button', { name: 'Reset' }));

      expect(titleInput).toHaveValue('');
      expect(typeSelect).toHaveTextContent('Select type');
      expect(areaInput).toHaveValue('');
      expect(priceInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });

    it('should clear validation errors', async () => {
      const user = userEvent.setup();
      const { getByRole, findAllByRole, queryAllByRole } = render(<Form />);

      await user.click(getByRole('button', { name: 'Submit' }));
      expect(await findAllByRole('alert')).toHaveLength(4);

      await user.click(getByRole('button', { name: 'Reset' }));

      expect(queryAllByRole('alert')).toHaveLength(0);
    });
  });
});
