const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

module.exports = {
    "options": {
        "template_path": "./templates",
        "template_extension": ".hbs"
    },

    /**
     * Render template file with values.
     * 
     * @param {string} basename 
     * @param {object} data 
     * @param {object} options 
     * 
     * @returns string by filling template file.
     */
    "render_template": function(basename, data = {}, options = {}) {
        let template_path = options.template_path || this.options.template_path;
        let template_extension = options.template_extension || this.options.template_extension;

        let templateFilename = path.resolve(path.join(template_path, basename + template_extension));
        let source = fs.readFileSync(templateFilename, "utf8");

        return this.render(source, data);
    },

    /**
     * Render template string with values.
     *  
     * @param {string} source 
     * @param {object} data 
     * 
     * @returns string by filling template string.
     */
    "render": function(source, data) {
        let template = Handlebars.compile(source);
        return template(data);
    }
}