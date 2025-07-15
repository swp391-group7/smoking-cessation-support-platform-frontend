import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';
import { BlogType } from '@/api/blog';

interface FilterBarProps {
  selectedType: BlogType | 'ALL';
  onTypeChange: (type: BlogType | 'ALL') => void;
}

export default function PremiumFilterBar({ selectedType, onTypeChange }: FilterBarProps) {
  const getTypeLabel = (type: BlogType | 'ALL') => {
    switch (type) {
      case BlogType.HEALTH:
        return 'Health';
      case BlogType.SMOKEQUIT:
        return 'Smoke Quit';
      case BlogType.SMOKEHARM:
        return 'Smoke Harm';
      case BlogType.PREMIUM:
        return 'Premium Content';
      default:
        return 'Topic';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="border-yellow-600 text-yellow-600 flex items-center gap-2"
          >
            {getTypeLabel(selectedType)}
            <ChevronDownIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onTypeChange('ALL')}>
            All Topics
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange(BlogType.HEALTH)}>
            Health
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange(BlogType.SMOKEQUIT)}>
            Smoke Quit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange(BlogType.SMOKEHARM)}>
            Smoke Harm
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTypeChange(BlogType.PREMIUM)}>
            Premium Content
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}