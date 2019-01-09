import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) {

  }

  create(product) {
    return this.db.list('/products').push(product);
  }

  getAll() {
    return this.db.list('/products')
      .snapshotChanges()
      .pipe(
        map(x => x.map(item => ({ ...JSON.parse(JSON.stringify(item.payload)), key: item.key }))
        ));
  }

  get(productId) {
    return this.db.object('/products/' + productId)
  }

  update(productId, product) {
    return this.db.object('/products/' + productId).update(product)
  }

  delete(productId) {
    this.db.object('/products/' + productId).remove()
  }
}
