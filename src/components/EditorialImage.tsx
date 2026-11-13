import {useState} from 'react';
import {BookOpen} from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  aspectClass?: string;
  fallbackTitle: string;
  className?: string;
}

export function EditorialImage({
  src,
  alt,
  aspectClass = 'aspect-video',
  fallbackTitle,
  className = '',
}: EditorialImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`${aspectClass} w-full rounded-md border border-[#E2DDD5] bg-gradient-to-br from-[#EFECE6] via-[#F7F5F0] to-[#E5EBE7] flex flex-col items-center justify-center p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="w-6 h-6 text-[#728D80] mb-2" strokeWidth={1.5} />
        <p className="font-serif italic text-base text-[#5A585F]">{fallbackTitle}</p>
      </div>
    );
  }

  return (
    <div className={`${aspectClass} w-full overflow-hidden rounded-md border border-[#E2DDD5] bg-[#EFECE6] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
