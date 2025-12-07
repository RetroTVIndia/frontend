"use client";

import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/config";

interface Category {
  name: string;
  youtube_url_links: number;
}

interface Props {
  selectedCategories: string[];
  onSelectCategories: (categories: string[]) => void;
}

export function CategorySelector({
  selectedCategories,
  onSelectCategories,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${BACKEND_URL}/categories`);
      if (!res.ok) {
        alert("Failed to fetch categories");
        return;
      }
      // Backend returns an array of objects with name and youtube_url_links
      const data = (await res.json()) as Category[];
      setCategories(data);
      // Set all categories as selected by default (only once)
      if (
        data.length > 0 &&
        !hasInitialized &&
        selectedCategories.length === 0
      ) {
        // Extract category names for the selected categories
        const categoryNames = data.map((cat) => cat.name);
        onSelectCategories(categoryNames);
        setHasInitialized(true);
      }
    };
    void fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleCategoryToggle = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      // If all categories are selected and we're deselecting one, deselect it
      onSelectCategories(
        selectedCategories.filter((cat) => cat !== categoryName),
      );
    } else {
      // Add the category to selected
      onSelectCategories([...selectedCategories, categoryName]);
    }
  };

  const handleSelectAll = () => {
    const allCategoryNames = categories.map((cat) => cat.name);
    onSelectCategories(allCategoryNames);
  };

  const handleSelectNone = () => {
    onSelectCategories([]);
  };

  const allSelected =
    categories.length > 0 &&
    categories.every((cat) => selectedCategories.includes(cat.name));
  const noneSelected = selectedCategories.length === 0;

  return (
    <div className="items-left mt-10 mb-4 flex w-full flex-col flex-wrap justify-start px-10 py-5">
      <div className="mx-2 flex w-full">
        <div className="flex items-end gap-3">
          <span className="sections-header m-0 p-0 text-3xl">CATEGORIES:</span>
          <span className="text-gray-50/40 italic">
            (SELECT NONE FOR RANDOM ACROSS ALL CATEGORIES)
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            disabled={allSelected}
            className={`text-lg italic ${
              allSelected
                ? "cursor-not-allowed text-green-500"
                : "cursor-pointer text-white underline"
            }`}
          >
            Select All
          </button>
          <span className="text-white">|</span>
          <button
            onClick={handleSelectNone}
            disabled={noneSelected}
            className={`text-lg italic ${
              noneSelected
                ? "cursor-not-allowed text-green-500"
                : "cursor-pointer text-white underline"
            }`}
          >
            Select None
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 rounded-2xl bg-white/20 p-5">
        {categories.map((cat) => (
          <label
            key={cat.name}
            className="flex cursor-pointer items-center text-xl text-white italic"
          >
            <input
              type="checkbox"
              name="category"
              value={cat.name}
              checked={selectedCategories.includes(cat.name)}
              onChange={() => handleCategoryToggle(cat.name)}
              className="mr-2 h-4 w-4"
            />
            {cat.name.replaceAll("_", " ")} {`(${cat.youtube_url_links})`}
          </label>
        ))}
      </div>
    </div>
  );
}
