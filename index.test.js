const { render, render_template } = require('./index');
const fs = require('fs');
const path = require('path');

// Mock the fs module to control file system interactions
jest.mock('fs');

describe('render', () => {
    it('should render a simple template', () => {
        const source = 'Hello, {{name}}!';
        const data = { name: 'World' };
        const result = render(source, data);
        expect(result).toBe('Hello, World!');
    });

    it('should handle missing data', () => {
        const source = 'Hello, {{name}}!';
        const result = render(source, {});
        expect(result).toBe('Hello, !');
    });

    it('should throw an error for invalid source', () => {
        expect(() => render()).toThrow('Invalid template source');
        expect(() => render('')).toThrow('Invalid template source');
        expect(() => render(' ')).toThrow('Invalid template source');
        expect(() => render(123)).toThrow('Invalid template source');
    });


    it('should throw an error for invalid data', () => {
      expect(() => render('{{name}}', null)).toThrow('Invalid data: must be an object');
      expect(() => render('{{name}}', 'string')).toThrow('Invalid data: must be an object');
    });

    it('should throw an error for invalid options', () => {
        expect(() => render('{{name}}', {}, null)).toThrow('Invalid options: must be an object');
        expect(() => render('{{name}}', {}, 'string')).toThrow('Invalid options: must be an object');
    });
});




describe('render_template', () => {

    it('should render a template from a file', () => {
        const basename = 'test_template';
        const data = { name: 'World' };
        const templatePath = path.join(__dirname, '__mocks__');  // Path to your mock templates
        const options = { template_path: templatePath, template_extension: '.hbs' };

        // Mock the file read operation
        fs.readFileSync.mockReturnValue('Hello, {{name}}!');

        const result = render_template(basename, data, options);
        expect(result).toBe('Hello, World!');
        expect(fs.readFileSync).toHaveBeenCalledWith(path.join(templatePath, basename + '.hbs'), 'utf8');

    });


    it('should throw an error if template file is not found', () => {
        const basename = 'non_existent_template';
        const data = { name: 'World' };
        const options = { template_path: 'templates', template_extension: '.hbs' };
        fs.readFileSync.mockImplementation(() => {
            const err = new Error('File not found');
            err.code = 'ENOENT';
            throw err;
        });
        expect(() => {
            render_template(basename, data, options);
        }).toThrowError(`Template file not found: ${path.resolve(options.template_path, basename + options.template_extension)}`);

    });

    it('should throw an error if basename is not string', () => {
        const basename = 12;
        const data = { name: 'World' };
        const options = { template_path: 'templates', template_extension: '.hbs' };

        expect(() => render_template(basename, data, options)).toThrowError('Invalid basename: must be a non-empty string');
    });

    it('should throw an error if options is not object', () => {
        const basename = 'template';
        const data = { name: 'World' };
        const options = null;

        expect(() => render_template(basename, data, options)).toThrowError('Invalid options: must be an object');
    });

    it('should throw an error if read file thows error', () => {
        const basename = 'test_template';
        const data = { name: 'World' };
        const templatePath = path.join(__dirname, '__mocks__'); // Path to your mock templates
        const options = { template_path: templatePath, template_extension: '.hbs' };
        fs.readFileSync.mockImplementation(() => { throw new Error('some error'); });

        expect(() => render_template(basename, data, options)).toThrowError('Error reading template file: some error');
    });




});

