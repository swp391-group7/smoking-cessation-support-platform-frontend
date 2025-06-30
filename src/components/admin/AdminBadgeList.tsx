// src/components/admin/AdminBadgeList.tsx
import React, { useEffect, useState } from 'react';
import { getAllBadges, deleteBadge, type BadgeDto } from '@/api/adminapi/adminBadgeApi';
import { Button } from '@/components/ui/button';
import { Trash, PlusCircle } from 'lucide-react';

interface Props {
  onCreate: () => void;
}

const AdminBadgeList: React.FC<Props> = ({ onCreate }) => {
  const [badges, setBadges] = useState<BadgeDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const res = await getAllBadges();
      setBadges(res);
    } catch (err) {
      console.error('Failed to load badges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this badge?')) return;
    try {
      await deleteBadge(id);
      setBadges((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Failed to delete badge:', err);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">All Badges</h1>
        <Button onClick={onCreate}><PlusCircle size={18} className="mr-1" /> New Badge</Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-3">
          {badges.map((badge) => (
            <li key={badge.id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{badge.badgeName}</p>
                <p className="text-sm text-gray-600">{badge.badgeDescription}</p>
                <p className="text-sm text-gray-500">{new Date(badge.createdAt || '').toLocaleString()}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(badge.id)}>
                <Trash size={16} />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminBadgeList;