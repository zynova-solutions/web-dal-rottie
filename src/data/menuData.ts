export type MenuItem = {
  id: number;
  name: {
    en: string;
    de: string;
  };
  price: string;
  description: {
    en: string;
    de: string;
  };
  dietary: {
    glutenFree?: boolean;
    vegan?: boolean;
    dairyFree?: boolean;
    vegetarian?: boolean;
    nonVegetarian?: boolean;
    containsNuts?: boolean;
  };
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'super-hot';
};

export type Category = {
  name: {
    en: string;
    de: string;
  };
  items: MenuItem[];
};

// Initialize with empty arrays - will be populated from CSV (kept for backward compatibility)
export const foodCategories: Category[] = [];
export const drinkCategories: Category[] = [];

// Flag to track if data has been loaded
let dataLoaded = false;

// Function to load menu data from CSV
export const initializeMenuData = async (): Promise<void> => {
  if (dataLoaded) return; // Prevent multiple loads
  
  try {
    const { loadMenuFromCSV } = await import('@/utils/csvMenuLoader');
    const { foodCategories: loadedFood, drinkCategories: loadedDrinks } = await loadMenuFromCSV();
    
    // Update the exported arrays
    foodCategories.length = 0;
    drinkCategories.length = 0;
    foodCategories.push(...loadedFood);
    drinkCategories.push(...loadedDrinks);
    
    dataLoaded = true;
    console.log('Menu data loaded from CSV successfully');
  } catch (error) {
    console.error('Failed to load menu from CSV, using fallback data:', error);
    
    // Use fallback data
    foodCategories.length = 0;
    drinkCategories.length = 0;
    foodCategories.push(...fallbackFoodCategories);
    drinkCategories.push(...fallbackDrinkCategories);
    
    dataLoaded = true;
  }
};

// Function to get menu data (loads if not already loaded)
export const getMenuData = async (): Promise<{ foodCategories: Category[], drinkCategories: Category[] }> => {
  if (!dataLoaded) {
    await initializeMenuData();
  }
  return { foodCategories, drinkCategories };
};

// Static fallback data in case CSV loading fails
const fallbackFoodCategories: Category[] = [
  {
    name: {
      en: 'Chaat & Snacks',
      de: 'Chaat und Snacks'
    },
    items: [
      { 
        id: 1, 
        name: {
          en: 'Aloo Tikki Chaat',
          de: 'Aloo Tikki Chaat'
        }, 
        price: '€6.90', 
        description: {
          en: 'Crispy potato patties, garnished with spiced yogurt, chutneys, and spices.',
          de: 'Knusprige Kartoffelpästchen, garniert mit würzigem Joghurt, Chutneys und Gewürzen.'
        },
        dietary: {
          glutenFree: true,
          vegetarian: true
        }
      },
      { 
        id: 2, 
        name: {
          en: 'Samosa Chaat',
          de: 'Samosa Chaat'
        }, 
        price: '€6.90', 
        description: {
          en: 'Spicy samosas, broken into pieces and mixed with yogurt and chutneys.',
          de: 'Pikante Samosas, zerteilt und gemischt mit Joghurt und Chutneys.'
        },
        dietary: {
          glutenFree: true,
          vegetarian: true
        }
      }
    ]
  }
];

const fallbackDrinkCategories: Category[] = [
  {
    name: {
      en: 'Beverages',
      de: 'Getränke'
    },
    items: [
      {
        id: 91,
        name: {
          en: 'Mango Lassi',
          de: 'Mango Lassi'
        },
        price: '€4.50',
        description: {
          en: 'Traditional yogurt drink with mango.',
          de: 'Traditionelles Joghurtgetränk mit Mango.'
        },
        dietary: {
          vegetarian: true
        }
      }
    ]
  }
];
