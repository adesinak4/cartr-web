// Minimal shapes for what the dashboard actually reads — not a full mirror
// of every cartr-api schema field, just what each page consumes.

export interface Merchant {
  id: string;
  slug: string;
  storeName: string;
  description: string | null;
  logoUrl: string | null;
  address: string | null;
  currency: string;
  isOpen: boolean;
  accountStatus: "active" | "suspended";
  subscriptionStatus: "trialing" | "active" | "past_due" | "cancelled";
  planId: string | null;
  themeId: string | null;
  customDomain: string | null;
  customDomainVerified: boolean;
  customDomainVerificationToken: string | null;
}

export type SubscriptionStatus = Merchant["subscriptionStatus"];

export interface SubscriptionSummary {
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  nextRenewalAt: string | null;
  pastDueSince: string | null;
  billingRetryCount: number;
  planId: string | null;
  pendingPlanId: string | null;
  paymentMethod: { cardLast4: string; cardType: string } | null;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  subtotal: string;
  deliveryFee: string;
  total: string;
  currency: string;
  deliveryStreet: string;
  deliveryCity: string;
  deliveryState: string;
  note: string | null;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string | null;
  productNameSnapshot: string;
  priceSnapshot: string;
  qty: number;
  lineTotal: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string;
}

export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  originalPrice: string | null;
  category: string | null;
  stock: number;
  status: ProductStatus;
  featured: boolean;
  createdAt: string;
}

export interface Theme {
  id: string;
  key: string;
  name: string;
  previewImageUrl: string | null;
  isPremium: boolean;
}

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: string;
  transactionFeePercent: string;
  features: string[];
}

// Public storefront — deliberately hand-picked shapes, matching what
// cartr-api's public endpoints actually return (never the full Merchant/
// Product row — see MerchantsService.getPublicStorefront / ProductsService.listPublic).

export interface PublicStorefront {
  slug: string;
  storeName: string;
  description: string | null;
  logoUrl: string | null;
  currency: string;
  isOpen: boolean;
  theme: { key: string; name: string } | null;
}

export interface PublicProduct {
  id: string;
  name: string;
  description: string | null;
  price: string;
  originalPrice: string | null;
  category: string | null;
  stock: number;
  featured: boolean;
  images: { url: string; sortOrder: number }[];
}

// Admin — full Merchant row (AdminService returns raw rows, no shaping).

export interface AdminMerchant {
  id: string;
  slug: string;
  storeName: string;
  description: string | null;
  currency: string;
  isOpen: boolean;
  accountStatus: "active" | "suspended";
  subscriptionStatus: SubscriptionStatus;
  planId: string | null;
  createdAt: string;
}
