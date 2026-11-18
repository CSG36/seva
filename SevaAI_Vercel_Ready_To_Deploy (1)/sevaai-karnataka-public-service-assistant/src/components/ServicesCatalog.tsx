import { useMemo, useState } from 'react';
import { ArrowUpRight, MessageSquare, RotateCcw, Search } from 'lucide-react';
import type { UiDictionary } from '../i18n/translations';
import type { ServiceItem } from '../types/seva';

interface ServicesCatalogProps {
  dict: UiDictionary;
  services: ServiceItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onExploreService: (service: ServiceItem) => void;
}

export function ServicesCatalog({
  dict,
  services,
  loading,
  error,
  onRetry,
  onExploreService,
}: ServicesCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const svc of services) {
      if (!seen.has(svc.category_key)) {
        seen.set(svc.category_key, svc.category);
      }
    }
    return Array.from(seen.entries()).map(([key, label]) => ({ key, label }));
  }, [services]);

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return services.filter((svc) => {
      const matchesCat = selectedCategory === 'all' || svc.category_key === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        svc.name.toLowerCase().includes(q) ||
        svc.category.toLowerCase().includes(q) ||
        svc.department.toLowerCase().includes(q) ||
        svc.description.toLowerCase().includes(q) ||
        svc.portal_label.toLowerCase().includes(q)
      );
    });
  }, [services, searchQuery, selectedCategory]);

  return (
    <section id="services" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1E36] text-balance">
            {dict.services.sectionTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            {dict.services.sectionSubtitle}
          </p>
        </div>

        {/* Search and category controls */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="relative max-w-md">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dict.services.searchPlaceholder}
              aria-label={dict.services.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F1E36] focus:ring-2 focus:ring-[#0F1E36]/15 min-h-[44px]"
            />
          </div>

          <div
            role="tablist"
            aria-label="Government service categories"
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F1F5F9] rounded-xl w-fit max-w-full"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#0F1E36] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F1E36]'
              }`}
            >
              {dict.services.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
                  selectedCategory === cat.key
                    ? 'bg-white text-[#0F1E36] shadow-sm'
                    : 'text-slate-600 hover:text-[#0F1E36]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catalogue states */}
        {loading ? (
          <div className="mt-10 py-12 text-center text-sm text-slate-500">
            {dict.services.loadingState}
          </div>
        ) : error ? (
          <div className="mt-10 p-6 border border-red-200 bg-red-50/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-red-900">{dict.services.errorState}</p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0F1E36] rounded-lg hover:bg-[#1A3154] whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              {dict.services.retryButton}
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="mt-10 p-8 border border-slate-200 bg-[#F8FAFC] rounded-xl text-center">
            <p className="text-sm text-slate-600">{dict.services.emptyState}</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((svc) => (
              <article
                key={svc.id}
                className="flex flex-col justify-between p-6 bg-[#F8FAFC] border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
              >
                <div>
                  {/* Unboxed quiet metadata */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-medium text-[#B45309]">{svc.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate max-w-[220px]">{svc.portal_label}</span>
                  </div>

                  <h3 className="mt-2.5 font-display text-lg font-semibold text-[#0F1E36] leading-snug">
                    {svc.name}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {svc.department}
                  </p>

                  <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={svc.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#15803D] hover:text-[#166534] hover:underline underline-offset-4 whitespace-nowrap shrink-0 py-1.5"
                  >
                    {dict.services.visitPortal}
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onExploreService(svc)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#0F1E36] bg-white border border-slate-200 hover:border-[#0F1E36] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                    {dict.services.askAssistant}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
