const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

/**
 * @typedef TemplateSetting - key/value settings to use during rendering.
 * @property {string} [template_path='templates'] - the path where templates are located.
 * @property {string} [template_extension='.hbs'] - the default extension for template files.
 */

/**
 * Render template file with values.
 *
 * @param {string} basename - Template file basename (no extension). The
 *   filename is resolved in the following manner: the options.template_path
 *   (default: 'templates') is resolved relative to the current working
 *   directory; the filename is then resolved relative to this path.
 * @param {object} [data={}] - the values to pass into template.
 * @param {TemplateSetting} [options={}] - the settings for the template.
 *
 * @returns {string} the rendered template.
 * @throws if the basename is not a non-empty string.
 * @throws if the options is not an object.
 * @throws if the template file is not found.
 * @throws if there is an error reading the template file.
 */
function render_template(basename, data = {}, options = {}) {
    /**
     * Check the basename argument.
     *
     * @throws if the basename is not a non-empty string.
     */
    if (typeof basename !== 'string' || basename.trim() === '') {
        throw new Error('Invalid basename: must be a non-empty string');
    }

    /**
     * Check the options argument.
     *
     * @throws if the options is not an object.
     */
    if (typeof options !== 'object' || options === null) {
        throw new Error('Invalid options: must be an object');
    }

    /**
     * Resolve the template filename.
     *
     * @type {string}
     */
    const templateFilename = path.resolve(
        options.template_path || this.options.template_path,
        basename + (options.template_extension || this.options.template_extension)
    );

    /**
     * Read the template file and render it.
     *
     * @throws if the template file is not found.
     * @throws if there is an error reading the template file.
     * @returns the rendered template.
     */
    try {
        return render(fs.readFileSync(templateFilename, "utf8"), data, options);
    } catch (e) {
        if (e.code === 'ENOENT') {
            throw new Error(`Template file not found: ${templateFilename}`);
        } else {
            throw new Error(`Error reading template file: ${e.message}`);
        }
    }
}

/**
 * Error subclass for template rendering errors.
 *
 * @param {string} message - the error message
 * @param {string} code - the error code
 * @extends Error
 */
class TemplateRenderError extends Error {
    constructor(message, code) {
        /**
         * The error message.
         *
         * @type {string}
         */
        super(message);

        /**
         * The error code.
         *
         * @type {string}
         */
        this.code = code;
    }
}

/**
 * Renders a Handlebars template with the given data and options.
 *
 * @param {string} source - the source of the template
 * @param {object} [data={}] - the data to pass to the template
 * @param {object} [execOptions={}] - the settings for the template
 * @returns {string} the rendered template
 * @throws {TemplateRenderError} if the template source is invalid
 * @throws {TemplateRenderError} if the data is invalid
 * @throws {TemplateRenderError} if the options are invalid
 * @throws {TemplateRenderError} if the template compilation fails
 * @throws {TemplateRenderError} if the template rendering fails
 */
function render(source, data = {}, execOptions = {}) {
    try {
        // Validate and sanitize the source input
        if (typeof source !== 'string' || !source.trim()) {
            throw new TemplateRenderError('Invalid template source', 'INVALID_SOURCE');
        }

        // Validate and sanitize the data input
        if (typeof data !== 'object' || data === null) {
            throw new TemplateRenderError('Invalid data: must be an object', 'INVALID_DATA');
        }

        // Validate and sanitize the options input
        if (typeof execOptions !== 'object' || execOptions === null) {
            throw new TemplateRenderError('Invalid options: must be an object', 'INVALID_OPTIONS');
        }

        // Sanitize the data and options
        const sanitizedData = sanitizeData(data);
        const sanitizedExecOptions = sanitizeExecOptions(execOptions);

        // Compile the template
        const template = Handlebars.compile(source);

        // Render the template with sanitized data and options
        return template(sanitizedData, sanitizedExecOptions);
    } catch (error) {
        if (error instanceof TemplateRenderError) {
            throw error;
        }

        throw new TemplateRenderError('Error rendering template', 'TEMPLATE_RENDER_ERROR', { cause: error });
    }
}

/**
 * Sanitizes the given data input.
 *
 * @param {object} data - the data to sanitize
 * @returns {object} the sanitized data
 */
function sanitizeData(data) {
    // Implement data sanitization logic here
    // For example, escape HTML entities
    return data;
}

/**
 * Sanitizes the given options input.
 *
 * @param {object} options - the options to sanitize
 * @returns {object} the sanitized options
 */
function sanitizeExecOptions(options) {
    // Implement options sanitization logic here
    return options;
}

module.exports = {
    "options": {
        "template_path": "templates",
        "template_extension": ".hbs"
    },
    render_template,
    render,
}
