import HierarchyWidget from 'girder/views/widgets/HierarchyWidget';
import { restRequest } from 'girder/rest';
import { wrap } from 'girder/utilities/PluginUtils';

/**
 * Allow selecting license when uploading an item.
 */
wrap(HierarchyWidget, 'uploadDialog', function (uploadDialog) {
    restRequest({
        type: 'GET',
        path: 'item/licenses'
    }).then((resp) => {
        this.licenses = resp;
        uploadDialog.call(this);
    });

    return this;
});

/**
 * Allow selecting license when creating an item.
 */
wrap(HierarchyWidget, 'createItemDialog', function (createItemDialog) {
    restRequest({
        type: 'GET',
        path: 'item/licenses'
    }).then((resp) => {
        this.licenses = resp;
        createItemDialog.call(this);
    });

    return this;
});
