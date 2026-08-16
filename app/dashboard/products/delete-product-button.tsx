"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "./actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { IconTrash } from "@/components/icons";

export function DeleteProductButton({
  productId,
  productName,
  iconOnly = false,
  redirectAfter,
  className,
}: {
  productId: string;
  productName?: string;
  iconOnly?: boolean;
  redirectAfter?: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function onConfirm() {
    startTransition(async () => {
      await deleteProduct(productId);
      setConfirming(false);
      if (redirectAfter) router.push(redirectAfter);
    });
  }

  return (
    <>
      <button
        onClick={() => setConfirming(true)}
        disabled={pending}
        aria-label="Delete product"
        className={
          className ??
          (iconOnly
            ? "text-grey-400 transition hover:text-error disabled:opacity-60"
            : "text-sm text-error hover:underline disabled:opacity-60")
        }
      >
        {iconOnly ? <IconTrash className="h-4 w-4" /> : pending ? "Deleting…" : "Delete"}
      </button>
      <ConfirmDialog
        open={confirming}
        title="Delete product?"
        body={
          productName
            ? `"${productName}" will be permanently removed from your store.`
            : "This product will be permanently removed from your store."
        }
        confirmLabel="Delete"
        danger
        pending={pending}
        onConfirm={onConfirm}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
