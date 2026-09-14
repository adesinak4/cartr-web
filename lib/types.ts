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

export type BillingPeriodMonths = 3 | 6 | 12;

export interface PlanPrice {
  id: string;
  planId: string;
  periodMonths: BillingPeriodMonths;
  totalPrice: string;
}

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: string;
  transactionFeePercent: string;
  features: string[];
  archivedAt?: string | null;
  // GET /plans is public and always includes period pricing — the onboarding
  // wizard and the dashboard plan picker both need it.
  prices: PlanPrice[];
}

export interface AdminPlanWithPrices extends Plan {
  archivedAt: string | null;
  prices: PlanPrice[];
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

export interface Bank {
  code: string;
  name: string;
}

export interface PaymentAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  kycStatus: string;
  verifiedAt: string | null;
}

// Onboarding wizard — public, pre-account.

export interface DomainCheckResult {
  domain: string;
  // null = the availability registry couldn't be reached (RDAP timeout/
  // unreachable) — a real, honest third state, never coerced to true/false.
  available: boolean | null;
}

export interface OnboardingStatus {
  status: "pending" | "completed" | "failed";
  slug: string | null;
}

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
// Admin dashboard — platform operations.

export type AppRole = "owner" | "staff" | "admin" | "support";

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorId: string | null;
  actorRole: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface PlatformUser {
  id: string;
  tenantId: string | null;
  email: string;
  phone: string | null;
  name: string;
  role: AppRole;
  status: "active" | "invited" | "disabled";
  createdAt: string;
}

export interface DomainProvisioningTask {
  id: string;
  merchantId: string;
  desiredDomain: string;
  status: "pending" | "done";
  createdAt: string;
  doneAt: string | null;
  merchantSlug: string;
  merchantStoreName: string;
}

export interface AdminOrder {
  id: string;
  tenantId: string;
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
  updatedAt: string;
  merchantSlug: string;
  merchantStoreName: string;
}

/** GET /admin/orders/:id — no merchant join, unlike the list shape (AdminOrder). */
export interface AdminOrderDetail {
  id: string;
  tenantId: string;
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
  updatedAt: string;
  items: OrderItem[];
}

export type TransactionStatus = "pending" | "success" | "failed" | "refunded";

export interface AdminTransaction {
  id: string;
  orderId: string;
  tenantId: string;
  provider: string;
  providerReference: string;
  amount: string;
  platformFee: string;
  merchantAmount: string;
  status: TransactionStatus;
  flutterwaveTransactionId: string | null;
  refundedAt: string | null;
  refundReference: string | null;
  refundInitiatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  merchantSlug: string;
  merchantStoreName: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  tenantId: string;
  reason: string;
  status: "open" | "resolved";
  resolutionNotes: string | null;
  createdBy: string;
  resolvedBy: string | null;
  createdAt: string;
  resolvedAt: string | null;
  merchantSlug?: string;
  merchantStoreName?: string;
}

export interface PlatformSetting {
  key: string;
  value: string;
  description: string | null;
  updatedBy: string | null;
  updatedAt: string;
}

export interface SubscriptionCharge {
  id: string;
  tenantId: string;
  planId: string;
  paymentMethodId: string | null;
  provider: string;
  providerReference: string;
  amount: string;
  currency: string;
  status: "pending" | "success" | "failed";
  attemptNumber: number;
  billingPeriodStart: string | null;
  billingPeriodEnd: string | null;
  failureReason: string | null;
  createdAt: string;
}

export interface AdminStatsOverview {
  merchants: {
    total: number;
    active: number;
    suspended: number;
    bySubscriptionStatus: Record<string, number>;
    newInLast7Days: number;
  };
  revenue: {
    estimatedMrr: number;
    totalSubscriptionRevenueCollected: number;
    totalPlatformFeeRevenue: number;
  };
  operations: {
    pastDueMerchants: number;
    pendingDomainProvisioningTasks: number;
  };
}
