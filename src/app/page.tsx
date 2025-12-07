"use client";

import { useState } from "react";
import { CategorySelector } from "@/components/CategorySelector";
import TV from "@/components/TV/TV";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mt-6 w-full">
          <TV category={selectedCategory} />
        </div>

        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>
    </>
  );
}
