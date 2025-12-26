 import Papa from 'papaparse';
import { MenuItem, Category } from '@/data/menuData';

export interface MenuItemCSV {
  id: string;
  category_en: string;
  category_de: string;
  name_en: string;
  name_de: string;
  price: string;
  description_en: string;
  description_de: string;
  gluten_free: string;
  vegan: string;
  dairy_free: string;
  vegetarian: string;
  non_vegetarian: string;
  spice_level: string;
  contains_nuts: string;
}

// Convert CSV boolean strings to actual booleans
const parseBooleanField = (value: string): boolean => {
  return value?.toUpperCase() === 'TRUE';
};

// Convert CSV row to MenuItem
const csvRowToMenuItem = (row: MenuItemCSV): MenuItem => {
  return {
    id: parseInt(row.id),
    name: {
      en: row.name_en,
      de: row.name_de,
    },
    price: row.price,
    description: {
      en: row.description_en,
      de: row.description_de,
    },
    dietary: {
      glutenFree: parseBooleanField(row.gluten_free) || undefined,
      vegan: parseBooleanField(row.vegan) || undefined,
      dairyFree: parseBooleanField(row.dairy_free) || undefined,
      vegetarian: parseBooleanField(row.vegetarian) || undefined,
      nonVegetarian: parseBooleanField(row.non_vegetarian) || undefined,
      containsNuts: parseBooleanField(row.contains_nuts) || undefined,
    },
    spiceLevel: (row.spice_level && row.spice_level !== 'FALSE') ? (row.spice_level as 'mild' | 'medium' | 'hot' | 'super-hot') : undefined,
  };
};

// Main function to load menu data from CSV
export const loadMenuFromCSV = async (): Promise<{
  foodCategories: Category[];
  drinkCategories: Category[];
}> => {
  try {
    // Fetch CSV data from secure API route
    const response = await fetch('/api/menu-data');
    if (!response.ok) {
      throw new Error(`Failed to fetch menu data: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    // Parse CSV
    const parseResult = Papa.parse<MenuItemCSV>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (parseResult.errors.length > 0) {
      console.error('CSV parsing errors:', parseResult.errors);
    }

    // Convert CSV rows to MenuItem objects, storing original CSV data
    type MenuItemWithCSVData = MenuItem & { csvRow: MenuItemCSV };
    
    const menuItemsWithCsvData: MenuItemWithCSVData[] = parseResult.data.map((csvRow) => {
      const menuItem = csvRowToMenuItem(csvRow);
      // Attach CSV data for category grouping
      return { ...menuItem, csvRow } as MenuItemWithCSVData;
    });

    // Separate food and drink categories
    const foodItems = menuItemsWithCsvData.filter(item => {
      const csvRow = item.csvRow;
      return !csvRow.category_en.toLowerCase().includes('beverages') && 
             !csvRow.category_en.toLowerCase().includes('soft drinks');
    });

    const drinkItems = menuItemsWithCsvData.filter(item => {
      const csvRow = item.csvRow;
      return csvRow.category_en.toLowerCase().includes('beverages') || 
             csvRow.category_en.toLowerCase().includes('soft drinks');
    });

    // Group items by category
    const foodCategories = groupItemsByCategoryFromCSV(foodItems);
    const drinkCategories = groupItemsByCategoryFromCSV(drinkItems);

    return {
      foodCategories,
      drinkCategories,
    };

  } catch (error) {
    console.error('Error loading menu from CSV:', error);
    // Return empty categories on error
    return {
      foodCategories: [],
      drinkCategories: [],
    };
  }
};

// Helper function to group items with CSV data
type MenuItemWithCSV = MenuItem & { csvRow?: MenuItemCSV };

const groupItemsByCategoryFromCSV = (menuItems: MenuItem[]): Category[] => {
  const categoryMap = new Map<string, { 
    name: { en: string; de: string }, 
    items: MenuItem[] 
  }>();

  menuItems.forEach((item) => {
    const itemWithCSV = item as MenuItemWithCSV;
    const csvRow = itemWithCSV.csvRow;
    
    if (!csvRow) return;
    
    const categoryKey = csvRow.category_en;
    
    if (!categoryMap.has(categoryKey)) {
      categoryMap.set(categoryKey, {
        name: {
          en: csvRow.category_en,
          de: csvRow.category_de,
        },
        items: [],
      });
    }

    // Clean up the item by removing csvRow data
    const cleanItem = { ...item };
    delete (cleanItem as MenuItemWithCSV).csvRow;
    
    categoryMap.get(categoryKey)!.items.push(cleanItem);
  });

  return Array.from(categoryMap.values()).map(({ name, items }) => ({
    name,
    items: items.sort((a, b) => a.id - b.id), // Sort by ID
  }));
};

// Fallback data in case CSV loading fails
export const fallbackMenuData = {
  foodCategories: [] as Category[],
  drinkCategories: [] as Category[],
};