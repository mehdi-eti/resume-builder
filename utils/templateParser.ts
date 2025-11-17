// A simple getter to access nested properties of an object using a string path.
const simpleGet = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

/**
 * Parses a template string with simple placeholders and #each blocks.
 * @param html The template HTML string.
 * @param data The data object to populate the template with.
 * @returns The parsed HTML string.
 */
export const parseTemplate = (html: string, data: any): string => {
    if (!data) return html;
    let parsedHtml = html;

    // Regex to find all {{#each <arrayPath>}}...{{/each}} blocks.
    // It captures the array path and the content inside the block.
    const eachRegex = /\{\{#each\s+(.*?)\}\}([\s\S]*?)\{\{\/each\}\}/g;

    parsedHtml = parsedHtml.replace(eachRegex, (match, arrayPath, blockContent) => {
        const array = simpleGet(data, arrayPath.trim());
        if (!Array.isArray(array)) {
            console.warn(`Template Parser: Path "${arrayPath}" is not an array.`);
            return '';
        }

        // For each item in the array, process the block's content.
        return array.map(item => {
            // Regex to find all {{...}} placeholders inside the #each block.
            return blockContent.replace(/\{\{(.*?)\}\}/g, (placeholderMatch, placeholderPath) => {
                const trimmedPath = placeholderPath.trim();
                // Inside an #each block, placeholders can refer to properties of the current item.
                // We support `this.property` or just `property`.
                const value = trimmedPath.startsWith('this.')
                    ? simpleGet(item, trimmedPath.substring(5))
                    : simpleGet(item, trimmedPath);
                
                return value !== undefined && value !== null ? String(value) : '';
            });
        }).join('');
    });

    // Replace all remaining simple {{path.to.value}} placeholders outside of #each blocks.
    parsedHtml = parsedHtml.replace(/\{\{(?!#each)(.*?)\}\}/g, (match, path) => {
        const value = simpleGet(data, path.trim());
        return value !== undefined && value !== null ? String(value) : '';
    });

    return parsedHtml;
};
