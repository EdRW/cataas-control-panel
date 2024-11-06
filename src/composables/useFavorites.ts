import { useStorage } from '@vueuse/core'
import { z } from 'zod'
import type { CatQueryParams } from './useCataasFetch'

const favoriteCatId = z.string().brand<'Cataas_ID'>()
export type FavoriteCatId = z.infer<typeof favoriteCatId>

export type Customization = {
  text?: string
  queryParams?: CatQueryParams
}

export type FavoriteCat = {
  id: FavoriteCatId
  cataasId: string
  savedAt: Date
  customization?: Customization
}

export function useFavorites() {
  const favorites = useStorage<FavoriteCat[]>('cataas-favorites', [])

  const addFavorite = (cataasId: string, customization: Customization) => {
    favorites.value.push({
      id: randomID(),
      cataasId,
      savedAt: new Date(),
      customization
    })
  }

  const removeFavorite = (id: FavoriteCatId) => {
    favorites.value = favorites.value.filter((cat) => cat.id !== id)
  }

  return { favorites, addFavorite, removeFavorite }
}

function randomID() {
  return crypto.randomUUID().split('-')[0] as FavoriteCatId
}
