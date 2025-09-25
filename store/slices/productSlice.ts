
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, Category, FilterOptions, SortOption } from '../../types';

interface ProductState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  searchResults: Product[];
  currentProduct: Product | null;
  filters: FilterOptions;
  sortBy: SortOption;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  categories: [],
  featuredProducts: [],
  searchResults: [],
  currentProduct: null,
  filters: {
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    inStock: false,
  },
  sortBy: { key: 'name', label: 'Name', value: 'asc' },
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Product[]>) => {
      state.searchResults = action.payload;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setCategories,
  setFeaturedProducts,
  setSearchResults,
  setCurrentProduct,
  updateFilters,
  setSortBy,
  setLoading,
  setError,
} = productSlice.actions;

export default productSlice.reducer;
