export function isPositionOccupiedError(err) {
  return (
    err?.response?.status === 409 &&
    err?.response?.data?.error === "POSITION_OCCUPIED"
  );
}
