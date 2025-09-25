
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../app/integrations/supabase/client';
import { RootState } from '../store';
import { 
  setProducts, 
  setCategories, 
  setFeaturedProducts, 
  addProduct, 
  updateProduct, 
  removeProduct,
  setLoading as setProductsLoading,
  setError as setProductsError
} from '../store/slices/productSlice';
import { 
  setOrders, 
  addOrder, 
  updateOrderStatus,
  setLoading as setOrdersLoading,
  setError as setOrdersError
} from '../store/slices/orderSlice';
import { 
  setWishlist,
  addToWishlist as addWishlistItem,
  removeFromWishlist as removeWishlistItem
} from '../store/slices/wishlistSlice';

export const useDataSync = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // Sync Products
  const syncProducts = useCallback(async () => {
    try {
      dispatch(setProductsLoading(true));
      
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error syncing products:', productsError);
        dispatch(setProductsError(productsError.message));
        return;
      }

      if (productsData) {
        dispatch(setProducts(productsData));
        dispatch(setFeaturedProducts(productsData.filter(p => p.is_featured)));
      }
    } catch (error) {
      console.error('Error syncing products:', error);
      dispatch(setProductsError('Failed to sync products'));
    } finally {
      dispatch(setProductsLoading(false));
    }
  }, [dispatch]);

  // Sync Categories
  const syncCategories = useCallback(async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('Error syncing categories:', categoriesError);
        return;
      }

      if (categoriesData) {
        dispatch(setCategories(categoriesData));
      }
    } catch (error) {
      console.error('Error syncing categories:', error);
    }
  }, [dispatch]);

  // Sync Orders
  const syncOrders = useCallback(async () => {
    if (!user?.id) return;

    try {
      dispatch(setOrdersLoading(true));
      
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error syncing orders:', ordersError);
        dispatch(setOrdersError(ordersError.message));
        return;
      }

      if (ordersData) {
        dispatch(setOrders(ordersData));
      }
    } catch (error) {
      console.error('Error syncing orders:', error);
      dispatch(setOrdersError('Failed to sync orders'));
    } finally {
      dispatch(setOrdersLoading(false));
    }
  }, [dispatch, user?.id]);

  // Sync Wishlist
  const syncWishlist = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:products(
            *,
            category:categories(*)
          )
        `)
        .eq('user_id', user.id);

      if (wishlistError) {
        console.error('Error syncing wishlist:', wishlistError);
        return;
      }

      if (wishlistData) {
        const products = wishlistData.map(item => item.product).filter(Boolean);
        dispatch(setWishlist(products));
      }
    } catch (error) {
      console.error('Error syncing wishlist:', error);
    }
  }, [dispatch, user?.id]);

  // Add to wishlist with sync
  const addToWishlist = useCallback(async (product: any) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: product.id
        });

      if (error) {
        console.error('Error adding to wishlist:', error);
        return { success: false, error: error.message };
      }

      dispatch(addWishlistItem(product));
      return { success: true };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: 'Failed to add to wishlist' };
    }
  }, [dispatch, user?.id]);

  // Remove from wishlist with sync
  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing from wishlist:', error);
        return { success: false, error: error.message };
      }

      dispatch(removeWishlistItem(productId));
      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: 'Failed to remove from wishlist' };
    }
  }, [dispatch, user?.id]);

  // Create order with sync
  const createOrder = useCallback(async (orderData: any) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          subtotal: orderData.subtotal,
          tax: orderData.tax,
          shipping: orderData.shipping,
          total: orderData.total,
          status: 'pending',
          shipping_address: orderData.shippingAddress,
          payment_method: orderData.paymentMethod
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        return { success: false, error: orderError.message };
      }

      // Insert order items
      const orderItems = orderData.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        return { success: false, error: itemsError.message };
      }

      // Fetch complete order with items
      const { data: completeOrder } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          )
        `)
        .eq('id', order.id)
        .single();

      if (completeOrder) {
        dispatch(addOrder(completeOrder));
      }

      return { success: true, order: completeOrder };
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, error: 'Failed to create order' };
    }
  }, [dispatch, user?.id]);

  // Update order status (admin only)
  const updateOrderStatusSync = useCallback(async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        return { success: false, error: error.message };
      }

      dispatch(updateOrderStatus({ orderId, status: status as any }));
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: 'Failed to update order status' };
    }
  }, [dispatch]);

  // Setup real-time subscriptions
  useEffect(() => {
    const subscriptions: any[] = [];

    // Products subscription
    const productsSubscription = supabase
      .channel('products-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Products change:', payload);
          if (payload.eventType === 'INSERT') {
            dispatch(addProduct(payload.new as any));
          } else if (payload.eventType === 'UPDATE') {
            dispatch(updateProduct(payload.new as any));
          } else if (payload.eventType === 'DELETE') {
            dispatch(removeProduct(payload.old.id));
          }
        }
      )
      .subscribe();

    subscriptions.push(productsSubscription);

    // Categories subscription
    const categoriesSubscription = supabase
      .channel('categories-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          console.log('Categories change:', payload);
          // Refresh categories when changed
          syncCategories();
        }
      )
      .subscribe();

    subscriptions.push(categoriesSubscription);

    // Orders subscription (user-specific)
    if (user?.id) {
      const ordersSubscription = supabase
        .channel('orders-changes')
        .on('postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'orders',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Orders change:', payload);
            if (payload.eventType === 'INSERT') {
              syncOrders(); // Refresh to get complete order with items
            } else if (payload.eventType === 'UPDATE') {
              dispatch(updateOrderStatus({ 
                orderId: payload.new.id, 
                status: payload.new.status 
              }));
            }
          }
        )
        .subscribe();

      subscriptions.push(ordersSubscription);

      // Wishlist subscription
      const wishlistSubscription = supabase
        .channel('wishlist-changes')
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'wishlist',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Wishlist change:', payload);
            syncWishlist(); // Refresh wishlist
          }
        )
        .subscribe();

      subscriptions.push(wishlistSubscription);
    }

    return () => {
      subscriptions.forEach(sub => {
        supabase.removeChannel(sub);
      });
    };
  }, [dispatch, user?.id, syncCategories, syncOrders, syncWishlist]);

  // Initial sync
  useEffect(() => {
    syncProducts();
    syncCategories();
    if (user?.id) {
      syncOrders();
      syncWishlist();
    }
  }, [syncProducts, syncCategories, syncOrders, syncWishlist, user?.id]);

  return {
    syncProducts,
    syncCategories,
    syncOrders,
    syncWishlist,
    addToWishlist,
    removeFromWishlist,
    createOrder,
    updateOrderStatus: updateOrderStatusSync,
  };
};
