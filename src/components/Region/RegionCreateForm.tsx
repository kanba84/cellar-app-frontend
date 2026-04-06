import React, { useEffect, useState } from "react";
import { fetchCountries } from "../../api/countryApi";
import { fetchRegions } from "../../api/regionApi";
import { createRegion } from "../../api/regionApi";

function RegionCreateForm({ onCreated }) {
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [parentId, setParentId] = useState("");
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCountries().then(setCountries);
    fetchRegions().then(setRegions);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createRegion({
        name,
        country_id: countryId ? Number(countryId) : null,
        parent_id: parentId ? Number(parentId) : null,
      });
      setName("");
      setCountryId("");
      setParentId("");
      if (onCreated) onCreated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          地域名:{" "}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          国:
          <select
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
          >
            <option value="">選択してください</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          親地域（サブリージョンの場合のみ）:
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            <option value="">なし</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" disabled={loading}>
        追加
      </button>
    </form>
  );
}

export default RegionCreateForm;
