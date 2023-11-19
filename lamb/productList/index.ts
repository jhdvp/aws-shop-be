import { products } from '../../data/products';

import { respBody } from '../respBody';

export const handler = async function(event: any) {
    const method = event.httpMethod;
    const path = event.path;

    if (method === "GET") {
      if (path === "/products") {
        return respBody(200, JSON.stringify(products));
      }
    }
}
