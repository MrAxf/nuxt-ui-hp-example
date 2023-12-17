import apiClient from "~/utils/apiClient";

const endpoint = '/characters';

export interface IFetchCharactersParams {
  page?: MaybeRef<number>,
  pageSize?: MaybeRef<number>,
  search?: MaybeRef<string>,
  houseFilter?: MaybeRef<string | undefined>,
  sort?: MaybeRef<string | undefined>,
}
const fetchCharactersOptions = (options: IFetchCharactersParams) => ({
  query: {
    'page[size]': options.pageSize ?? 20,
    'page[number]': options.page,
    'filter[name_cont]': options.search,
    'filter[house_in]': options.houseFilter,
    'sort': options.sort
  }
});
const transformCharacters = (input: any) => ({
  ...input,
  data: (input.data as any[]).map(item => ({
    id: item.id,
    name: item.attributes.name,
    image: item.attributes.image,
    gender: item.attributes.gender,
    house: item.attributes.house,
    patronus: item.attributes.patronus,
  }))
})
export const fetchCharacters = async (options: IFetchCharactersParams) => {
  const response = await apiClient(endpoint, fetchCharactersOptions(options))
  return transformCharacters(response)
}
export const useFetchCharacters = (options: IFetchCharactersParams) => useFetch(endpoint, {
  $fetch: apiClient,
  ...fetchCharactersOptions(options),
  transform: transformCharacters,
})
export const useCharacterColumns = () => {
  const requiredColumns = [
    {
      key: "image",
      label: "Foto",
    },
    {
      key: "name",
      label: "Nombre",
      sortable: true
    },
  ];
  const optionalColumns = [
    {
      key: "gender",
      label: "Género",
      sortable: true
    },
    {
      key: "house",
      label: "Casa",
      sortable: true
    },
    {
      key: "patronus",
      label: "Patronus",
      sortable: true
    },
  ];
  const selectedColumns = ref(optionalColumns);
  const tableColumns = computed(() => requiredColumns.concat(selectedColumns.value))

  return { requiredColumns, optionalColumns, selectedColumns, tableColumns }
}