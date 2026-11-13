import {ArrowLeft} from 'lucide-react';
import {DECOY_ARTICLE} from '../data/loungeData';
import {EditorialImage} from './EditorialImage';

interface ReadingDecoyOverlayProps {
  isOpen: boolean;
  onExitDecoy: () => void;
}

export function ReadingDecoyOverlay({isOpen, onExitDecoy}: ReadingDecoyOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#F7F5F0] text-[#1E1E24] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Innocuous reading article decoy"
    >
      {/* Clean Magazine Masthead */}
      <header className="border-b border-[#E2DDD5] bg-[#F7F5F0]/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[920px] mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-6">
          <span className="font-serif text-[17px] font-semibold tracking-tight text-[#1E1E24] truncate">
            {DECOY_ARTICLE.publication}
          </span>
          <button
            type="button"
            onClick={onExitDecoy}
            className="inline-flex items-center gap-1.5 text-[12px] text-[#5A585F] hover:text-[#1E1E24] cursor-pointer whitespace-nowrap py-2 px-2.5 rounded-md hover:bg-[#EFECE6] transition-colors"
            title="Return to Wallflower Lounge"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Lounge
          </button>
        </div>
      </header>

      {/* Long-Form Editorial Reading Layout */}
      <article className="max-w-[740px] mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <p className="text-[12px] text-[#5A585F] mb-3">
          {DECOY_ARTICLE.issue} · {DECOY_ARTICLE.readTime}
        </p>

        <h1 className="font-serif text-[34px] sm:text-[44px] leading-[1.15] tracking-[-0.02em] font-semibold text-[#1E1E24] text-balance">
          {DECOY_ARTICLE.title}
        </h1>

        <p className="text-[18px] leading-[1.6] text-[#5A585F] mt-4">
          {DECOY_ARTICLE.dek}
        </p>

        <div className="flex items-center gap-2 text-[13px] text-[#5A585F] mt-6 pb-6 border-b border-[#E2DDD5]">
          <span className="font-medium text-[#1E1E24]">{DECOY_ARTICLE.author}</span>
          <span aria-hidden="true">·</span>
          <span>{DECOY_ARTICLE.date}</span>
        </div>

        <figure className="my-8">
          <EditorialImage
            src="/src/assets/images/civic_reading_room_1794549785993.jpg"
            alt="Historic timber and limestone civic reading room with arched daylight windows"
            aspectClass="aspect-[16/9]"
            fallbackTitle="Civic Reading Hall · Archive Plate"
          />
          <figcaption className="font-serif italic text-[13px] text-[#5A585F] mt-2.5">
            {DECOY_ARTICLE.caption}
          </figcaption>
        </figure>

        <div className="space-y-6 text-[17px] leading-[1.78] text-[#1E1E24]">
          {DECOY_ARTICLE.paragraphs.map((para, idx) => (
            <p
              key={idx}
              className={
                idx === 0
                  ? 'first-letter:text-[52px] first-letter:font-serif first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85] first-letter:mt-1 first-letter:text-[#486156]'
                  : ''
              }
            >
              {para}
            </p>
          ))}

          <blockquote className="my-8 py-6 border-y border-[#E2DDD5] font-serif italic text-[22px] sm:text-[25px] leading-[1.45] text-[#1E1E24] text-center px-4">
            “{DECOY_ARTICLE.pullQuote}”
          </blockquote>

          <p>{DECOY_ARTICLE.closingParagraph}</p>
        </div>

        <footer className="mt-12 pt-6 border-t border-[#E2DDD5] space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5A585F] mb-2">
            Archival Notes
          </p>
          {DECOY_ARTICLE.footnotes.map((note, idx) => (
            <p key={idx} className="text-[13px] text-[#5A585F] leading-relaxed">
              {note}
            </p>
          ))}
        </footer>
      </article>
    </div>
  );
}
