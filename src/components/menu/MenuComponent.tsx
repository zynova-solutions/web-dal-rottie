"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { MenuItem, Category } from '@/data/menuData';
import { getCategoryIcon } from './MenuCategoryIcons';

const MenuComponent = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  // State for active category
  const [activeCategory, setActiveCategory] = useState<string>('');
  // Refs for category sections
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  // State for menu loading
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [menuLoadError, setMenuLoadError] = useState<string | null>(null);
  // State for menu data
  const [menuData, setMenuData] = useState<{ foodCategories: Category[], drinkCategories: Category[] }>({
    foodCategories: [],
    drinkCategories: []
  });
  
  // Determine current language from URL
  const pathname = usePathname();
  const [lang, setLang] = useState<'en' | 'de'>('en');
  
  // Debounce search query for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Update language when pathname changes
  useEffect(() => {
    setLang(pathname.startsWith('/de') ? 'de' : 'en');
  }, [pathname]);

  // Initialize menu data on component mount
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setIsMenuLoading(true);
        setMenuLoadError(null);
        
        // Load menu data directly instead of relying on global variables
        const { loadMenuFromCSV } = await import('@/utils/csvMenuLoader');
        const loadedData = await loadMenuFromCSV();
        
        setMenuData(loadedData);
        setIsMenuLoading(false);
      } catch (error) {
        console.error('Error loading menu data:', error);
        setMenuLoadError('Failed to load menu data');
        setIsMenuLoading(false);
      }
    };
    
    loadMenuData();
  }, []);

  // Memoize filtered categories for better performance
  const filteredFoodCategories = useMemo(() => {
    if (!menuData.foodCategories || !Array.isArray(menuData.foodCategories)) return [];
    if (!debouncedSearchQuery) return menuData.foodCategories;
    return menuData.foodCategories.filter(category => 
      category.items.some(item => 
        item.name[lang].toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
        item.description[lang].toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    );
  }, [debouncedSearchQuery, lang, menuData.foodCategories]);

  const filteredDrinkCategories = useMemo(() => {
    if (!menuData.drinkCategories || !Array.isArray(menuData.drinkCategories)) return [];
    if (!debouncedSearchQuery) return menuData.drinkCategories;
    return menuData.drinkCategories.filter(category => 
      category.items.some(item => 
        item.name[lang].toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
        item.description[lang].toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    );
  }, [debouncedSearchQuery, lang, menuData.drinkCategories]);

  // Scroll to category when clicked
  const scrollToCategory = useCallback((categoryName: string) => {
    setActiveCategory(categoryName);
    const element = categoryRefs.current[categoryName];
    if (element) {
      const yOffset = -120; // Increased offset to account for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  // Filter menu items based on search query
  const filterMenuItems = useCallback((items: MenuItem[]) => {
    if (!debouncedSearchQuery) return items;
    return items.filter(item => 
      item.name[lang].toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
      item.description[lang].toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, lang]);

  // Check if a category has any items matching the search query
  const categoryHasMatchingItems = useCallback((category: Category) => {
    return filterMenuItems(category.items).length > 0;
  }, [filterMenuItems]);

  // Helper function to render dietary tags
  const renderDietaryTags = (item: MenuItem) => {
    const tags = [];
    
    if (item.dietary?.glutenFree) {
      tags.push(
        <span key="gluten-free" className="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          {lang === 'en' ? 'Gluten Free' : 'Glutenfrei'}
        </span>
      );
    }
    
    if (item.dietary?.vegan) {
      tags.push(
        <span key="vegan" className="px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800 border border-green-200">
          {lang === 'en' ? 'Vegan' : 'Vegan'}
        </span>
      );
    } else if (item.dietary?.vegetarian) {
      tags.push(
        <span key="vegetarian" className="px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800 border border-green-200">
          {lang === 'en' ? 'Vegetarian' : 'Vegetarisch'}
        </span>
      );
    } else if (item.dietary?.nonVegetarian) {
      tags.push(
        <span key="non-vegetarian" className="px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800 border border-red-200">
          {lang === 'en' ? 'Non-Veg' : 'Nicht-Veg'}
        </span>
      );
    }
    
    if (item.dietary?.dairyFree) {
      tags.push(
        <span key="dairy-free" className="px-1.5 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 border border-purple-200">
          {lang === 'en' ? 'Dairy Free' : 'Milchfrei'}
        </span>
      );
    }
    
    if (item.dietary?.containsNuts) {
      tags.push(
        <span key="contains-nuts" className="px-1.5 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-medium">
          ⚠️ {lang === 'en' ? 'Contains Nuts' : 'Enthält Nüsse'}
        </span>
      );
    }
    
    return tags;
  };

  // Helper function to render spice level
  const renderSpiceLevel = (item: MenuItem) => {
    if (!item.spiceLevel) return null;
    
    const spiceColors = {
      mild: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      medium: 'bg-orange-100 text-orange-800 border-orange-200',
      hot: 'bg-red-100 text-red-800 border-red-200',
      'super-hot': 'bg-red-200 text-red-900 border-red-300'
    };
    
    const spiceLabels = {
      mild: lang === 'en' ? 'Mild' : 'Mild',
      medium: lang === 'en' ? 'Medium Spicy 🌶️' : 'Mittelscharf 🌶️',
      hot: lang === 'en' ? 'Hot 🌶️🌶️' : 'Scharf 🌶️🌶️',
      'super-hot': lang === 'en' ? 'Super Hot 🌶️🌶️🌶️' : 'Superscharf 🌶️🌶️🌶️'
    };
    
    return (
      <span className={`px-1.5 py-0.5 text-xs rounded-full border ${spiceColors[item.spiceLevel]}`}>
        {spiceLabels[item.spiceLevel]}
      </span>
    );
  };

  // Format price for display
  const formatPrice = (price: string): string => {
    // Price is already formatted as a string with € symbol
    return price;
  };

  // All categories combined
  // Memoize all categories for better performance
  const allCategories = useMemo(() => {
    const food = Array.isArray(filteredFoodCategories) ? filteredFoodCategories : [];
    const drinks = Array.isArray(filteredDrinkCategories) ? filteredDrinkCategories : [];
    return [...food, ...drinks];
  }, [filteredFoodCategories, filteredDrinkCategories]);

  // State for scroll position (for showing/hiding arrows)
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const categoryBarRef = useRef<HTMLDivElement | null>(null);

  // Update arrow visibility
  const updateArrows = () => {
    const el = categoryBarRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    updateArrows();
    const el = categoryBarRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, []);

  // Set up intersection observer to update active category on scroll
  useEffect(() => {
    const currentRefs = categoryRefs.current; // Store ref value
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveCategory(id);
            
            // Scroll the active category into view in the category bar
            const categoryBar = categoryBarRef.current;
            if (categoryBar) {
              const activeButton = categoryBar.querySelector(`button[data-category="${id}"]`) as HTMLElement;
              if (activeButton) {
                // Calculate position to center the button in the scrollable area
                const containerWidth = categoryBar.offsetWidth;
                const buttonLeft = activeButton.offsetLeft;
                const buttonWidth = activeButton.offsetWidth;
                const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
                
                // Smooth scroll to the position
                categoryBar.scrollTo({
                  left: scrollPosition,
                  behavior: 'smooth'
                });
              }
            }
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" } // Adjust rootMargin if needed
    );

    const refsToObserve = Object.values(currentRefs).filter(ref => ref !== null) as Element[];
    refsToObserve.forEach((ref) => observer.observe(ref));

    // Cleanup function using the stored ref value
    return () => {
      const refsToUnobserve = Object.values(currentRefs).filter(ref => ref !== null) as Element[];
      refsToUnobserve.forEach((ref) => {
        if (ref) { // Check if ref still exists before unobserving
           observer.unobserve(ref);
        }
      });
    };
    // No dependency on categoryRefs.current as it's a mutable ref object
  }, []); // Dependencies should include anything from the outer scope used inside, if needed, but not the ref itself.

  // Ref callback function
  const setCategoryRef = (el: HTMLDivElement | null, categoryName: string) => {
    categoryRefs.current[categoryName] = el;
  };

  // For debugging
  console.log("Current language:", lang);
  console.log("Current pathname:", pathname);
  console.log("menuData.drinkCategories:", menuData.drinkCategories);
  console.log("filteredDrinkCategories:", filteredDrinkCategories);

  // Loading state
  if (isMenuLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">
              {lang === 'en' ? 'Loading menu...' : 'Lade Speisekarte...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (menuLoadError) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">
              {lang === 'en' ? 'Error loading menu' : 'Fehler beim Laden der Speisekarte'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              {lang === 'en' ? 'Retry' : 'Erneut versuchen'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Category Navigation - FIXED POSITIONING */}
      <div className="mb-4 sm:mb-8 sticky top-[76px] md:top-[80px] z-20 bg-background-secondary p-2 sm:p-4 rounded-lg shadow-md mt-2">
        {/* Search Bar - FIXED FOR VISIBILITY */}
        <div className="relative w-full md:w-64 mb-3 md:mb-4 ml-auto">
          <input
            type="text"
            placeholder={lang === 'en' ? "Search menu..." : "Speisekarte durchsuchen..."}
            className="w-full pr-10 pl-3 sm:pl-4 py-2 text-base sm:text-base border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            style={{ minHeight: '44px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">🔍</span>
        </div>
        {/* Category Tabs with Icons - MOBILE OPTIMIZED */}
        <div className="relative">
          {/* Left scroll arrow */}
          {canScrollLeft && (
            <button
              type="button"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background-secondary rounded-full p-1 shadow hover:bg-primary/10 transition"
              aria-label={lang === 'en' ? 'Scroll left' : 'Nach links scrollen'}
              onClick={() => {
                const scroller = categoryBarRef.current;
                if (scroller) scroller.scrollBy({ left: -180, behavior: 'smooth' });
              }}
            >
              <span className="text-xl">◀</span>
            </button>
          )}
          {/* Scrollable tab bar - MOBILE OPTIMIZED */}
          <div
            id="menu-category-tabs"
            ref={categoryBarRef}
            className="flex overflow-x-auto space-x-2 sm:space-x-3 px-6 relative scrollbar-none hide-scrollbar"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {allCategories.map((category) => {
              const isActive = activeCategory === category.name.en;
              return (
                <button
                  key={category.name.en}
                  data-category={category.name.en}
                  className={`relative flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap rounded-full transition-colors flex-shrink-0 font-medium shadow-sm border border-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? 'bg-primary text-white shadow-lg scale-105' 
                      : 'bg-background-tertiary hover:bg-primary/10'
                  }`}
                  style={{ scrollSnapAlign: 'center' }}
                  role="tab"
                  tabIndex={0}
                  onClick={() => scrollToCategory(category.name.en)}
                >
                  <span className="hidden sm:inline">{getCategoryIcon(category.name.en)}</span>
                  {category.name[lang]}
                  {isActive && (
                    <span className="absolute left-2 right-2 -bottom-1 h-1 rounded-full bg-white/70">
                      <span className="block w-full h-full bg-primary rounded-full transition-all duration-300" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {/* Right scroll arrow */}
          {canScrollRight && (
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background-secondary rounded-full p-1 shadow hover:bg-primary/10 transition"
              aria-label={lang === 'en' ? 'Scroll right' : 'Nach rechts scrollen'}
              onClick={() => {
                const scroller = categoryBarRef.current;
                if (scroller) scroller.scrollBy({ left: 180, behavior: 'smooth' });
              }}
            >
              <span className="text-xl">▶</span>
            </button>
          )}
          {/* Gradient fade left */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background-secondary to-transparent z-10" />
          {/* Gradient fade right */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background-secondary to-transparent z-10" />
        </div>
      </div>

      {/* Food & Drinks Menu - MOBILE OPTIMIZED */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-8 text-center">{lang === 'en' ? 'Food Menu' : 'Speisekarte'}</h2>
        <div className="space-y-6 sm:space-y-12">
          {filteredFoodCategories.map((category) => (
            categoryHasMatchingItems(category) && (
              <div 
                key={category.name.en} 
                id={category.name.en}
                ref={(el) => setCategoryRef(el, category.name.en)}
                className="border border-border rounded-2xl overflow-hidden scroll-mt-32 bg-white shadow-md"
              >
                <div className="p-3 sm:p-6 bg-primary/10 flex items-center gap-2 sm:gap-3 border-b border-primary/20">
                  {getCategoryIcon(category.name.en)}
                  <h4 className="text-xl sm:text-2xl font-semibold text-primary mb-0">{category.name[lang]}</h4>
                </div>
                <div className="divide-y divide-border">
                  {filterMenuItems(category.items).map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr_auto] gap-1 sm:gap-4 py-3 px-3 sm:py-4 sm:px-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                          <h5 className="text-base sm:text-lg font-bold text-primary">
                            <span className="inline-block min-w-[28px] text-sm font-normal bg-primary/10 text-primary px-1.5 rounded mr-1.5">
                              {item.id}
                            </span>
                            {item.name[lang]}
                          </h5>
                          {/* Dietary Tags */}
                          {renderDietaryTags(item)}
                          {/* Spice Level */}
                          {renderSpiceLevel(item)}
                        </div>
                        <p className="text-muted-foreground text-xs sm:text-sm mb-0 pl-[calc(28px+0.75rem)]">{item.description[lang]}</p>
                      </div>
                      <div className="text-base sm:text-lg font-semibold text-primary self-start justify-self-end">{formatPrice(item.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
      <div className="mt-6 sm:mt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-8 text-center">{lang === 'en' ? 'Drinks Menu' : 'Getränkekarte'}</h2>
        <div className="space-y-6 sm:space-y-12">
          {filteredDrinkCategories.map((category) => (
            categoryHasMatchingItems(category) && (
              <div 
                key={category.name.en} 
                id={category.name.en}
                ref={(el) => setCategoryRef(el, category.name.en)}
                className="border border-border rounded-2xl overflow-hidden scroll-mt-32 bg-white shadow-md"
              >
                <div className="p-3 sm:p-6 bg-primary/10 flex items-center gap-2 sm:gap-3 border-b border-primary/20">
                  {getCategoryIcon(category.name.en)}
                  <h4 className="text-xl sm:text-2xl font-semibold text-primary mb-0">{category.name[lang]}</h4>
                </div>
                <div className="divide-y divide-border">
                  {filterMenuItems(category.items).map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr_auto] gap-1 sm:gap-4 py-3 px-3 sm:py-4 sm:px-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                          <h5 className="text-base sm:text-lg font-bold text-primary">
                            <span className="inline-block min-w-[28px] text-sm font-normal bg-primary/10 text-primary px-1.5 rounded mr-1.5">
                              {item.id}
                            </span>
                            {item.name[lang]}
                          </h5>
                          {/* Dietary Tags */}
                          {renderDietaryTags(item)}
                          {/* Spice Level */}
                          {renderSpiceLevel(item)}
                        </div>
                        <p className="text-muted-foreground text-xs sm:text-sm mb-0 pl-[calc(28px+0.75rem)]">{item.description[lang]}</p>
                      </div>
                      <div className="text-base sm:text-lg font-semibold text-primary self-start justify-self-end">{formatPrice(item.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuComponent;
