import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Product } from './models/product';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  create() {
    return this.db.list('/shopping-carts').push({
      dataCreated: new Date().getTime()
    });
  }
  private getCart(cartId: string) {
    return this.db.object('/shopping-carts/' + cartId);
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId)
  }

  private async getOrCreateCartId() {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      return cartId;
    }
    const result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  async addToCard(product: Product) {
    const cartId = await this.getOrCreateCartId();
    const item$ = this.getItem(cartId, product.key);
    item$.valueChanges().pipe(take(1)).subscribe(item => {
      if (item) {
        item$.update({ quantity: item.quantity + 1 });
      } else {
        item$.set({ product: product, quantity: 1 });
      }
    });

  }
}
