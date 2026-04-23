import Stripe from 'stripe';
import logger from 'lib/logger';
import { withoutTrailingSlash } from '@/utils/formatter';
import { PrivateRoutes } from '@models/common.models';
import { StripeSessionConfig } from '@models/data.models';

class StripeClient {
  private static instance: StripeClient;
  private _stripe: Stripe | null = null;

  private constructor() { }

  public static getInstance(): StripeClient {
    if (!StripeClient.instance) {
      StripeClient.instance = new StripeClient();
    }
    return StripeClient.instance;
  }

  private get stripe(): Stripe {
    if (!this._stripe) {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is missing in environment variables.');
      }

      this._stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-06-30.basil',
        typescript: true,
      });
    }

    return this._stripe;
  }

  public async createCustomer(email: string, name?: string, metadata?: Stripe.MetadataParam) {
    try {
      const { data } = await this.getCustomerByEmail(email);

      return data[0] || this.stripe.customers.create({ email, name });
    } catch (error: any) {
      logger.error(`[stripe] Error during creating customer for email ${email}:`, error);
      throw new Error('[stripe] Could not create customer');
    }
  };

  public async updateCustomer(customerId: string, data: Stripe.CustomerUpdateParams) {
    try {
      return await this.stripe.customers.update(customerId, data);
    } catch (error: any) {
      logger.error(`[stripe] Error during update customer ${customerId} data:`, error);
      throw new Error('[stripe] Could not update customer');
    }
  };

  public async createNewCustomer(email: string, name?: string, metadata?: Stripe.MetadataParam) {
    try {
      return this.stripe.customers.create({ email, name, metadata });
    } catch (error: any) {
      logger.error(`[stripe] Error during creating new customer with email ${email}:`, error);
      throw new Error('[stripe] Could not create new customer');
    }
  };

  public async getCustomerByEmail(email: string) {
    try {
      return this.stripe.customers.search({ query: `email:'${email}'`, expand: ['data.subscriptions'] });
    } catch (error: any) {
      logger.error(`[stripe] Error during fetching customer by email ${email}:`, error);
      throw new Error('[stripe] Could not fetch customer by email');
    }
  };

  public async getSubscription(id: string): Promise<Stripe.Subscription> {
    try {
      return this.stripe.subscriptions.retrieve(id);
    } catch (error: any) {
      logger.error(`[stripe] Error during fetching subscription ${id}:`, error);
      throw new Error('[stripe] Could not fetch subscription');
    }
  };

  public async getSubscriptionProduct(subscription: any) {
    try {
      const productId = subscription.plan.product;

      return this.stripe.products.retrieve(productId);
    } catch (error: any) {
      logger.error(`[stripe] Error during fetching product ${subscription.plan.product}:`, error);
      throw new Error('[stripe] Could not fetch subscription product');
    }
  };

  public async getProduct(productId: string) {
    try {
      return this.stripe.products.retrieve(productId);
    } catch (error: any) {
      logger.error(`[stripe] Error during fetching product ${productId}:`, error);
      throw new Error('[stripe] Could not fetch product');
    }
  };

  public async createSubscription(customer: string, metadata?: Stripe.MetadataParam) {
    try {
      return this.stripe.subscriptions.create({
        customer,
        items: [{ price: process.env.STRIPE_FREE_TIER }],
        metadata,
      });
    } catch (error: any) {
      logger.error(`[stripe] Error during creating subscription for customer ${customer}:`, error);
      throw new Error('[stripe] Could not create subscription');
    }
  };

  public async getWebhook(payload: string | Buffer, header: string | Buffer | string[]) {
    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET is missing');

      return this.stripe.webhooks.constructEvent(payload, header, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error: any) {
      logger.error(`[stripe] Error in constructing webhook event:`, error);
      throw new Error('[stripe] Could not construct webhook event');
    }
  };

  public async deleteCustomer(userId: string): Promise<any> {
    try {
      return this.stripe.customers.del(userId);
    } catch (error: any) {
      logger.error(`[stripe] Error during deleting customer ${userId}:`, error);

      return null;
    }
  };

  public async createBillingSession(
    customer: string,
  ): Promise<Stripe.BillingPortal.Session | null> {
    try {
      return this.stripe.billingPortal.sessions.create({
        customer,
        return_url: `${withoutTrailingSlash(process.env.APP_BASE_URL)}${PrivateRoutes.subscriptions}`,
      });
    } catch (error: any) {
      logger.error(`[stripe] Error creating billing session:`, error);

      throw new Error('Failed to create billing session');
    }
  };

  public async createCheckoutSession(priceId: string, config?: StripeSessionConfig): Promise<Stripe.Checkout.Session | null> {
    try {
      const {
        customer,
        customer_email,
        successPath,
        cancelPath,
        metadata,
        trial_period_days,
        currency
      } = config || {};

      return this.stripe.checkout.sessions.create({
        customer,
        customer_email,
        currency,
        adaptive_pricing: { enabled: true },
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        allow_promotion_codes: true,
        success_url: `${withoutTrailingSlash(process.env.APP_BASE_URL)}${successPath || PrivateRoutes.success}`,
        cancel_url: `${withoutTrailingSlash(process.env.APP_BASE_URL)}${cancelPath || PrivateRoutes.subscriptions}`,
        subscription_data: { metadata, trial_period_days },
        metadata,
      });
    } catch (error: any) {
      logger.error(`[stripe] Error creating checkout session:`, error);

      throw new Error('Failed to create checkout session');
    }
  };

  public async getAppPrices() {
    try {
      const { data } = await this.stripe.products.search({
        query: `active:'true' AND metadata["app"]:'coachbot' AND metadata["available"]:'true'`,
      });

      const pricePromises = data.map(({ id }) =>
        this.stripe.prices.search({
          query: `active:'true' AND product:'${id}'`,
          expand: ['data.product'],
        })
      );

      const pricesResults = await Promise.all(pricePromises);

      return pricesResults.flatMap((res) => res.data);
    } catch (error: any) {
      logger.error(`[stripe] Error during getting price list:`, error);

      return null;
    }
  };

  private getStudioStripeClient(): Stripe {
    if (!process.env.STUDIO_STRIPE_SECRET_KEY) {
      throw new Error('STUDIO_STRIPE_SECRET_KEY is missing in environment variables.');
    }

    return new Stripe(process.env.STUDIO_STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
      typescript: true,
    });
  }

  public async getStudioPrices() {
    try {
      const studioStripe = this.getStudioStripeClient();

      const allProducts = await studioStripe.products.list({
        active: true,
        limit: 100,
      });

      let studioProducts = allProducts.data.filter(p => {
        const metadata = p.metadata || {};
        return metadata.forStudio === 'true';
      });

      if (studioProducts.length === 0) {
        studioProducts = allProducts.data.filter(p => {
          const name = p.name.toLowerCase();
          return name.includes('professional') || name.includes('business');
        });
      }

      if (studioProducts.length === 0) {
        studioProducts = allProducts.data;
      }

      return await this.processStudioPrices(studioProducts, studioStripe);
    } catch (error: any) {
      logger.error(`[stripe] Error during getting studio price list:`, error);
      throw new Error('Failed to get studio prices');
    }
  }

  private async processStudioPrices(products: any[], studioStripe: Stripe) {
    const pricePromises = products.map((product) =>
      studioStripe.prices.list({
        product: product.id,
        active: true,
        expand: ['data.currency_options'],
      })
    );

    const priceResults = await Promise.all(pricePromises);
    const allPrices = priceResults.flatMap((result) =>
      result.data.map((price) => ({
        ...price,
        product: products.find((p) => p.id === price.product),
      }))
    );

    return { data: allPrices };
  }

  private async processPrices(products: any[]) {
    // Get all active prices for those products
    const pricePromises = products.map((product) =>
      this.stripe.prices.list({
        product: product.id,
        active: true,
        expand: ['data.currency_options'],
      })
    );

    const priceResults = await Promise.all(pricePromises);
    const allPrices = priceResults.flatMap((result) =>
      result.data.map((price) => ({
        ...price,
        product: products.find((p) => p.id === price.product),
      }))
    );

    return { data: allPrices };
  };

  public async createPrisingTableSession(customer: string): Promise<Stripe.CustomerSession | null> {
    try {
      return this.stripe.customerSessions.create({
        customer,
        components: {
          pricing_table: {
            enabled: true,
          },
        },
      });
    } catch (error: any) {
      logger.error(`[stripe] Error during creating checkout session for customer ${customer}:`, error);
      return null;
    }
  };

  public async cancelSubscription(subscriptionId: string, comment?: string) {
    try {
      return await this.stripe.subscriptions.cancel(subscriptionId, {
        cancellation_details: {
          comment:
            comment ||
            `[coachBot webhook] Canceled subscription (${subscriptionId}) as it is no longer active due to a new purchase.`,
        },
      });
    } catch (error) {
      console.error(`[stripeClient] Error canceling subscription ${subscriptionId}:`, error);
      return null;
    }
  }
}

export const stripeClient = StripeClient.getInstance();

