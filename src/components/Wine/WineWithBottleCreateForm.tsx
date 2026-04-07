
import WineCreateForm from "./WineCreateForm";
import BottleCreateForm from "../../features/bottles/components/BottleCreateForm";
import { Box, Button, Stack } from "@mui/material";

function WineWithBottleCreateForm({ form, creating, onChange, onSubmit }: any) {
  return (
    <Box sx={{ fontSize: { xs: 10, sm: 14 } }}>
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          {/* ワイン入力フォーム */}
          <WineCreateForm
            wineForm={form.wine}
            creatingWine={creating}
            onChange={(wineForm) => onChange({ ...form, wine: wineForm })}
            showSubmitButton={false}
          />
          {/* ボトル入力フォーム */}
          <BottleCreateForm
            form={form.bottle}
            creating={creating}
            wines={[]}
            onChange={(bottleForm) => onChange({ ...form, bottle: bottleForm })}
            onSubmit={() => {}}
            hideWineSelect
            showSubmitButton={false}
          />
          <Button type="submit" variant="contained" disabled={creating}>
            {creating ? "追加中..." : "追加"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default WineWithBottleCreateForm;
