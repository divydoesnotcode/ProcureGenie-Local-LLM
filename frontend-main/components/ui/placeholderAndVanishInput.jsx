"use client";

import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { CoverDemo } from "./coverDemo";

export function PlaceholdersAndVanishInputDemo({ onSearch, query, setQuery }) {
  const placeholders = [
    "Find laptop vendors in Delhi",
    "Search mobile dealers near Mumbai",
    "Office furniture suppliers in Bangalore",
    "Find stationery vendors nearby",
    "Search electronics wholesalers in Chennai",
  ];

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="pt-20 pb-10 flex flex-col justify-center items-center px-4">
      <CoverDemo />
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
