import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRegions, createRegion, deleteRegion } from "../../api/regionApi";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

function RegionList({
  parentId,
  countryId,
  onRegionAddedOrDeleted,
  reloadKey,
}: {
  parentId?: any;
  countryId?: any;
  onRegionAddedOrDeleted?: any;
  reloadKey?: any;
}) {
  const [regions, setRegions] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegions().then((data) => {
      // parentIdがnullならcountry直下、そうでなければparentIdでフィルタ
      const filtered = data.filter((r) =>
        parentId === null
          ? r.country_id === countryId && r.parent_id === null
          : r.parent_id === parentId,
      );
      setRegions(filtered);
      setLoading(false);
    });
  }, [parentId, countryId, onRegionAddedOrDeleted, reloadKey]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await createRegion({
      name,
      country_id: countryId,
      parent_id: parentId ?? null,
    });
    setName("");
    if (onRegionAddedOrDeleted) onRegionAddedOrDeleted();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("このリージョンを削除しますか？")) return;
    await deleteRegion(id);
    if (onRegionAddedOrDeleted) onRegionAddedOrDeleted();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ marginLeft: parentId ? 3 : 0 }}>
      <List>
        {regions.map((region) => (
          <ListItem
            key={region.id}
            secondaryAction={
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(region.id)}
              >
                削除
              </Button>
            }
            disablePadding
          >
            <ListItemButton
              component={Link}
              to={`/config/countries/${countryId}/regions/${region.id}`}
            >
              <ListItemText primary={region.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box component="form" onSubmit={handleAdd} sx={{ mt: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="新しいリージョン名"
            size="small"
            required
            sx={{ flex: 1 }}
          />
          <Button type="submit" variant="contained" color="primary">
            追加
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default RegionList;
