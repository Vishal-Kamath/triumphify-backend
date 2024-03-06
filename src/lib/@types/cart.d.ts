import { Product, Variation } from "./product";

export interface Cart {
  id: string;
  product: Product;
  variation: Variation;
  quantity: number;
}
