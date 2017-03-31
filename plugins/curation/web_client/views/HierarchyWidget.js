import $ from 'jquery';

import HierarchyWidget from 'girder/views/widgets/HierarchyWidget';
import { getCurrentUser } from 'girder/auth';
import { restRequest } from 'girder/rest';
import { wrap } from 'girder/utilities/PluginUtils';

import CurationDialog from './CurationDialog';
import HierarchyWidgetCurationButtonTemplate from '../templates/hierarchyWidgetCurationButton.pug';

function _addCurationButton() {
    $('.g-folder-actions-menu').append(HierarchyWidgetCurationButtonTemplate());
}

// add curation button to hiearchy widget
wrap(HierarchyWidget, 'render', function (render) {
    render.call(this);

    if (this.parentModel.get('_modelType') === 'folder') {
        // add button if an admin or if curation is enabled
        if (getCurrentUser().get('admin')) {
            _addCurationButton();
        } else {
            restRequest({
                path: 'folder/' + this.parentModel.get('_id') + '/curation'
            }).then((resp) => {
                if (resp.enabled) {
                    _addCurationButton();
                }
            });
        }
    }

    return this;
});

// launch modal when curation button is clicked
HierarchyWidget.prototype.events['click .g-curation-button'] = function (e) {
    /* eslint-disable no-new */
    new CurationDialog({
        el: $('#g-dialog-container'),
        parentView: this,
        folder: this.parentModel
    });
    /* eslint-enable no-new */
};
