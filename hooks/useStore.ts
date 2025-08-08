'use client'

import { useState, useEffect, useTransition } from 'react'
import { 
  getProducts, 
  getCategories, 
  getPriceRange, 
  getMaterials,
  searchProducts,
  ProductWithDetails,
  CategoryWithCount
} from '@/model/store'

// Types for store state
export interface StoreFilters {
  search: string
  categoryId: string
  minPrice: number
  maxPrice: number
  materials: string[]
  sortBy: 'popularity' | 'price-low' | 'price-high' | 'rating' | 'name'
  page: number
  language: 'fr' | 'ar' | 'en'
}

export interface StoreState {
  products: ProductWithDetails[]
  categories: CategoryWithCount[]
  totalCount: number
  totalPages: number
  currentPage: number
  priceRange: { min: number; max: number }
  availableMaterials: string[]
  isLoading: boolean
  error: string | null
}

const initialFilters: StoreFilters = {
  search: '',
  categoryId: 'all',
  minPrice: 0,
  maxPrice: 150000,
  materials: [],
  sortBy: 'popularity',
  page: 1,
  language: 'fr'
}

const initialState: StoreState = {
  products: [],
  categories: [],
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  priceRange: { min: 0, max: 150000 },
  availableMaterials: [],
  isLoading: true,
  error: null
}

export function useStore() {
  const [filters, setFilters] = useState<StoreFilters>(initialFilters)
  const [state, setState] = useState<StoreState>(initialState)
  const [isPending, startTransition] = useTransition()

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  // Load products when filters change
  useEffect(() => {
    loadProducts()
  }, [filters])

  const loadInitialData = async () => {
    startTransition(async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        const [categoriesData, priceRangeData, materialsData] = await Promise.all([
          getCategories(),
          getPriceRange(),
          getMaterials(filters.language)
        ])

        setState(prev => ({
          ...prev,
          categories: categoriesData,
          priceRange: priceRangeData,
          availableMaterials: materialsData,
          isLoading: false
        }))

        // Update filters with actual price range
        setFilters(prev => ({
          ...prev,
          minPrice: priceRangeData.min,
          maxPrice: priceRangeData.max
        }))

      } catch (error) {
        console.error('Error loading initial data:', error)
        setState(prev => ({
          ...prev,
          error: 'Failed to load store data',
          isLoading: false
        }))
      }
    })
  }

  const loadProducts = async () => {
    startTransition(async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        const productsData = await getProducts({
          search: filters.search,
          categoryId: filters.categoryId,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sortBy: filters.sortBy,
          page: filters.page,
          limit: 12,
          language: filters.language
        })

        setState(prev => ({
          ...prev,
          products: productsData.products,
          totalCount: productsData.totalCount,
          totalPages: productsData.totalPages,
          currentPage: productsData.currentPage,
          isLoading: false
        }))

      } catch (error) {
        console.error('Error loading products:', error)
        setState(prev => ({
          ...prev,
          error: 'Failed to load products',
          isLoading: false
        }))
      }
    })
  }

  // Filter update functions
  const updateSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const updateCategory = (categoryId: string) => {
    setFilters(prev => ({ ...prev, categoryId, page: 1 }))
  }

  const updatePriceRange = (minPrice: number, maxPrice: number) => {
    setFilters(prev => ({ ...prev, minPrice, maxPrice, page: 1 }))
  }

  const updateSortBy = (sortBy: StoreFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy, page: 1 }))
  }

  const updateLanguage = (language: StoreFilters['language']) => {
    setFilters(prev => ({ ...prev, language, page: 1 }))
  }

  const updatePage = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const resetFilters = () => {
    setFilters({
      ...initialFilters,
      language: filters.language, // Keep current language
      minPrice: state.priceRange.min,
      maxPrice: state.priceRange.max
    })
  }

  return {
    // State
    ...state,
    filters,
    isLoading: state.isLoading || isPending,

    // Actions
    updateSearch,
    updateCategory,
    updatePriceRange,
    updateSortBy,
    updateLanguage,
    updatePage,
    resetFilters,
    loadProducts,
    loadInitialData
  }
}

// Hook for product search with debouncing
export function useProductSearch(language: 'fr' | 'ar' | 'en' = 'fr') {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 300) // Debounce for 300ms

    return () => clearTimeout(timeoutId)
  }, [query, language])

  const performSearch = async (searchQuery: string) => {
    startTransition(async () => {
      try {
        setIsSearching(true)
        const searchResults = await searchProducts(searchQuery, language, 5)
        setResults(searchResults)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    })
  }

  return {
    query,
    setQuery,
    results,
    isSearching: isSearching || isPending,
    clearResults: () => setResults([])
  }
}