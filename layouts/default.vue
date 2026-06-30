<template>
  <div class="flex h-lvh flex-col">
    <UNavigationMenu
      :items
      class="border-b border-gray-200 dark:border-gray-800 print:hidden"
    >
      <template #list-trailing>
        <div class="flex flex-row">
          <ULink v-if="guestbook" to="/">
            Zur Startseite
          </ULink>
          <UColorModeSwitch class="mx-2.5" />
        </div>
      </template>
    </UNavigationMenu>
    <main class="flex flex-col gap-4 items-center p-8 print:gap-0 print:p-0 md:min-h-0 md:flex-1">
      <UAlert
        v-if="!openAiApiKey"
        color="error"
        title="OpenAI API Key fehlt!"
        description="Dieser Key muss gesetzt werden, damit die Bildgenerierung funktioniert!" variant="subtle"
        class="print:hidden"
        :actions="[
          {
            label: 'Zu den Einstellungen',
            to: '/settings',
          }]"
      />
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const { guestbook } = useGuestbook();

const items = computed<NavigationMenuItem[]>(() => guestbook.value
  ? [
      {
        label: `Gästebuch: ${guestbook.value.title}`,
        to: `/${guestbook.value.id}`,
      },
      {
        label: 'Neuer Gästebucheintrag',
        to: `/${guestbook.value.id}/page/new`,
      },
      {
        label: 'Drucken',
        to: `/${guestbook.value.id}/print`,
      },
      {
        label: 'Einstellungen',
        to: `/${guestbook.value.id}/settings`,
      },
    ]
  : [
      {
        label: 'Startseite',
        to: '/',
      },
      {
        label: 'Neues Gästebuch',
        to: '/new',
      },
      {
        label: 'Einstellungen',
        to: '/settings',
      },
    ]);
</script>

<style>
body {
  font-family: 'Kalam', cursive;
}
</style>
