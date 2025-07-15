
// src/components/admin/AdminBadgeForm.tsx
import React, { useState } from 'react';
import { createBadge } from '@/api/adminapi/adminBadgeApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const AdminBadgeForm: React.FC<Props> = ({ onBack, onSuccess }) => {
  const [form, setForm] = useState({
    badgeName: '',
    badgeDescription: '',
    badgeImageUrl: '',
    condition: '' // Thêm trường điều kiện
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBadge(form);
      onSuccess();
    } catch (err) {
      console.error('Failed to create badge:', err);
      alert('Failed to create badge. Please check input or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Create New Badge</h2>
      <Input
        name="badgeName"
        value={form.badgeName}
        onChange={handleChange}
        placeholder="Badge Name"
        required
      />
      <Input
        name="badgeDescription"
        value={form.badgeDescription}
        onChange={handleChange}
        placeholder="Badge Description"
        required
      />
      <Input
        name="badgeImageUrl"
        value={form.badgeImageUrl}
        onChange={handleChange}
        placeholder="Image URL"
        required
      />
      <Input
        name="condition"
        value={form.condition}
        onChange={handleChange}
        placeholder="Condition to Earn Badge"
        required
      />
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Badge'}
        </Button>
      </div>
    </form>
  );
};

export default AdminBadgeForm;