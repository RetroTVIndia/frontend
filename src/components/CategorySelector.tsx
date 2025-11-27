"use client";

import { useEffect, useState } from "react";

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategorySelector({ selectedCategory, onSelectCategory }: Props) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/categories")
      .then((res) => res.json())
      .then(setCategories);
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
