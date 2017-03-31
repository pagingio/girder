import FrontPageView from 'girder/views/body/FrontPageView';
import { renderMarkdown } from 'girder/misc';
import { restRequest } from 'girder/rest';
import { wrap } from 'girder/utilities/PluginUtils';

wrap(FrontPageView, 'render', function (render) {
    restRequest({
        type: 'GET',
        path: 'homepage/markdown'
    }).then((resp) => {
        this.$el.html(renderMarkdown(resp['homepage.markdown']));
    });

    return this;
});
