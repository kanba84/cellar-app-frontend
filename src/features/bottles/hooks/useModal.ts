import { useState } from 'react';
import type { UseModalReturn } from '@/types/hook/modal';

/**
 * モーダル表示の開閉状態を管理するHook
 */
export function useModal(): UseModalReturn {
  const [showCreateBottleModal, setShowCreateBottleModal] = useState<boolean>(false);
  const [showCreateWineModal, setShowCreateWineModal] = useState<boolean>(false);

  const openCreateBottleModal = (): void => setShowCreateBottleModal(true);
  const closeCreateBottleModal = (): void => setShowCreateBottleModal(false);
  const openCreateWineModal = (): void => setShowCreateWineModal(true);
  const closeCreateWineModal = (): void => setShowCreateWineModal(false);

  return {
    showCreateBottleModal,
    openCreateBottleModal,
    closeCreateBottleModal,
    showCreateWineModal,
    openCreateWineModal,
    closeCreateWineModal,
  };
}
