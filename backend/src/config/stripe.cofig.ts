import Stripe from 'stripe';

import { env } from '../utils/env-validation';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);
