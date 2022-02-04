const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

module.exports = {
    "options": {
        "template_path": path.join(__dirname, '../../', "templates"),
        "template_extension": ".hbs"
    },

    /**
     * Render template file with values.
     * 
     * @param {string} basename Template file basename (no extension).
     * @param {object} data Values to pass into template.
     * @param {object} options Template path and template extension.
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
     * @param {string} source Template string.
     * @param {object} data Values to pass into template.
     * 
     * @returns string by filling template string.
     */
    "render": function(source, data) {
        let template = Handlebars.compile(source);
        return template(data);
    }
}