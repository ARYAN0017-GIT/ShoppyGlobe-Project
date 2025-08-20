import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchProducts,
  fetchCategories,
  selectAllProducts, 
  selectProductsLoading, 
  selectProductsError,
  selectCurrentPage,
  selectTotalPages,
  selectTotalProducts,
  selectSearchTerm,
  selectSelectedCategory,
  selectCategories,
  selectCategoriesLoading,
  selectHasSearched,
  selectSortBy,
  selectPriceRange,
  setCurrentPage,
  setSearchTerm,
  setSelectedCategory,
  setSortBy,
  setPriceRange,
  clearFilters
} from '../store/productsSlice'

/**
 * Enhanced custom hook for fetching and managing products with pagination
 * This hook provides products data, loading state, error state, and pagination controls
 * It automatically fetches products when the component mounts and handles search/filtering
 */
const useProducts = () => {
  const dispatch = useDispatch()
  const products = useSelector(selectAllProducts)
  const loading = useSelector(selectProductsLoading)
  const error = useSelector(selectProductsError)
  const currentPage = useSelector(selectCurrentPage)
  const totalPages = useSelector(selectTotalPages)
  const totalProducts = useSelector(selectTotalProducts)
  const searchTerm = useSelector(selectSearchTerm)
  const selectedCategory = useSelector(selectSelectedCategory)
  const categories = useSelector(selectCategories)
  const categoriesLoading = useSelector(selectCategoriesLoading)
  const hasSearched = useSelector(selectHasSearched)
  const sortBy = useSelector(selectSortBy)
  const priceRange = useSelector(selectPriceRange)

  // Fetch products when dependencies change
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchProducts({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        filters: {
          category: selectedCategory,
          priceRange,
          sortBy
        }
      }))
    }

    fetchData()
  }, [dispatch, currentPage, searchTerm, selectedCategory, sortBy, priceRange])

  // Fetch categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length])

  // Function to change page
  const changePage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page))
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [dispatch, totalPages])

  // Function to perform search
  const performSearch = useCallback((term) => {
    dispatch(setSearchTerm(term))
    dispatch(setCurrentPage(1))
  }, [dispatch])

  // Function to change category
  const changeCategory = useCallback((category) => {
    dispatch(setSelectedCategory(category))
    dispatch(setCurrentPage(1))
  }, [dispatch])

  // Function to change sort
  const changeSortBy = useCallback((sort) => {
    dispatch(setSortBy(sort))
    dispatch(setCurrentPage(1))
  }, [dispatch])

  // Function to change price range
  const changePriceRange = useCallback((range) => {
    dispatch(setPriceRange(range))
    dispatch(setCurrentPage(1))
  }, [dispatch])

  // Function to clear all filters
  const resetFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  // Function to refetch products manually
  const refetchProducts = useCallback(() => {
    dispatch(fetchProducts({
      page: currentPage,
      limit: 20,
      search: searchTerm
    }))
  }, [dispatch, currentPage, searchTerm])

  // Generate pagination info
  const paginationInfo = {
    currentPage,
    totalPages,
    totalProducts,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    startItem: (currentPage - 1) * 20 + 1,
    endItem: Math.min(currentPage * 20, totalProducts)
  }

  return {
    // Data
    products,
    categories,
    totalProducts,

    // Loading states
    loading,
    categoriesLoading,

    // Error states
    error,

    // Filter states
    searchTerm,
    selectedCategory,
    hasSearched,
    sortBy,
    priceRange,

    // Pagination
    pagination: paginationInfo,

    // Actions
    changePage,
    performSearch,
    changeCategory,
    changeSortBy,
    changePriceRange,
    resetFilters,
    refetchProducts
  }
}

export default useProducts