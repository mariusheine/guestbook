import type { Guestbook } from '~/utils/guestbook';
import dayjs from 'dayjs';
import { createStore, del, get, set, values } from 'idb-keyval';
import { v7 as uuidV7 } from 'uuid';

const guestbookStore = createStore('guestbooks', 'guestbook-store');

export function useGuestbook() {
  const route = useRoute();
  const guestbookId = computed(() => route.params.guestbookId as string | undefined);

  const guestbookLoading = ref<boolean>();
  const guestbook = ref<Guestbook>();

  watch(guestbookId, async () => {
    guestbookLoading.value = true;
    try {
      if (!guestbookId.value) {
        guestbook.value = undefined;
        return;
      }
      guestbook.value = await get<Guestbook>(guestbookId.value, guestbookStore);
    }
    finally {
      guestbookLoading.value = false;
    }
  }, { immediate: true });

  async function getAvailableGuestbooks() {
    return await values<Guestbook>(guestbookStore);
  }

  async function addPage(page: Omit<Page, 'createdAt'>) {
    if (!guestbook.value) {
      throw new Error('Eintrag kann nicht eingetragen werden, da kein Gästebuch geladen ist');
    }
    const updatedGuestbook = { ...guestbook.value, pages: [...guestbook.value.pages] };
    updatedGuestbook.pages.push({ ...page, createdAt: dayjs().toISOString() });
    await set(updatedGuestbook.id, updatedGuestbook, guestbookStore);
    guestbook.value = updatedGuestbook;
  }

  async function createGuestbook(newGuestbook: Pick<Guestbook, 'title' | 'description'>) {
    const createdGuestbook = { id: uuidV7(), ...newGuestbook, pages: [] };
    await set(createdGuestbook.id, createdGuestbook, guestbookStore);
    return createdGuestbook;
  }

  async function updateGuestbook(updatedGuestbook: Guestbook) {
    await set(updatedGuestbook.id, updatedGuestbook, guestbookStore);
    guestbook.value = updatedGuestbook;
  }

  async function deleteGuestbook(guestbookToDelete: Guestbook) {
    await del(guestbookToDelete.id, guestbookStore);
    guestbook.value = undefined;
  }

  return {
    guestbookLoading,
    getAvailableGuestbooks,
    guestbook,
    addPage,
    createGuestbook,
    updateGuestbook,
    deleteGuestbook,
  };
}
