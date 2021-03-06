import RxQuery from './rx-query';
import RxDocument from './rx-document';
import { OBSERVABLES_SYMBOL } from './constants';

export default {
  rxdb: true,
  prototypes: {
    RxQuery
  },
  overwritable: {},
  hooks: {
    createRxCollection(collection) {
      const { options } = collection;
      if (!options || !options.views) return;

      const desc = Object.getOwnPropertyDescriptors(options.views);
      const views = Object.entries(desc).filter(([_, { get }]) => get);
      // Views keys live on collection._views
      collection._views = views.map(([key]) => key);

      const proto = collection.getDocumentPrototype();
      RxDocument(proto, views);
    },
    postCreateRxDocument(doc) {
      doc[OBSERVABLES_SYMBOL] = {};
    }
  }
};
