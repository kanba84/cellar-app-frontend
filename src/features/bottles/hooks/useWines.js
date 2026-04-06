import { useState, useEffect } from "react";
import { fetchWines } from "@/api/wineApi";

export function useWines() {
  const [wines, setWines] = useState([]);

  useEffect(() => {
    fetchWines()
      .then(setWines)
      .catch(() => setWines([]));
  }, []);

  return { wines };
}