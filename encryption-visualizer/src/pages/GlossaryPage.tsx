import { useState } from 'react';
import { glossaryTerms } from '@/data/glossary';
import { FAQPageSchema } from '@/components/seo/JsonLd';
import { glossaryFAQItems } from '@/data/structuredData';
import { Search, Book } from 'lucide-react';
import { m } from 'framer-motion';

export const GlossaryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', 'Symmetric', 'Asymmetric', 'Hashing', 'General', 'Security'];

    const filteredTerms = glossaryTerms.filter((term) => {
        const query = searchTerm.trim().toLowerCase();
        const matchesSearch = term.term.toLowerCase().includes(query) ||
            term.definition.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
        <FAQPageSchema items={glossaryFAQItems} />
        <div className="space-y-8 max-w-4xl mx-auto">
            <p className="eyebrow">The reference shelf / {glossaryTerms.length} terms</p>
            <div className="lesson-header">
                <div>
                    <h1 className="section-title mb-4 flex items-center gap-3">
                        <Book className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-cyber-cyan" />
                        Crypto Glossary
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Dictionary of cryptographic terms and concepts.
                    </p>
                </div>

                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                        type="search"
                        aria-label="Search cryptographic terms"
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-cyber-dark text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyber-blue/50 focus:border-cyber-blue transition duration-150 ease-in-out sm:text-sm"
                        placeholder="Search terms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        aria-pressed={selectedCategory === category}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95 ${selectedCategory === category
                                ? 'bg-cyber-blue text-white shadow-md shadow-cyber-blue/20'
                                : 'bg-slate-100 dark:bg-cyber-surface border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <p role="status" className="eyebrow">{filteredTerms.length} of {glossaryTerms.length} terms</p>

            {/* Terms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTerms.length > 0 ? (
                    filteredTerms.map((term) => (
                        <m.div
                            key={term.term}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15 }}
                            className="glass-card-hover p-5 border-l-4 border-l-cyber-blue"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{term.term}</h3>
                                <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    {term.category}
                                </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                {term.definition}
                            </p>
                            {term.relatedTerms && term.relatedTerms.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
                                    <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">Related:</span>
                                    {term.relatedTerms.map((related) => (
                                        glossaryTerms.some((item) => item.term.toLowerCase().includes(related.toLowerCase())) ? <button key={related} className="text-xs text-blue-600 dark:text-cyber-cyan font-medium min-h-[44px] underline underline-offset-4" onClick={() => { setSelectedCategory('All'); setSearchTerm(related); document.querySelector<HTMLInputElement>('input[type="search"]')?.focus(); }}>
                                            {related}
                                        </button>
                                        : <span key={related} className="text-xs text-slate-600 dark:text-slate-400 self-center">{related}</span>
                                    ))}
                                </div>
                            )}
                        </m.div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-full mb-4">
                            <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            No terms found for &lsquo;{searchTerm || selectedCategory}&rsquo;
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                            Try different keywords or browse by category
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button className="btn-secondary" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>Clear filters</button>
                            {categories.filter((c) => c !== 'All').map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory(category);
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-cyber-surface border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-150 active:scale-95"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};
