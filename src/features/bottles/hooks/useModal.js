import { useState } from "react";

export function useModal() {
  const [showCreateBottleModal, setShowCreateBottleModal] = useState(false);
  const [showCreateWineModal, setShowCreateWineModal] = useState(false);

  const openCreateBottleModal = () => setShowCreateBottleModal(true);
  const closeCreateBottleModal = () => setShowCreateBottleModal(false);
  const openCreateWineModal = () => setShowCreateWineModal(true);
  const closeCreateWineModal = () => setShowCreateWineModal(false);

  return {
    showCreateBottleModal,
    openCreateBottleModal,
    closeCreateBottleModal,
    showCreateWineModal,
    openCreateWineModal,
    closeCreateWineModal,
  };
}