// Menu Management UI for Categories, Dishes, Variants, Add-ons
// Scaffolding for admin menu management (mock, no backend yet)

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon, DocumentDuplicateIcon, PhotoIcon } from "@heroicons/react/24/outline";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  DragEndEvent,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { adminPost, adminGet } from "@/services/adminApi";
import { updateDish, deleteDish, updateDishStatus } from "@/services/dishApi";
import { deleteCategory } from "@/services/categoryApi";
import Image from "next/image";

// Define types for state variables
interface Category {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Variant {
  size: string;
  price: number;
}

// Updated Dish interface to include all necessary properties
interface Dish {
  id: number;
  name: string;
  categoryId: number;
  categoryName?: string;
  description?: string;
  isVeg?: boolean;
  spiceLevel?: string;
  allergens?: string;
  prepTime?: string;
  mrp?: number;
  price?: number;
  discount?: number;
  vatPercentage?: number;
  available?: boolean;
  soldOut?: boolean;
  soldOutReason?: string;
  soldOutDate?: string;
  variants?: Variant[];
  addons?: string[];
  photoUrl?: string;
  updatedAt?: string;
  img?: string;
  spice?: string;
  vat?: number;
  gst?: number; // Legacy support, use vat instead
  photoPreview?: string;
  addonsInput?: string;
  prep?: string; // Added missing property
  veg?: boolean; // Added missing property
  soldOutUntil?: string; // Added missing property
}

import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function MenuManagementUI() {
  // State
  const [showCategoriesMobile, setShowCategoriesMobile] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [drawer, setDrawer] = useState<null | { mode: string; dish?: Dish }>(null);
  const [dishForm, setDishForm] = useState<Partial<Dish> | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [dishLoading, setDishLoading] = useState(false);
  const [dishError, setDishError] = useState("");
  const [dishPhoto, setDishPhoto] = useState<File | null>(null);

  // dnd-kit drag reorder
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Fetch categories and all dishes from backend on mount
  useEffect(() => {
    async function fetchCategoriesAndDishes() {
      try {
        // First fetch categories
        const res = await adminGet("/api/categories/getall");
        let categoriesData: Category[] = [];
        if (Array.isArray(res.data)) {
          // Transform backend categories to extract English name (admin panel uses English)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          categoriesData = res.data.map((cat: any) => ({
            id: cat.id,
            name: typeof cat.name === 'object' ? (cat.name.en || cat.name.de || '') : cat.name,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
          }));
          setCategories(categoriesData);
          if (categoriesData.length > 0) {
            setSelectedCategory(categoriesData[0].id);
          }
        }
        
        // Then fetch all dishes
        const dishRes = await adminGet(`/api/dishes/getall`);
        if (dishRes.data && typeof dishRes.data === 'object') {
          // Backend returns dishes grouped by category name
          // Convert to flat array with proper mapping
          const flatDishes = Object.entries(dishRes.data).flatMap(([catName, arr]) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Array.isArray(arr) ? arr.map((d: any) => {
              // Extract English name from multilingual object
              const dishName = typeof d.name === 'object' ? (d.name.en || d.name.de || '') : d.name;
              const dishDesc = typeof d.description === 'object' ? (d.description.en || d.description.de || '') : (d.desc || d.description || '');
              
              return {
                id: d.dishId,  // Map dishId to id
                name: dishName,
                categoryId: categoriesData.find(c => c.name === catName)?.id || 0, // Match category by name
                categoryName: catName,
                description: dishDesc,
                price: d.price,
                photoUrl: d.img || d.photoUrl,
                isVeg: d.isVeg,
                spiceLevel: d.spiceLevel,
                allergens: d.allergens,
                prepTime: d.prepTime,
                mrp: d.mrp,
                discount: d.discount,
                vatPercentage: d.vatPercentage,
                available: d.available !== false, // Default to true if not specified
                soldOut: d.soldOut || false,
                soldOutReason: d.soldOutReason,
                soldOutDate: d.soldOutDate,
                variants: d.variants,
                addons: d.addons,
              };
            }) : []
          );
          setDishes(flatDishes);
        } else {
          setDishes([]);
        }
      } catch (err) {
        console.error("Error fetching categories and dishes", err);
      }
    }
    fetchCategoriesAndDishes();
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === Number(active.id));
      const newIndex = categories.findIndex((c) => c.id === Number(over.id));
      setCategories((items) => arrayMove(items, oldIndex, newIndex));
    }
  }

  function SortableCategory({ cat, selectedCategory, setSelectedCategory }: { cat: Category; selectedCategory: number | null; setSelectedCategory: (id: number) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });
    return (
      <li
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
        }}
        className={`mb-2 p-2 rounded cursor-pointer select-none ${selectedCategory === cat.id ? "bg-[#f3e8e8]" : "hover:bg-gray-50"} flex justify-between items-center group`}
      >
        <span 
          {...attributes}
          {...listeners}
          className="font-semibold flex-1"
          onClick={() => setSelectedCategory(cat.id)}
        >
          {cat.name}
        </span>
        <button
          className="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCategory(cat.id);
          }}
          title="Delete category"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </li>
    );
  }

  // Open drawer for add/edit
  function openDishDrawer(mode: 'create' | 'edit', dish?: Dish) {
    setDrawer({ mode, dish });
    if (mode === 'edit' && dish) {
      setDishForm({
        name: dish.name || '',
        categoryId: dish.categoryId || selectedCategory || categories[0]?.id || 1,
        description: dish.description || '',
        isVeg: dish.isVeg ?? true,
        spiceLevel: dish.spiceLevel || 'Mild',
        allergens: dish.allergens || '',
        prepTime: dish.prepTime || '',
        price: dish.price || 0,
        discount: dish.discount || 0,
        vatPercentage: dish.vatPercentage || 0,
        available: dish.available ?? true,
        soldOut: dish.soldOut ?? false,
        soldOutReason: dish.soldOutReason || '',
        soldOutDate: dish.soldOutDate || '',
        variants: dish.variants || [],
        addons: dish.addons || [],
        photoUrl: dish.photoUrl || '',
      });
    } else {
      setDishForm({
        name: '',
        categoryId: selectedCategory || categories[0]?.id || 1,
        description: '',
        isVeg: true,
        spiceLevel: 'Mild',
        allergens: '',
        prepTime: '',
        price: 0,
        discount: 0,
        vatPercentage: 0,
        available: true,
        soldOut: false,
        soldOutReason: '',
        soldOutDate: '',
        variants: [],
        addons: [],
        photoUrl: '',
      });
    }
  }

  // Handle form field changes
  function handleDishFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setDishForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  // Handle photo upload
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setDishPhoto(file);
      setDishForm((prev) => ({
        ...prev,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  }

  // Handle submit
  async function handleDishFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dishForm || !drawer) return;

    setDishLoading(true);
    setDishError("");
    if (drawer.mode === 'create') {
      try {
        const formData = new FormData();
        formData.append('name', dishForm.name || "");
        formData.append('categoryId', String(dishForm.categoryId || ""));
        formData.append('description', dishForm.description || "");
        formData.append('isVeg', String(dishForm.isVeg || false));
        formData.append('spiceLevel', dishForm.spice || "");
        formData.append('prepTime', dishForm.prep || "");
        formData.append('allergens', dishForm.allergens || "");
        formData.append('mrp', String(dishForm.mrp || 0));
        formData.append('discount', String(dishForm.discount || 0));
        formData.append('vatPercentage', String(dishForm.vatPercentage || 0));
        formData.append('available', String(dishForm.available || false));
        formData.append('soldOut', String(dishForm.soldOut || false));
        formData.append('soldOutReason', dishForm.soldOutReason || "");
        formData.append('soldOutDate', dishForm.soldOutDate || "");
        formData.append('variants', JSON.stringify(dishForm.variants || []));
        formData.append('addons', JSON.stringify(dishForm.addons || []));
        if (dishPhoto) formData.append('photo', dishPhoto);

        const res = await adminPost<FormData, { data: Dish }>('/api/dishes/create', formData, undefined, true);
        // Add the new dish to the list if it matches the selected category
        if (res.data && res.data.categoryId === selectedCategory) {
          setDishes(prev => [res.data, ...prev]);
        }
        setDrawer(null);
        setDishForm(null);
        setDishPhoto(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setDishError(err.message);
        } else {
          setDishError('An unknown error occurred.');
        }
      } finally {
        setDishLoading(false);
      }
    } else if (drawer.mode === 'edit' && drawer.dish) {
      await handleDishUpdate(drawer.dish.id);
    }
  }

  async function handleDishUpdate(dishId: number) {
    if (!dishForm) return;
    
    setDishLoading(true);
    setDishError("");
    
    try {
      const formData = new FormData();
      if (dishForm.name) formData.append('name', dishForm.name);
      if (dishForm.categoryId) formData.append('categoryId', String(dishForm.categoryId));
      if (dishForm.description) formData.append('description', dishForm.description);
      if (dishForm.isVeg !== undefined) formData.append('isVeg', String(dishForm.isVeg));
      if (dishForm.spiceLevel) formData.append('spiceLevel', dishForm.spiceLevel);
      if (dishForm.prepTime) formData.append('prepTime', dishForm.prepTime);
      if (dishForm.allergens) formData.append('allergens', dishForm.allergens);
      if (dishForm.mrp !== undefined) formData.append('mrp', String(dishForm.mrp));
      if (dishForm.price !== undefined) formData.append('price', String(dishForm.price));
      if (dishForm.discount !== undefined) formData.append('discount', String(dishForm.discount));
      if (dishForm.vatPercentage !== undefined) formData.append('vatPercentage', String(dishForm.vatPercentage));
      if (dishForm.available !== undefined) formData.append('available', String(dishForm.available));
      if (dishForm.soldOut !== undefined) formData.append('soldOut', String(dishForm.soldOut));
      if (dishForm.soldOutReason) formData.append('soldOutReason', dishForm.soldOutReason);
      if (dishForm.soldOutDate) formData.append('soldOutDate', dishForm.soldOutDate);
      if (dishForm.variants) formData.append('variants', JSON.stringify(dishForm.variants));
      if (dishForm.addons) formData.append('addons', JSON.stringify(dishForm.addons));
      if (dishPhoto) formData.append('photo', dishPhoto);

      const res = await updateDish(dishId, formData);
      
      // Update local state
      setDishes((prev) =>
        prev.map((d) =>
          d.id === dishId ? { ...d, ...res.data } : d
        )
      );
      
      setDrawer(null);
      setDishForm(null);
      setDishPhoto(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setDishError(err.message);
      } else {
        setDishError('Failed to update dish');
      }
    } finally {
      setDishLoading(false);
    }
  }

  async function handleDeleteDish(dishId: number) {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    
    try {
      await deleteDish(dishId);
      
      // Remove from local state
      setDishes((prev) => prev.filter((d) => d.id !== dishId));
    } catch (err) {
      console.error('Failed to delete dish:', err);
      alert('Failed to delete dish. Please try again.');
    }
  }

  async function handleToggleSoldOut(dishId: number, currentSoldOut: boolean) {
    try {
      await updateDishStatus(dishId, { isSoldOut: !currentSoldOut });
      
      // Update local state
      setDishes((prev) =>
        prev.map((d) =>
          d.id === dishId ? { ...d, soldOut: !currentSoldOut } : d
        )
      );
    } catch (err) {
      console.error('Failed to update dish status:', err);
      alert('Failed to update dish status. Please try again.');
    }
  }

  async function handleDeleteCategory(categoryId: number) {
    // Check if there are dishes in this category
    const dishesInCategory = dishes.filter(d => d.categoryId === categoryId);
    if (dishesInCategory.length > 0) {
      alert(`Cannot delete category. It contains ${dishesInCategory.length} dish(es). Please move or delete the dishes first.`);
      return;
    }

    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await deleteCategory(categoryId);
      
      // Remove from local state
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      
      // If this was the selected category, select the first available
      if (selectedCategory === categoryId) {
        const remainingCategories = categories.filter(c => c.id !== categoryId);
        if (remainingCategories.length > 0) {
          setSelectedCategory(remainingCategories[0].id);
        } else {
          setSelectedCategory(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category. Please try again.');
    }
  }

  // UI
  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
      {/* Categories List */}
      <div className="w-full lg:w-1/4 bg-white rounded shadow p-3 sm:p-4">
        {/* Mobile: Heading with down arrow toggle */}
        <div className="flex justify-between items-center mb-2 lg:mb-2">
          <button
            className="flex items-center gap-1 md:hidden focus:outline-none"
            onClick={() => setShowCategoriesMobile((v) => !v)}
            type="button"
            aria-expanded={showCategoriesMobile}
          >
            <h2 className="font-bold text-base sm:text-lg">Categories</h2>
            <ChevronDownIcon
              className={`w-5 h-5 transition-transform duration-200 ${showCategoriesMobile ? 'rotate-180' : ''}`}
            />
          </button>
          {/* Desktop: Heading only */}
          <h2 className="font-bold text-base sm:text-lg hidden md:block">Categories</h2>
          <button className="bg-[#7a1313] text-white rounded p-1 hover:bg-[#a31a1a] transition" onClick={() => setShowCategoryModal(true)}>
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        {/* Categories List: Collapsible on mobile, always visible on desktop */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <ul
              className={`transition-all duration-200 md:block ${showCategoriesMobile ? 'block' : 'hidden'} md:!block`}
            >
              {categories.map((cat) => (
                <SortableCategory
                  key={cat.id}
                  cat={cat}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
      {/* Dishes Table/Cards */}
      <div className="w-full lg:w-3/4 bg-white rounded shadow p-3 sm:p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-base sm:text-lg">Dishes</h2>
          <button className="bg-[#7a1313] text-white rounded p-1 hover:bg-[#a31a1a] transition" onClick={()=>openDishDrawer('create')}>
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-3">
          {dishes
            .filter(d => {
              const cat = categories.find(c => c.id === selectedCategory);
              return cat && d.categoryName === cat.name;
            })
            .map(dish => (
              <div key={dish.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    {(dish.img || dish.photoUrl) ? (
                      <Image
                        src={dish.img || dish.photoUrl || ''}
                        alt={dish.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <PhotoIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 truncate">{dish.name}</h3>
                        <p className="text-xs text-gray-500">{dish.categoryName}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" onClick={() => openDishDrawer('edit', dish)}>
                          <PencilIcon className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDeleteDish(dish.id)}>
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs">{dish.isVeg ? "🌱" : "🍗"}</span>
                      <span className="text-sm font-semibold">€{dish.mrp?.toFixed ? dish.mrp.toFixed(2) : dish.price?.toFixed ? dish.price.toFixed(2) : dish.mrp || dish.price || 0}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${dish.available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                        {dish.available ? "Available" : "Unavailable"}
                      </span>
                      <button 
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${dish.soldOut ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`} 
                        onClick={() => handleToggleSoldOut(dish.id, dish.soldOut ?? false)}
                      >
                        {dish.soldOut ? "Sold Out" : "In Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#f3e8e8] text-[#7a1313] text-left">
                <th className="p-2">Photo</th>
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Veg</th>
                <th className="p-2">Discount</th>
                <th className="p-2">VAT%</th>
                <th className="p-2">Available</th>
                <th className="p-2">Sold-out</th>
                <th className="p-2">Updated at</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
          <tbody>
            {dishes
              .filter(d => {
                const cat = categories.find(c => c.id === selectedCategory);
                return cat && d.categoryName === cat.name;
              })
              .map(dish => (
                <tr key={dish.id} className="border-b hover:bg-[#f9fafb] text-left">
                  <td className="p-2">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      {(dish.img || dish.photoUrl) ? (
                        <Image
                          src={dish.img || dish.photoUrl || ''}
                          alt={dish.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <PhotoIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="p-2 font-semibold">{dish.name}</td>
                  <td className="p-2">{dish.categoryName || categories.find(c => c.id === dish.categoryId)?.name}</td>
                  <td className="p-2">{dish.isVeg ? "🌱" : "🍗"}</td>
                  <td className="p-2">€{dish.mrp?.toFixed ? dish.mrp.toFixed(2) : dish.price?.toFixed ? dish.price.toFixed(2) : dish.mrp || dish.price || 0}</td>
                  <td className="p-2">{dish.vatPercentage ?? dish.gst}%</td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${dish.available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>{dish.available ? "Yes" : "No"}</span>
                  </td>
                  <td className="p-2">
                    <button className={`px-2 py-0.5 rounded text-xs font-semibold ${dish.soldOut ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`} onClick={() => handleToggleSoldOut(dish.id, dish.soldOut ?? false)}>{dish.soldOut ? "Sold Out" : "Available"}</button>
                  </td>
                  <td className="p-2 text-xs">{dish.updatedAt ? new Date(dish.updatedAt).toLocaleDateString() : ""}</td>
                  <td className="p-2 flex gap-1">
                    <button className="text-xs text-blue-600 underline font-semibold" onClick={() => openDishDrawer('edit', dish)}><PencilIcon className="w-4 h-4 inline" /></button>
                    <button className="text-xs text-gray-600 underline font-semibold"><DocumentDuplicateIcon className="w-4 h-4 inline" /></button>
                    <button className="text-xs text-red-600 underline font-semibold" onClick={() => handleDeleteDish(dish.id)}><TrashIcon className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              ))}
          </tbody>
          </table>
        </div>
        
        {/* Show message only if there are truly no dishes for the selected category */}
        {(() => {
          const cat = categories.find(c => c.id === selectedCategory);
          return dishes.filter(d => cat && d.categoryName === cat.name).length === 0;
        })() && (
          <div className="p-4 text-center text-gray-400">No dishes in this category.</div>
        )}
      </div>

      {/* Dish Drawer (Quick Edit/Create) */}
      {drawer && dishForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center lg:justify-end z-50 p-4 lg:p-0">
          <div className="bg-white w-full max-w-lg lg:max-w-xl h-full lg:h-full shadow-lg p-4 sm:p-6 overflow-y-auto relative animate-slideInRight rounded-xl lg:rounded-l-xl lg:rounded-r-none border lg:border-l-4 border-[#7a1313]">
            <button className="absolute top-2 right-2 text-2xl font-bold text-[#7a1313] hover:text-red-600" onClick={() => { setDrawer(null); setDishForm(null); }}>&times;</button>
            <h2 className="text-2xl font-extrabold mb-2 text-[#7a1313]">
              {drawer.mode === 'edit' ? 'Edit Dish' : 'Add Dish'}
            </h2>
            <form className="space-y-4" onSubmit={handleDishFormSubmit}>
              {/* Photo uploader */}
              <div>
                <label className="block font-semibold mb-1">Cover Photo</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center border overflow-hidden">
                    {dishForm?.photoPreview ? (
                      <Image
                        src={dishForm.photoPreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <PhotoIcon className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="dish-photo-upload" />
                  <label htmlFor="dish-photo-upload" className="px-3 py-1 rounded bg-gray-200 text-xs cursor-pointer">Upload</label>
                </div>
              </div>
              {/* Name, Category, Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-sm">Name</label>
                  <input className="border rounded px-3 py-2 w-full text-sm" placeholder="Dish name" name="name" value={dishForm.name} onChange={handleDishFormChange} required />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-sm">Category</label>
                  <select className="border rounded px-3 py-2 w-full text-sm" name="categoryId" value={dishForm.categoryId} onChange={handleDishFormChange} required>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-sm">Description</label>
                <textarea className="border rounded px-3 py-2 w-full min-h-[60px] text-sm" placeholder="Description" name="description" value={dishForm.description} onChange={handleDishFormChange} />
              </div>
              {/* Tags, Veg/Non-veg, Spice, Allergens, Prep time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Veg/Non-veg</label>
                  <select className="border rounded px-2 py-1 w-full" name="veg" value={dishForm.veg ? 'true' : 'false'} onChange={handleDishFormChange}>
                    <option value="true">Veg</option>
                    <option value="false">Non-veg</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Spice Level</label>
                  <select className="border rounded px-2 py-1 w-full" name="spice" value={dishForm.spice} onChange={handleDishFormChange}>
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Hot">Hot</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Allergens</label>
                  <input className="border rounded px-2 py-1 w-full" placeholder="e.g. Nuts, Dairy" name="allergens" value={dishForm.allergens} onChange={handleDishFormChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Prep Time</label>
                  <input className="border rounded px-2 py-1 w-full" placeholder="e.g. 30 mins" name="prep" value={dishForm.prep} onChange={handleDishFormChange} />
                </div>
              </div>
              {/* Price, Discount, VAT, Availability */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Price</label>
                  <input type="number" className="border rounded px-2 py-1 w-full" placeholder="e.g. 9.99" name="price" value={dishForm.price} onChange={handleDishFormChange} required />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Discount %</label>
                  <input type="number" className="border rounded px-2 py-1 w-full" placeholder="e.g. 10" name="discount" value={dishForm.discount} onChange={handleDishFormChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">VAT %</label>
                  <input type="number" className="border rounded px-2 py-1 w-full" placeholder="e.g. 19" name="vat" value={dishForm.vat} onChange={handleDishFormChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Available</label>
                  <div className="flex items-center">
                    <input type="checkbox" id="available" className="accent-[#7a1313]" name="available" checked={dishForm.available} onChange={handleDishFormChange} />
                    <label htmlFor="available" className="ml-2">Yes</label>
                  </div>
                </div>
              </div>
              {/* Sold-out toggle */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="soldout" className="accent-red-600" name="soldOut" checked={dishForm.soldOut} onChange={handleDishFormChange} />
                <label htmlFor="soldout" className="font-semibold">Sold Out</label>
                <input className="border rounded px-2 py-1 text-xs" placeholder="Reason" name="soldOutReason" value={dishForm.soldOutReason} onChange={handleDishFormChange} />
                <input type="date" className="border rounded px-2 py-1 text-xs" name="soldOutUntil" value={dishForm.soldOutUntil} onChange={handleDishFormChange} />
              </div>
              {/* Tabs for Variants & Add-ons */}
              <div>
                <div className="flex gap-2 border-b mb-2">
                  <button type="button" className="px-3 py-1 text-xs font-semibold border-b-2 border-[#7a1313] text-[#7a1313]">Variants</button>
                  <button type="button" className="px-3 py-1 text-xs font-semibold text-gray-500">Add-ons</button>
                </div>
                {/* Variants Table - Remove SKU input on Add */}
                <table className="min-w-full text-xs mb-2">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-1">Size/Weight</th>
                      <th className="p-1">Price</th>
                      {/* Remove SKU column on Add */}
                      {/* <th className="p-1">SKU</th> */}
                      <th className="p-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-1"><input className="border rounded px-1 py-0.5 w-full" /></td>
                      <td className="p-1"><input className="border rounded px-1 py-0.5 w-full" /></td>
                      {/* Remove SKU input on Add */}
                      {/* <td className="p-1"><input className="border rounded px-1 py-0.5 w-full" /></td> */}
                      <td className="p-1"><button className="text-xs text-red-600 underline">Delete</button></td>
                    </tr>
                  </tbody>
                </table>
                <button type="button" className="px-2 py-1 rounded bg-gray-200 text-xs">Add Variant</button>
                {/* Add-ons Multi-select - Make editable */}
                <div className="mt-4">
                  <label className="block font-semibold mb-1">Add-ons</label>
                  <input
                    className="border rounded px-2 py-1 w-full text-xs mb-2"
                    placeholder="Add new add-on (comma separated)"
                    value={dishForm.addonsInput || ''}
                    onChange={e => setDishForm((prev) => ({ ...prev, addonsInput: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="mb-2 px-2 py-1 rounded bg-[#7a1313] text-white text-xs"
                    onClick={() => {
                      if (dishForm.addonsInput) {
                        setDishForm((prev) => ({
                          ...prev,
                          addons: [...(prev?.addons || []), prev?.addonsInput || ''],
                          addonsInput: ''
                        }));
                      }
                    }}
                  >Add</button>
                  <div className="flex flex-wrap gap-2">
                    {(dishForm.addons || []).map((addon: string, idx: number) => (
                      <span key={idx} className="bg-gray-200 px-2 py-1 rounded text-xs flex items-center gap-1">
                        {addon}
                        <button type="button" className="ml-1 text-red-600" onClick={() => setDishForm((prev) => ({
                          ...prev,
                          addons: prev?.addons?.filter((_, i) => i !== idx) || [],
                        }))}>&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Preview Card */}
              <div className="mt-6">
                <label className="block font-semibold mb-1">Preview</label>
                <div className="border rounded p-4 flex gap-4 items-center bg-gray-50">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    {dishForm?.photoPreview ? (
                      <Image
                        src={dishForm.photoPreview}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{dishForm.name || 'Dish Name'}</div>
                    <div className="text-xs text-gray-500">{categories.find(c=>c.id==dishForm.categoryId)?.name || 'Category'} • {dishForm.isVeg === false ? 'Non-veg' : 'Veg'} • €{dishForm.price || '0.00'}</div>
                    <div className="text-xs mt-1">{dishForm.description || 'Description goes here...'}</div>
                  </div>
                </div>
              </div>
              {/* Action Bar */}
              <div className="flex flex-wrap gap-2 mt-4 justify-end">
                <button type="button" className="bg-gray-200 text-[#7a1313] px-4 py-1 rounded shadow text-xs font-semibold hover:bg-gray-300" onClick={() => { setDrawer(null); setDishForm(null); }}>
                  Cancel
                </button>
                <button type="submit" className="bg-[#7a1313] text-white px-4 py-1 rounded shadow text-xs font-semibold hover:bg-[#a31a1a]" disabled={dishLoading}>
                  {dishLoading ? 'Saving...' : (drawer.mode === 'edit' ? 'Update Dish' : 'Add Dish')}
                </button>
              </div>
              {/* Show dishError if present */}
              {dishError && <div className="text-red-600 text-xs mt-2">{dishError}</div>}
            </form>
          </div>
        </div>
      )}
      {/* Category Modal */}
      <Dialog open={showCategoryModal} onClose={()=>setShowCategoryModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
          <div className="bg-white rounded-2xl shadow-2xl px-6 py-8 z-10 w-[90vw] max-w-xs sm:max-w-sm relative flex flex-col items-center">
            {/* Close Icon */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-[#7a1313] text-xl font-bold focus:outline-none"
              onClick={()=>setShowCategoryModal(false)}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <Dialog.Title className="font-extrabold text-2xl text-[#7a1313] mb-4 text-center tracking-tight">Add Category</Dialog.Title>
            <div className="w-full mb-4">
              <label htmlFor="category-name" className="block text-sm font-semibold mb-1 text-gray-700">Category Name</label>
              <input
                id="category-name"
                className="border-2 border-[#f3e8e8] rounded-lg px-3 py-2 w-full focus:outline-none focus:border-[#7a1313] transition"
                placeholder="Enter category name"
                value={categoryName}
                onChange={e=>setCategoryName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex gap-3 w-full mt-2 justify-end">
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 text-[#7a1313] font-semibold hover:bg-gray-200 transition"
                onClick={()=>setShowCategoryModal(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#7a1313] text-white font-semibold shadow hover:bg-[#a31a1a] transition disabled:opacity-60"
                onClick={async ()=>{
                  setCategoryLoading(true);
                  setCategoryError("");
                  try {
                    const res = await adminPost<{ name: string }, { data: Category }>("/api/categories/create", { name: categoryName });
                    setCategories([
                      ...categories,
                      {
                        id: res.data.id,
                        name: res.data.name,
                        createdAt: res.data.createdAt,
                        updatedAt: res.data.updatedAt
                      }
                    ]);
                    setCategoryName("");
                    setShowCategoryModal(false);
                  } catch (err: unknown) {
                    if (err instanceof Error) {
                      setCategoryError(err.message);
                    } else {
                      setCategoryError('An unknown error occurred.');
                    }
                  } finally {
                    setCategoryLoading(false);
                  }
                }}
                disabled={categoryLoading || !categoryName.trim()}
                type="button"
              >
                {categoryLoading ? "Adding..." : "Add"}
              </button>
            </div>
            {categoryError && <div className="text-red-600 text-xs mt-3 w-full text-center">{categoryError}</div>}
          </div>
           </div>
      </Dialog>
    </div>
  );
}
