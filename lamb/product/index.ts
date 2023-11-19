import { products } from '../../data/products';

import { respBody } from '../respBody';

export const handler = async function(event: any) {
    const method = event.httpMethod;
    const productId = event.pathParameters.productId;

    if (method === "GET") {
      const product = products.find(item => item.id === productId);

      if (product) {
        return respBody(200, JSON.stringify(product));
      }

      return respBody(400, 'Product not found');
    }
}