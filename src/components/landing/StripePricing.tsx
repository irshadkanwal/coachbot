'use client';

import React from "react";

export const StripePricingTable = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error(
      'No stripe table env variables provided: NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID or NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
    );
  }

  return (
    <div className="w-full">
      <section id="start-here" aria-label="Pricing">
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
        {
          React.createElement("stripe-pricing-table", {
            "pricing-table-id": process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID,
            "publishable-key": process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          })
        }
      </section>
    </div>
  );
};