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
  selectedType: BlogType | 'ALL' | 'RECOMMENDED';
  onTypeChange: (type: BlogType | 'ALL' | 'RECOMMENDED') => void;
}

export default function FilterBar({ selectedType, onTypeChange }: FilterBarProps) {
  const getTypeLabel = (type: BlogType | 'ALL' | 'RECOMMENDED') => {
    switch (type) {
      case BlogType.HEALTH:
        return 'Health';
      case BlogType.SMOKEQUIT:
        return 'Smoke Quit';
      case BlogType.SMOKEHARM:
        return 'Smoke Harm';
      case 'RECOMMENDED':
        return 'Recommended';
      default:
        return 'Topic';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button 
        variant={selectedType === 'RECOMMENDED' ? 'default' : 'outline'} 
        className={selectedType === 'RECOMMENDED' ? 'bg-green-600 text-white' : 'border-green-600 text-green-600'}
        onClick={() => onTypeChange('RECOMMENDED')}
      >
        Recommended
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="border-green-600 text-green-600 flex items-center gap-2"
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}