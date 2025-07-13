import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { fetchAllBadges } from '@/api/badgeApi';
import {
  getAllBadgesByUserId,
  getAllBadgesOfCurrentUser,
  type UserEarnedBadgeDetails,
} from '@/api/userBadgeApi';

export interface BadgeDto {
  id: string;
  badgeName: string;
  badgeDescription: string;
  badgeImageUrl: string;
  condition: number;
  createdAt: string;
}

interface NormalizedBadge {
  id: string;
  badgeName: string;
  badgeDescription: string;
  badgeImageUrl: string;
  createdAt: string;
  condition?: number;
  isEarned: boolean;
}

interface BadgesSidebarProps {
  currentUserId?: string;
}

const BadgesSidebar: React.FC<BadgesSidebarProps> = ({ currentUserId }) => {
  const [badges, setBadges] = useState<NormalizedBadge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const allBadges = await fetchAllBadges();
        const userEarned: UserEarnedBadgeDetails[] = currentUserId
          ? await getAllBadgesByUserId(currentUserId)
          : await getAllBadgesOfCurrentUser();

        const badgeMap = new Map<string, NormalizedBadge>();

        // Thêm tất cả system badges trước
        allBadges.forEach(systemBadge => {
          badgeMap.set(systemBadge.id, {
            id: systemBadge.id,
            badgeName: systemBadge.badgeName,
            badgeDescription: systemBadge.badgeDescription,
            badgeImageUrl: systemBadge.badgeImageUrl,
            createdAt: systemBadge.createdAt,
            condition: systemBadge.condition,
            isEarned: false,
          });
        });

        // Đánh dấu những badges user đã earn
        userEarned.forEach(earnedBadge => {
          const existingBadge = badgeMap.get(earnedBadge.id);
          if (existingBadge) {
            badgeMap.set(earnedBadge.id, {
              ...existingBadge,
              isEarned: true,
            });
          } else {
            badgeMap.set(earnedBadge.id, {
              id: earnedBadge.id,
              badgeName: earnedBadge.badgeName,
              badgeDescription: earnedBadge.badgeDescription,
              badgeImageUrl: earnedBadge.badgeImageUrl,
              createdAt: earnedBadge.createdAt,
              isEarned: true,
            });
          }
        });

        const finalBadges = Array.from(badgeMap.values());
        setBadges(finalBadges);
        
        // Debug - xem data thực tế
        console.log('=== DEBUG BADGES ===');
        console.log('All badges API:', allBadges);
        console.log('User earned API:', userEarned);
        console.log('Final badges:', finalBadges);
        console.log('Earned badges filtered:', finalBadges.filter(b => b.isEarned));
        console.log('====================');
      } catch (error) {
        console.error('Error loading badges', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUserId]);

  if (loading) {
    return (
      <aside className="bg-white rounded-md shadow-md p-4 w-full">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex flex-col items-center p-3 bg-gray-100 rounded-md h-24">
              <div className="w-12 h-12 bg-gray-300 rounded-full mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  const earnedBadges = badges.filter(badge => badge.isEarned);
  const availableBadges = badges.filter(badge => !badge.isEarned);

  return (
    <aside className="bg-gradient-to-br from-white to-gray-100 rounded-md shadow-lg p-5 w-full border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center justify-between">
        Your Badges <span className="text-sm font-normal text-gray-600">({badges.length} Total)</span>
      </h2>

      <section className="mb-6">
        <h3 className="text-lg font-medium text-green-700 mb-3 border-b border-green-200 pb-2">
          Earned <span className="text-green-500 text-sm">({earnedBadges.length})</span>
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {earnedBadges.length > 0 ? (
            earnedBadges.map(badge => {
              console.log('Rendering earned badge:', badge); // Debug từng badge
              return (
                <div
                  key={badge.id}
                  className="relative flex flex-col items-center p-3 bg-green-50 rounded-md border border-green-200 w-full"
                >
                  <img
                    src={badge.badgeImageUrl}
                    alt={badge.badgeName}
                    className="w-10 h-10 mb-1 rounded-full object-cover"
                    onError={(e) => {
                      console.error('Image load error for badge:', badge.badgeName, badge.badgeImageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <p className="text-xs font-medium text-green-800 text-center truncate w-full">
                    {badge.badgeName || 'No name'}
                  </p>
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 shadow">
                    <CheckCircle className="text-white" size={10} />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 col-span-full text-sm italic">No badges earned yet.</p>
          )}
        </div>
      </section>

      {availableBadges.length > 0 && (
        <section>
          <h3 className="text-lg font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">
            Available Badges <span className="text-gray-500 text-sm">({availableBadges.length})</span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {availableBadges.map(badge => (
              <div
                key={badge.id}
                className="relative flex flex-col items-center p-3 bg-gray-50 rounded-md border border-gray-200 w-full hover:shadow-md transition-shadow cursor-pointer"
              >
                <img
                  src={badge.badgeImageUrl}
                  alt={badge.badgeName}
                  className="w-10 h-10 mb-1 rounded-full object-cover opacity-60"
                />
                <p className="text-xs font-medium text-gray-600 text-center truncate w-full">
                  {badge.badgeName}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
};

export default BadgesSidebar;