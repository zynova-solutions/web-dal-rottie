import React from 'react';
import { 
  FaUtensils, 
  FaWineGlassAlt, 
  FaBeer, 
  FaGlassWhiskey, 
  FaCocktail, 
  FaCoffee, 
  FaMugHot, 
  FaLeaf,
  FaBreadSlice,
  FaChair,
  FaMortarPestle
} from 'react-icons/fa';
import { GiBowlOfRice, GiCoolSpices, GiSaucepan, GiChickenLeg, GiCakeSlice } from 'react-icons/gi';
import { MdLocalDrink, MdEmojiFoodBeverage } from 'react-icons/md';
import { BiSolidDrink } from 'react-icons/bi';

// Get appropriate icon for given category name
export const getCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    // Food categories with updated icons
    case 'Chaat & Snacks':
      return <GiCoolSpices />;
    case 'Soups & Salads':
      return <GiSaucepan />;
    case 'Tandoori Specialties':
      return <GiChickenLeg />;
    case 'Main Course - Non-Vegetarian':
      return <FaUtensils />;
    case 'Main Course - Vegetarian':
      return <FaLeaf />;
    case 'Rice & Biryani':
      return <GiBowlOfRice />;
    case 'Breads':
      return <FaBreadSlice />;
    case 'Sides':
      return <FaChair />;
    case 'Chutneys':
      return <FaMortarPestle />;
    case 'Desserts':
      return <GiCakeSlice />;
    
    // Drink categories
    case 'Beer':
      return <FaBeer />;
    case 'Shots':
    case 'Whiskey':
    case 'Rum':
      return <FaGlassWhiskey />;
    case 'Cocktails':
      return <FaCocktail />;
    case 'Soft Drinks':
    case 'Juice':
      return <MdLocalDrink />;
    case 'Wine':
    case 'Sparkling Wine':
      return <FaWineGlassAlt />;
    case 'Alcohol-Free Cocktails':
      return <BiSolidDrink />;
    case 'Coffee':
      return <FaCoffee />;
    case 'Tea':
      return <FaMugHot />;
    case 'Homemade':
      return <MdEmojiFoodBeverage />;
    
    // Default
    default:
      return <FaUtensils />;
  }
};
