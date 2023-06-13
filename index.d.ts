declare module "hbsr";


/**
 * Render template file with values.
 * 
 * @param {string} basename - Template file basename (no extension).
 * @param {object} data - the values to pass into template.
 * @param {TemplateSetting} [options={}] - the settings for the template.
 * 
 * @returns string by filling template file.
 */
export function render_template(basename: string, data: any, options: any) : string;

/**
 * Renders a template with the given data.
 * @param {string} source - the source of the template
 * @param {object} [data={}] - the data to pass to the template
 * @param {TemplateSetting} [options={}] - the options to pass to the template
 * @returns {string} the rendered template
 */
export function render(source: string, data: any, options: any): string;
export const options: {template_path: string; template_extension: string;}