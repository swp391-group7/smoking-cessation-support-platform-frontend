import React from 'react';
import { Button } from '@/components/ui/button';

const filters = ['Recommended', 'Topic', 'Relevant', 'Level'];

export default function FilterBar() {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((name) => (
        <Button key={name} variant="outline" className="border-green-600 text-green-600">
          {name}
        </Button>
      ))}
    </div>
  );
}