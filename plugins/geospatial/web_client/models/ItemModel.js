import ItemModel from 'girder/models/ItemModel';
import { restRequest } from 'girder/rest';
import { wrap } from 'girder/utilities/PluginUtils';

wrap(ItemModel, 'fetch', function (fetch) {
    fetch.call(this);
    restRequest({
        path: this.resourceName + '/' + this.get('_id') + '/geospatial',
        error: null
    }).then((resp) => {
        this.set(resp);
    }, (err) => {
        this.trigger('g:error', err);
    });
    return this;
});
