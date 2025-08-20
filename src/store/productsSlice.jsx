import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk for fetching products with pagination
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, limit = 20, search = '', filters = {} } = {}, { rejectWithValue }) => {
    try {
      // Fetch all products first
      let url = 'https://dummyjson.com/products?limit=100'; // Fetch enough products for filtering
      
      // If we have a search term, use search endpoint instead
      if (search.trim()) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`;
      }
      
      const response = await axios.get(url);
      let products = response.data.products.map(product => ({
        ...product,
        // Normalize prices to be more reasonable in USD
        price: (product.price / 10).toFixed(2), // Convert to more reasonable USD prices
      }));

      // Apply category filter if specified
      if (filters.category) {
        products = products.filter(product => 
          product.category.toLowerCase() === filters.category.toLowerCase()
        );
      }

      // Apply price range filter
      if (filters.priceRange) {
        products = products.filter(product => 
          product.price >= filters.priceRange[0] && 
          product.price <= filters.priceRange[1]
        );
      }

      // Apply sorting
      if (filters.sortBy && filters.sortBy !== 'relevance') {
        products.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            case 'rating':
              return b.rating - a.rating;
            case 'newest':
              // For newest, assume higher IDs are newer products
              return b.id - a.id;
            default:
              return 0;
          }
        });
      }

      // Apply pagination after all filters and sorting
      const total = products.length;
      const start = (page - 1) * limit;
      const paginatedProducts = products.slice(start, start + limit);

      // Log filtering results for debugging
      console.log(`Found ${total} products after filtering`);
      console.log('Applied filters:', filters);

      return {
        products: paginatedProducts,
        total,
        currentPage: page,
        limit,
        search,
        appliedFilters: filters // Return applied filters for state reference
      }
      return {
        ...response.data,
        currentPage: page,
        limit,
        search
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  }
)

// Async thunk for fetching single product
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://dummyjson.com/products/${productId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product')
    }
  }
)

// Async thunk for getting product categories
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://dummyjson.com/products/categories')
      return response.data
    } catch (error) {
      return rejectWithValue('Failed to fetch categories')
    }
  }
)

const initialState = {
  products: [],
  currentProduct: null,
  categories: [],
  searchTerm: '',
  selectedCategory: '',
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  limit: 20,
  loading: false,
  error: null,
  productLoading: false,
  productError: null,
  categoriesLoading: false,
  hasSearched: false,
  sortBy: 'relevance', // relevance, price-low, price-high, rating, newest
  priceRange: [0, 200], // USD price range
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
      state.currentPage = 1 // Reset to first page on new search
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
      state.currentPage = 1
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
      state.currentPage = 1
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload
      state.currentPage = 1
    },
    clearFilters: (state) => {
      state.searchTerm = ''
      state.selectedCategory = ''
      state.sortBy = 'relevance'
      state.priceRange = [0, 2000]
      state.currentPage = 1
      state.hasSearched = false
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
      state.productError = null
    },
    clearError: (state) => {
      state.error = null
      state.productError = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products cases
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.totalProducts = action.payload.total
        state.currentPage = action.payload.currentPage
        state.totalPages = Math.ceil(action.payload.total / action.payload.limit)
        state.hasSearched = !!action.payload.search
        state.products = action.payload.products
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      })
      // Fetch single product cases
      .addCase(fetchProductById.pending, (state) => {
        state.productLoading = true
        state.productError = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productLoading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productLoading = false
        state.productError = action.payload || 'Failed to fetch product'
      })
      // Fetch categories cases
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categoriesLoading = false
      })
  },
})

export const { 
  setSearchTerm, 
  setSelectedCategory, 
  setCurrentPage, 
  setSortBy,
  setPriceRange,
  clearFilters,
  clearCurrentProduct, 
  clearError 
} = productsSlice.actions

export default productsSlice.reducer

// Selectors
export const selectAllProducts = (state) => state.products.products
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsError = (state) => state.products.error
export const selectCurrentProduct = (state) => state.products.currentProduct
export const selectProductLoading = (state) => state.products.productLoading
export const selectProductError = (state) => state.products.productError
export const selectSearchTerm = (state) => state.products.searchTerm
export const selectSelectedCategory = (state) => state.products.selectedCategory
export const selectCurrentPage = (state) => state.products.currentPage
export const selectTotalPages = (state) => state.products.totalPages
export const selectTotalProducts = (state) => state.products.totalProducts
export const selectCategories = (state) => state.products.categories
export const selectCategoriesLoading = (state) => state.products.categoriesLoading
export const selectHasSearched = (state) => state.products.hasSearched
export const selectSortBy = (state) => state.products.sortBy
export const selectPriceRange = (state) => state.products.priceRange