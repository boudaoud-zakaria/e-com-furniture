'use client'

import { useState, useEffect, useTransition, useCallback, useMemo } from 'react'
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
  isInitialized: boolean
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
  error: null,
  isInitialized: false
}

// Cache for static data
let categoriesCache: CategoryWithCount[] | null = null
let priceRangeCache: { min: number; max: number } | null = null
let materialsCache: { [key: string]: string[] } = {}

export function useStore() {
  const [filters, setFilters] = useState<StoreFilters>(initialFilters)
  const [state, setState] = useState<StoreState>(initialState)
  const [isPending, startTransition] = useTransition()

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  // Memoize filter changes to prevent unnecessary re-renders
  const filterKey = useMemo(() => 
    JSON.stringify({
      search: filters.search,
      categoryId: filters.categoryId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortBy: filters.sortBy,
      page: filters.page,
      language: filters.language
    }), [filters]
  )

  // Load initial data only once
  useEffect(() => {
    if (!state.isInitialized) {
      loadInitialData()
    }
  }, [state.isInitialized])

  // Load products with debouncing for search
  useEffect(() => {
    if (!state.isInitialized) return

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      loadProducts()
    }, filters.search ? 300 : 0) // Debounce only for search

    setSearchTimeout(timeout)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [filterKey, state.isInitialized])

  const loadInitialData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      // Use cached data if available
      const promises = []
      
      if (!categoriesCache) {
        promises.push(getCategories())
      }
      
      if (!priceRangeCache) {
        promises.push(getPriceRange())
      }
      
      if (!materialsCache[filters.language]) {
        promises.push(getMaterials(filters.language))
      }

      // Load initial products in parallel
      promises.push(getProducts({
        search: '',
        categoryId: 'all',
        minPrice: 0,
        maxPrice: 150000,
        sortBy: 'popularity',
        page: 1,
        limit: 12,
        language: filters.language
      }))

      const results = await Promise.all(promises)
      let resultIndex = 0

      // Update caches
      if (!categoriesCache) {
        categoriesCache = results[resultIndex++]
      }
      
      if (!priceRangeCache) {
        priceRangeCache = results[resultIndex++]
      }
      
      if (!materialsCache[filters.language]) {
        materialsCache[filters.language] = results[resultIndex++]
      }

      const productsData = results[resultIndex]

      setState(prev => ({
        ...prev,
        categories: categoriesCache!,
        priceRange: priceRangeCache!,
        availableMaterials: materialsCache[filters.language],
        products: productsData.products,
        totalCount: productsData.totalCount,
        totalPages: productsData.totalPages,
        currentPage: productsData.currentPage,
        isLoading: false,
        isInitialized: true
      }))

      // Update filters with actual price range
      setFilters(prev => ({
        ...prev,
        minPrice: priceRangeCache!.min,
        maxPrice: priceRangeCache!.max
      }))

    } catch (error) {
      console.error('Error loading initial data:', error)
      setState(prev => ({
        ...prev,
        error: 'Failed to load store data',
        isLoading: false,
        isInitialized: true
      }))
    }
  }, [filters.language])

  const loadProducts = useCallback(async () => {
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
  }, [filters])

  // Optimized filter update functions
  const updateSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }, [])

  const updateCategory = useCallback((categoryId: string) => {
    setFilters(prev => ({ ...prev, categoryId, page: 1 }))
  }, [])

  const updatePriceRange = useCallback((minPrice: number, maxPrice: number) => {
    setFilters(prev => ({ ...prev, minPrice, maxPrice, page: 1 }))
  }, [])

  const updateSortBy = useCallback((sortBy: StoreFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy, page: 1 }))
  }, [])

  const updateLanguage = useCallback((language: StoreFilters['language']) => {
    // Clear materials cache for new language if not cached
    if (!materialsCache[language]) {
      getMaterials(language).then(materials => {
        materialsCache[language] = materials
        setState(prev => ({ ...prev, availableMaterials: materials }))
      })
    } else {
      setState(prev => ({ ...prev, availableMaterials: materialsCache[language] }))
    }
    
    setFilters(prev => ({ ...prev, language, page: 1 }))
  }, [])

  const updatePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      ...initialFilters,
      language: filters.language,
      minPrice: state.priceRange.min,
      maxPrice: state.priceRange.max
    })
  }, [filters.language, state.priceRange])

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
    loadProducts: loadProducts,
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
