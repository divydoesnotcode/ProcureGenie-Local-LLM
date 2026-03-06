"use client";

import React from "react";
import { Button } from "./stateful-button";

export function StatefulButtonDemo({ onSearch, query, loading }) {
  // Returns a Promise so the stateful-button animates until resolved
  const handleClick = () => {
    return new Promise(async (resolve) => {
      try {
        await onSearch(query);
      } finally {
        resolve();
      }
    });
  };

  return (
    <div className="flex w-full items-center justify-center pb-20">
      <Button onClick={handleClick} disabled={loading}>
        {loading ? "Searching..." : "Find Vendors"}
      </Button>
    </div>
  );
}
