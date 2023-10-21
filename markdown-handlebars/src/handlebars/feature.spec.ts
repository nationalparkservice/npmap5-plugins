import { QueryFeature } from '..';
import feature from './feature';
import Handlebars, { HelperOptions } from 'handlebars';

// Register the helper
Handlebars.registerHelper('feature', feature);

describe('feature Handlebars Helper', () => {
    it('should extract data from maplibre feature and use it in a provided template', () => {
        // Define a mock Handlebars options object with feature data
        const mockOptions: HelperOptions = {
            data: {
                feature: {
                    source: 'TEST',
                    id: 'ID',
                    layer: {
                        layout: {
                            'icon-image': 'airplane'
                        }
                    }
                } as QueryFeature
            }
        } as HelperOptions;

        const template = Handlebars.compile(`{{feature 'Source: {{source}}, Name: {{id}}, Icon: {{layer.layout.icon-image}}' }}`);
        const rendered = template({}, mockOptions);

        expect(rendered).toBe('Source: TEST, Name: ID, Icon: airplane');
    });
});
