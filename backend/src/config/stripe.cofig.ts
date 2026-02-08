import Stripe from "stripe";

import { STRIPE_SECRET_KEY } from "../utils/constants";

export const stripe = new Stripe(STRIPE_SECRET_KEY);
