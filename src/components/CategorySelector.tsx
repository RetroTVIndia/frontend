"use client";

import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/config";

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategorySelector({
  selectedCategory,
  onSelectCategory,
}: Props) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${BACKEND_URL}/categories`);
      if (!res.ok) {
        alert("Failed to fetch categories");
        return;
      }
      // Assuming the backend returns an array of strings
      const data: string[] = await res.json();
      setCategories(data);
    };
    void fetchCategories();
  }, []);

  return (
    <div className="mb-4 flex flex-wrap gap-4">
      {categories.map((cat) => (
        <label key={cat} className="cursor-pointer">
          <input
            type="radio"
            name="category"
            value={cat}
            checked={selectedCategory === cat}
            onChange={() => onSelectCategory(cat)}
            className="mr-2"
          />
          {cat}
        </label>
      ))}
    </div>
  );
}
