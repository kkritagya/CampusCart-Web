"use server";
import { addApiCartItem, checkoutApiCart, removeApiCartItem, verifyEsewaPayment, type BillingAddress } from "@/lib/api/cart_api";
import { revalidatePath } from "next/cache";
export async function addToCartAction(id: string) { const result = await addApiCartItem(id); if (result.success) revalidatePath("/cart"); return result; }
export async function removeFromCartAction(id: string) { const result = await removeApiCartItem(id); if (result.success) revalidatePath("/cart"); return result; }
export async function checkoutCartAction(address: BillingAddress) { return checkoutApiCart(address); }
export async function verifyEsewaPaymentAction(data: string) { return verifyEsewaPayment(data); }
