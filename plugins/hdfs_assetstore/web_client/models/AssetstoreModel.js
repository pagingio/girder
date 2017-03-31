import AssetstoreModel from 'girder/models/AssetstoreModel';
import { restRequest } from 'girder/rest';

/**
 * Extends the core assetstore model to add HDFS-specific functionality.
 */
AssetstoreModel.hdfsImport = function (params) {
    restRequest({
        path: 'hdfs_assetstore/' + this.get('_id') + '/import',
        type: 'PUT',
        data: params,
        error: null
    }).then(() => {
        this.trigger('g:imported');
    }, (err) => {
        this.trigger('g:error', err);
    });

    return this;
};

export default AssetstoreModel;
