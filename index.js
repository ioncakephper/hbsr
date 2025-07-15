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
        options.template_path || module.exports.options.template_path,
        basename + (options.template_extension || module.exports.options.template_extension)
    );

    /**
     * Read the template file and render it.
     *
     * @throws if the template file is not found.
     * @throws if there is an error reading the template file.
     * @returns the rendered template.
     */
    try{
        const templateContent = fs.readFileSync(templateFilename, "utf8");
        return module.exports.render(templateContent, data, options);
    } catch (error){
        if (error.code === 'ENOENT'){
            throw new Error(`Template file not found: ${templateFilename}`);    
        }
        throw new Error(`Error reading template file: ${error.message}`);
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
    constructor(message, code, options) {
        /**
         * The error message.
         *
         * @type {string}
         */
        super(message, options);

        /**
         * The error code.
         *
         * @type {string}
         */
        this.code = code;
    }
}

const templateCache = new Map();

/**
 * Renders a Handlebars template with the given data and options.
 *
 * @param {string} source - The source code of the Handlebars template.
 * @param {object} [data={}] - The data to pass to the template.
 * @param {object} [execOptions={}] - The execution options for the Handlebars template.
 * @returns {string} The rendered template output.
 * @throws {TemplateRenderError} If the template source is invalid, data is invalid, options are invalid, compilation fails, or rendering fails.
 */
function render(source, data = {}, execOptions = {}) {
    // Validate and sanitize the source input upfront
    if (typeof source !== 'string' || !source.trim()) {
        throw new TemplateRenderError('Invalid template source', 'INVALID_SOURCE');
    }
    const cacheKey = source;
    let template;
    // Check if the template is already cached
    if (templateCache.has(cacheKey)) {
        template = templateCache.get(cacheKey);
    } else {
        // Compile the template and cache it
        template = Handlebars.compile(source);
        templateCache.set(cacheKey, template);
    }
    // Validate and sanitize the data and options inputs
    validateAndSanitizeInputs(data, execOptions);
    try {
        // Render the template with sanitized data and options
        return template(sanitizeData(data), sanitizeExecOptions(execOptions));
    } catch (error) {
        throw new TemplateRenderError('Error rendering template', 'TEMPLATE_RENDER_ERROR', { cause: error });
    }
}
function validateAndSanitizeInputs(data, execOptions) {
    if (typeof data !== 'object' || data === null) {
        throw new TemplateRenderError('Invalid data: must be an object', 'INVALID_DATA');
    }
    if (typeof execOptions !== 'object' || execOptions === null) {
        throw new TemplateRenderError('Invalid options: must be an object', 'INVALID_OPTIONS');
    }
}

/**
 * Recursively sanitizes data by escaping HTML characters in strings.
 * It traverses objects and arrays, converting characters like `<`, `>`, `&`
 * into their hexadecimal entity equivalents (e.g., `&#x3C;`) to prevent XSS attacks.
 *
 * @param {*} data - The data to sanitize. Can be a string, array, object, or any other type.
 * @returns {*} The sanitized data, with all string values escaped.
 */
function sanitizeData(data) {
    if (typeof data === "string") {
        // Use a single replace with a function to handle all replacements
        return data.replace(/[&<>\"']/g, function (match) {
            const entities = {
                '&': '&#x26;',
                '<': '&#x3C;',
                '>': '&#x3E;',
                '"': '&#x22;',
                "'": '&#x27;'
            };
            return entities[match];
        });
    } else if (Array.isArray(data)) {
        return data.map(sanitizeData);
    } else if (data !== null && typeof data === 'object') {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, sanitizeData(value)])
        );
    }
    return data; // Return non-string, non-object, non-array values as-is
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
