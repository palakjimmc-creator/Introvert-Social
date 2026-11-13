import {FormEvent, useMemo, useState} from 'react';
import {Check, Copy, Plus, Shuffle, Trash2} from 'lucide-react';
import {ExcuseCategory, ExcuseSlip} from '../types/lounge';
import {EXCUSE_CATEGORIES} from '../data/loungeData';
import {EditorialImage} from './EditorialImage';

interface ExcusesScreenProps {
  excuses: ExcuseSlip[];
  onAddCustomExcuse: (headline: string, body: string, category: Exclude<ExcuseCategory, 'all'>) => void;
  onDeleteCustomExcuse: (id: string) => void;
  onNotify: (message: string) => void;
}

export function ExcusesScreen({
  excuses,
  onAddCustomExcuse,
  onDeleteCustomExcuse,
  onNotify,
}: ExcusesScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<ExcuseCategory>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [quietObservationMode, setQuietObservationMode] = useState(false);

  const [customHeadline, setCustomHeadline] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [customCategory, setCustomCategory] =
    useState<Exclude<ExcuseCategory, 'all'>>('polite-departure');

  const filteredExcuses = useMemo(() => {
    if (selectedCategory === 'all') return excuses;
    return excuses.filter((slip) => slip.category === selectedCategory);
  }, [excuses, selectedCategory]);

  const currentSlip =
    filteredExcuses[activeIndex % Math.max(1, filteredExcuses.length)] ?? filteredExcuses[0];

  const handleCategoryChange = (cat: ExcuseCategory) => {
    setSelectedCategory(cat);
    setActiveIndex(0);
  };

  const handleShuffle = () => {
    if (filteredExcuses.length <= 1) return;
    let next = Math.floor(Math.random() * filteredExcuses.length);
    if (next === activeIndex % filteredExcuses.length) {
      next = (next + 1) % filteredExcuses.length;
    }
    setActiveIndex(next);
  };

  const copyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedId(id);
    onNotify('Copied excuse slip to clipboard.');
    window.setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 1800);
  };

  const handleSaveCustom = (e: FormEvent) => {
    e.preventDefault();
    const trimmedBody = customBody.trim();
    if (!trimmedBody) return;
    const trimmedHeadline = customHeadline.trim() || 'Personal Pocket Note';
    onAddCustomExcuse(trimmedHeadline, trimmedBody, customCategory);
    setCustomHeadline('');
    setCustomBody('');
    setSelectedCategory('all');
    setActiveIndex(0);
    onNotify('Saved your excuse slip locally.');
  };

  return (
    <div className="space-y-10">
      {/* Header & Stationery Visual */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#EFECE6] border border-[#E2DDD5] rounded-lg p-6 sm:p-8">
          <div>
            <p className="text-[12px] text-[#5A585F] mb-2">
              Pocket Excuse Generator · Tear-Off Stationery
            </p>
            <h1 className="font-serif text-[32px] sm:text-[38px] leading-[1.15] tracking-[-0.015em] font-semibold text-[#1E1E24] text-balance">
              Graceful exits, pre-printed for{' '}
              <span className="italic font-medium text-[#486156]">low-bandwidth moments.</span>
            </h1>
            <p className="text-[15px] leading-relaxed text-[#5A585F] mt-3 max-w-[54ch]">
              Select a social tone below, tear off a clean phrase for text or spoken delivery, or
              tuck your own bespoke alibi into the pocket archive.
            </p>
          </div>

          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center gap-1.5 mt-6 pt-5 border-t border-[#E2DDD5]">
            {EXCUSE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`tactile-press px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap min-h-[40px] ${
                    isActive
                      ? 'bg-[#728D80] text-white'
                      : 'bg-[#F7F5F0] text-[#5A585F] border border-[#E2DDD5] hover:text-[#1E1E24]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5">
          <EditorialImage
            src="/src/assets/images/stationery_pocket_notebook_1794549785792.jpg"
            alt="Open cream pocket notebook with perforated tear-off slip and brass pen"
            aspectClass="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[220px]"
            fallbackTitle="Pocket Notebook · Tear-Off Edition"
            className="h-full"
          />
        </div>
      </section>

      {/* Featured Tear-Off Slip Card */}
      {currentSlip && (
        <section className="bg-[#EFECE6] border border-[#E2DDD5] rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5A585F]">
                Slip No. {String((activeIndex % filteredExcuses.length) + 1).padStart(2, '0')} ·{' '}
                {EXCUSE_CATEGORIES.find((c) => c.id === currentSlip.category)?.label}
              </span>
              <span className="text-[12px] text-[#5A585F] tabular-nums">
                {(activeIndex % filteredExcuses.length) + 1} of {filteredExcuses.length}
              </span>
            </div>

            <h2 className="font-serif text-[26px] sm:text-[30px] font-medium text-[#1E1E24] leading-snug">
              {currentSlip.headline}
            </h2>
          </div>

          {/* Tear-off dashed perforation */}
          <div className="relative border-t border-dashed border-[#D2CBC1] mx-6 sm:mx-8" />

          <div className="p-6 sm:p-8 bg-[#FFFFFF]/70">
            <blockquote className="font-serif italic text-[20px] sm:text-[23px] leading-[1.5] text-[#1E1E24] max-w-[60ch]">
              “{currentSlip.body}”
            </blockquote>

            {!quietObservationMode && (
              <p className="text-[14px] text-[#5A585F] mt-4">
                Delivery note: {currentSlip.toneNote}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => copyText(currentSlip.id, currentSlip.body)}
                className="tactile-press inline-flex items-center gap-2 rounded-full bg-[#728D80] hover:bg-[#627B6E] text-white px-5 py-2.5 text-[14px] font-semibold cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                {copiedId === currentSlip.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied to Pocket
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Excuse
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShuffle}
                disabled={filteredExcuses.length <= 1}
                className="tactile-press inline-flex items-center gap-2 rounded-full bg-[#EFECE6] hover:bg-[#E7E2DA] border border-[#D2CBC1] text-[#1E1E24] px-5 py-2.5 text-[14px] font-medium cursor-pointer whitespace-nowrap min-h-[44px] disabled:opacity-50"
              >
                <Shuffle className="w-4 h-4 text-[#5A585F]" />
                Shuffle Slip
              </button>

              <button
                type="button"
                onClick={() => setQuietObservationMode((prev) => !prev)}
                className="tactile-press inline-flex items-center gap-2 rounded-full bg-transparent hover:bg-[#EFECE6] border border-[#E2DDD5] text-[#5A585F] px-4 py-2.5 text-[13px] font-medium cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                {quietObservationMode ? 'Show Delivery Note' : 'Observe Silently'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Custom Pocket Excuse Composer + Archive List */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleSaveCustom}
          className="lg:col-span-5 bg-[#EFECE6] border border-[#E2DDD5] rounded-md p-6 space-y-4"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5A585F]">
              Write Your Own
            </p>
            <h3 className="font-serif text-[22px] font-medium text-[#1E1E24] mt-0.5">
              Personal Pocket Slip
            </h3>
          </div>

          <div>
            <label htmlFor="excuse-title" className="block text-[13px] font-semibold text-[#1E1E24] mb-1.5">
              Slip Title
            </label>
            <input
              id="excuse-title"
              type="text"
              value={customHeadline}
              onChange={(e) => setCustomHeadline(e.target.value)}
              placeholder="e.g., The Forgotten Porch Light"
              className="w-full rounded-md bg-[#FFFFFF] border border-[#E2DDD5] focus:border-[#728D80] focus:outline-none px-3.5 py-2.5 text-[14px] text-[#1E1E24] placeholder:italic placeholder:text-[#5A585F]/70"
            />
          </div>

          <div>
            <label htmlFor="excuse-category" className="block text-[13px] font-semibold text-[#1E1E24] mb-1.5">
              Category
            </label>
            <select
              id="excuse-category"
              value={customCategory}
              onChange={(e) =>
                setCustomCategory(e.target.value as Exclude<ExcuseCategory, 'all'>)
              }
              className="w-full rounded-md bg-[#FFFFFF] border border-[#E2DDD5] focus:border-[#728D80] focus:outline-none px-3.5 py-2.5 text-[14px] text-[#1E1E24]"
            >
              {EXCUSE_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="excuse-body" className="block text-[13px] font-semibold text-[#1E1E24] mb-1.5">
              Excuse Text
            </label>
            <textarea
              id="excuse-body"
              rows={3}
              required
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              placeholder="Quietly type your excuse here..."
              className="w-full rounded-md bg-[#FFFFFF] border border-[#E2DDD5] focus:border-[#728D80] focus:outline-none px-3.5 py-2.5 text-[14px] text-[#1E1E24] placeholder:italic placeholder:text-[#5A585F]/70 resize-none"
            />
          </div>

          <button
            type="submit"
            className="tactile-press w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#728D80] hover:bg-[#627B6E] text-white px-5 py-2.5 text-[14px] font-semibold cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Save to Pocket Notebook
          </button>
        </form>

        <div className="lg:col-span-7 bg-[#EFECE6] border border-[#E2DDD5] rounded-md p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="font-serif text-[22px] font-medium text-[#1E1E24]">
              Index of Available Slips
            </h3>
            <span className="text-[12px] text-[#5A585F] tabular-nums">
              {filteredExcuses.length} slips
            </span>
          </div>

          <div className="divide-y divide-[#E2DDD5]">
            {filteredExcuses.map((slip, idx) => (
              <div
                key={slip.id}
                className="py-3.5 flex items-start justify-between gap-4"
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className="text-left min-w-0 flex-1 cursor-pointer group"
                >
                  <p className="font-serif text-[17px] font-medium text-[#1E1E24] group-hover:text-[#486156] transition-colors">
                    {slip.headline}
                  </p>
                  <p className="text-[14px] text-[#5A585F] line-clamp-2 mt-0.5">
                    {slip.body}
                  </p>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyText(slip.id, slip.body)}
                    aria-label={`Copy ${slip.headline}`}
                    className="min-w-[44px] min-h-[44px] rounded-full border border-[#E2DDD5] bg-[#F7F5F0] hover:bg-[#FFFFFF] flex items-center justify-center text-[#1E1E24] cursor-pointer"
                  >
                    {copiedId === slip.id ? (
                      <Check className="w-4 h-4 text-[#486156]" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#5A585F]" />
                    )}
                  </button>
                  {slip.isCustom && (
                    <button
                      type="button"
                      onClick={() => onDeleteCustomExcuse(slip.id)}
                      aria-label={`Delete ${slip.headline}`}
                      className="min-w-[44px] min-h-[44px] rounded-full border border-[#E2DDD5] bg-[#F7F5F0] hover:bg-[#FDF0EC] flex items-center justify-center text-[#C86147] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
