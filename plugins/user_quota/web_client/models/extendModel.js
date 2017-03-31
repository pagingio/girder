import AssetstoreCollection from 'girder/collections/AssetstoreCollection';
import { getCurrentUser } from 'girder/auth';
import { restRequest } from 'girder/rest';

function extendModel(Model, modelType) {
    /* Saves the quota policy on this model to the server.  Saves the
     * state of whatever this model's "quotaPolicy" parameter is set
     * to.  When done, triggers the 'g:quotaPolicySaved' event on the
     * model.
     */
    Model.prototype.updateQuotaPolicy = function () {
        restRequest({
            path: this.resourceName + '/' + this.get('_id') + '/quota',
            type: 'PUT',
            error: null,
            data: {
                policy: JSON.stringify(this.get('quotaPolicy'))
            }
        }).then(() => {
            this.trigger('g:quotaPolicySaved');
        }, (err) => {
            this.trigger('g:error', err);
        });

        return this;
    };

    /* Fetches the quota policy from the server, and sets it as the
     * quotaPolicy property.
     * @param force: By default, this only fetches quotaPolicy if it
     *               hasn't already been set on the model.  If you want
     *               to force a refresh anyway, set this param to true.
     */
    Model.prototype.fetchQuotaPolicy = function (force) {
        this.off('g:fetched').on('g:fetched', function () {
            this.fetchAssetstores(force);
        });
        if (!this.get('quotaPolicy') || force) {
            restRequest({
                path: this.resourceName + '/' + this.get('_id') + '/quota',
                type: 'GET'
            }).then((resp) => {
                this.set('quotaPolicy', resp.quota);
                this.fetch();
            }, (err) => {
                this.trigger('g:error', err);
            });
        } else {
            this.fetch();
        }
        return this;
    };

    /* Fetches the list of assetstores from the server, and sets it as
     * the assetstoreList property.  This is the second part of
     * fetching quota policy, as we need to know the assetstores for
     * the user interface.
     * @param force: By default, this only fetches assetstoreList if it
     *               hasn't already been set on the model.  If you want
     *               to force a refresh anyway, set this param to true.
     */
    Model.prototype.fetchAssetstores = function (force) {
        if (getCurrentUser().get('admin') &&
                (!this.get('assetstoreList') || force)) {
            this.set('assetstoreList',
                     new AssetstoreCollection());
            this.get('assetstoreList').on('g:changed', function () {
                this.fetchDefaultQuota(force);
            }, this).fetch();
        } else {
            this.fetchDefaultQuota(force);
        }
        return this;
    };

    /* Fetches the global default setting for quota for this resource.
     * @param force: By default, this only fetches the default quota if
     *               it hasn't already been set on the model.  If you
     *               want to force a refresh anyway, set this param to
     *               true.
     */
    Model.prototype.fetchDefaultQuota = function (force) {
        if (getCurrentUser().get('admin') &&
                (!this.get('defaultQuota') || force)) {
            restRequest({
                path: 'system/setting',
                type: 'GET',
                data: {
                    key: 'user_quota.default_' + modelType + '_quota'
                }
            }).then((resp) => {
                this.set('defaultQuota', resp);
                this.trigger('g:quotaPolicyFetched');
            });
        } else {
            this.trigger('g:quotaPolicyFetched');
        }
        return this;
    };
}

export default extendModel;
