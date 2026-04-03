import { useState } from "react";
import { createWineWithBottle } from "../../../api/wineApi";

export function useWineWithBottleForm() {
  const [wineWithBottleForm, setWineWithBottleForm] = useState({
    wine: {
      name: "",
      vintage: "",
      wine_type_id: "",
      country_id: "",
      region_id: "",
      producer: "",
    },
    bottle: {
      row_number: "",
      column_number: "",
      note: "",
    },
  });
  const [creatingWineWithBottle, setCreatingWineWithBottle] = useState(false);

  const resetForm = () => {
    setWineWithBottleForm({
      wine: {
        name: "",
        vintage: "",
        wine_type_id: "",
        country_id: "",
        region_id: "",
        producer: "",
      },
      bottle: {
        row_number: "",
        column_number: "",
        note: "",
      },
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreatingWineWithBottle(true);

    try {
      const wine = wineWithBottleForm.wine;
      const bottle = wineWithBottleForm.bottle;

      const requestData = {
        wine: {
          name: wine.name,
          vintage: wine.vintage ? Number(wine.vintage) : null,
          wine_type_id: wine.wine_type_id ? Number(wine.wine_type_id) : null,
          country_id: wine.country_id ? Number(wine.country_id) : null,
          region_id: wine.region_id ? Number(wine.region_id) : null,
          producer: wine.producer,
        },
        bottle: {
          row_number: bottle.row_number ? Number(bottle.row_number) : null,
          column_number: bottle.column_number
            ? Number(bottle.column_number)
            : null,
          note: bottle.note || "",
        },
      };

      await createWineWithBottle(requestData);
      resetForm();
      return true;
    } catch (err) {
      throw err;
    } finally {
      setCreatingWineWithBottle(false);
    }
  };

  return {
    wineWithBottleForm,
    setWineWithBottleForm,
    creatingWineWithBottle,
    resetForm,
    handleCreate,
  };
}
