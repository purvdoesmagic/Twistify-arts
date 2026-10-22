"use client";

import Link from "next/link";

export default function Error({ retry }: { error: Error; retry: () => void }) {
  return (
    <main className="px-5 pt-10 sm:px-8 lg:pt-16">
      <h1 className="max-w-[12ch] text-(length:--step-display) uppercase leading-[0.9]">A dropped stitch</h1>
      <p className="mt-8 max-w-[40ch] text-(length:--step-lead) leading-snug">
        Something went wrong on our side. Try again, or head back to the shop.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button type="button" onClick={() => retry()} className="btn">
          Try again
        </button>
        <Link href="/shop" className="text-link">
          Back to the shop
        </Link>
      </div>
    </main>
  );
}
