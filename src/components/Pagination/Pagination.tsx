import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPageNumbers } from '@/lib/helpers';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="border-border text-foreground hover:bg-secondary disabled:opacity-50 bg-transparent"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers(currentPage, totalPages).map((page, index) =>
          typeof page === 'number' ? (
            <Button
              key={index}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                onPageChange(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={
                currentPage === page
                  ? 'bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:bg-secondary'
              }
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="px-2 text-muted-foreground">
              {page}
            </span>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="border-border text-foreground hover:bg-secondary disabled:opacity-50 bg-transparent"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
