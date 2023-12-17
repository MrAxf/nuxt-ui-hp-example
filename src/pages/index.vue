<template>
  <UContainer class="my-5">
    <UCard
      :ui="{
        body: {
          padding: 'px-0 py-0 sm:p-0',
        },
      }"
    >
      <template #header>
        <h2 class="text-xl">Personajes</h2>
      </template>
      <section class="flex flex-col">
        <div
          class="flex justify-between items-center min-h-[5rem] px-4 sm:px-6"
        >
          <UInput
            type="search"
            v-model="search"
            placeholder="Buscar..."
            icon="i-heroicons-magnifying-glass"
          />
          <USelectMenu
            v-model="selectedHouses"
            :options="houses"
            size="xs"
            placeholder="Casas"
            multiple
            class="w-40"
          />
        </div>
        <UDivider />
        <div
          class="flex justify-between items-center min-h-[5rem] px-4 sm:px-6"
        >
          <div class="flex gap-2 items-center">
            <span class="text-sm leading-5">Elementos por página:</span>
            <USelect
              size="xs"
              v-model="pageSize"
              :options="[5, 10, 20, 30, 40]"
            />
          </div>
          <div class="flex gap-2 items-center">
            <USelectMenu
              v-model="selectedColumns"
              :options="optionalColumns"
              option-attribute="label"
              placeholder="Columnas"
              multiple
              class="w-32"
            >
              <UButton icon="i-heroicons-view-columns" color="gray" size="xs" class="w-full">
                Columnas
              </UButton>
            </USelectMenu>
            <UButton
              icon="i-heroicons-funnel"
              :disabled="!isFilterActive"
              color="gray"
              size="xs"
              @click="cleanFilters"
            >
              Limpiar
            </UButton>
          </div>
        </div>
        <UDivider />
        <UTable
          :rows="data?.data"
          :columns="tableColumns"
          :loading="pending"
          v-model:sort="sortData"
        >
          <template #image-data="{ row }">
            <UAvatar
              :src="row.image"
              :alt="row.name"
              size="2xl"
              img-class="object-cover object-top"
            />
          </template>
        </UTable>
        <UDivider />
        <div
          class="flex justify-between items-center min-h-[5rem] px-4 sm:px-6"
        >
          <span class="text-sm leading-5">Página: {{ page }}</span>
          <UPagination v-model="page" :page-count="5" :total="lastPage" />
        </div>
      </section>
    </UCard>
  </UContainer>
</template>

<script lang="ts" setup>
import {
  useFetchCharacters,
  useCharacterColumns,
} from "~/services/charactersService";

const pageSize = ref(20);
const page = ref(1);

const search = ref("");
const searchDebounced = debouncedRef(search, 300);

const sortData = ref<
  | {
      column: string;
      direction: "desc" | "asc";
    }
  | undefined
>();
const sort = computed(() =>
  sortData.value
    ? `${sortData.value.direction === "desc" ? "-" : ""}${
        sortData.value.column
      }`
    : undefined
);

const houses = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"];
const selectedHouses = ref<string[]>([]);
const houseFilter = computed(() => selectedHouses.value.join(",") || undefined);

const { data, pending } = useFetchCharacters({
  pageSize,
  page,
  search: searchDebounced,
  sort,
  houseFilter,
});

const lastPage = computed(
  () => (data.value?.meta.pagination.last as number) ?? 0
);

const { tableColumns, selectedColumns, optionalColumns } =
  useCharacterColumns();

const isFilterActive = computed(() => selectedHouses.value.length !== 0);

function cleanFilters() {
  selectedHouses.value = [];
}

watch(
  [searchDebounced, pageSize],
  () => {
    page.value = 1;
  },
  {
    immediate: true,
  }
);
</script>
