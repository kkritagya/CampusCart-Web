import type { MarketplaceProduct } from "@/lib/data/marketplace";
import { apiRequest } from "./axios-instance";
import { API_BASE_URL } from "./endpoint";
import { mapApiListing } from "./listing_api";

type ApiListing = Parameters<typeof mapApiListing>[0];
type ApiCart = { items: ApiListing[]; subtotal: number; total: number };
export type Cart = { items: MarketplaceProduct[]; subtotal: number; total: number };
export type BillingAddress = { fullName: string; email: string; phone: string; addressLine1: string; addressLine2?: string; city: string; region: string; postalCode: string };
export type OrderConfirmation = { id: string; orderNumber: string; status: string; total: number; itemCount: number };
export type EsewaPaymentInitiation = { orderId: string; paymentUrl: string; fields: Record<string, string> };
export type PurchasedOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  purchasedAt: string;
  items: { listingId: string; title: string; price: number; image: string }[];
};
export type SellerEarnings = {
  totalEarnings: number;
  soldItems: number;
  paidOrders: number;
  recentSales: {
    orderId: string;
    orderNumber: string;
    listingId: string;
    title: string;
    amount: number;
    soldAt: string;
  }[];
};

function mapCart(cart: ApiCart): Cart {
  return { ...cart, items: cart.items.map(mapApiListing) };
}

export async function fetchCart() {
  const result = await apiRequest<ApiCart>("/cart", { authenticated: true, baseUrl: API_BASE_URL });
  return result.success ? { ...result, data: mapCart(result.data) } : result;
}
export function fetchPurchasedOrders() {
  return apiRequest<PurchasedOrder[]>("/cart/purchases", { authenticated: true, baseUrl: API_BASE_URL });
}
export function fetchSellerEarnings() {
  return apiRequest<SellerEarnings>("/cart/earnings", { authenticated: true, baseUrl: API_BASE_URL });
}
export async function addApiCartItem(listingId: string) {
  const result = await apiRequest<ApiCart>(`/cart/${listingId}`, { method: "POST", authenticated: true, baseUrl: API_BASE_URL });
  return result.success ? { ...result, data: mapCart(result.data) } : result;
}
export async function removeApiCartItem(listingId: string) {
  const result = await apiRequest<ApiCart>(`/cart/${listingId}`, { method: "DELETE", authenticated: true, baseUrl: API_BASE_URL });
  return result.success ? { ...result, data: mapCart(result.data) } : result;
}
export function checkoutApiCart(billingAddress: BillingAddress) {
  return apiRequest<EsewaPaymentInitiation>("/cart/checkout", { method: "POST", authenticated: true, baseUrl: API_BASE_URL, body: { billingAddress } });
}
export function verifyEsewaPayment(data: string) {
  return apiRequest<OrderConfirmation>("/cart/checkout/esewa/verify", { method: "POST", authenticated: true, baseUrl: API_BASE_URL, body: { data } });
}
