import anyToString from "../utils/anyToString";

/**
 * Helper function to create a link element.
 * @param url The URL to link to.
 * @param text The text to display for the link.
 * @returns The HTML string for the link element.
 * */
export default function link(url: string, text: string): string {
    // Create a link element with the provided URL and text.
    const a = document.createElement('a');
    a.href = anyToString(url);
    a.target = '_blank';
    a.innerHTML = anyToString(text);
    // Return the HTML string for the link element.
    return a.outerHTML;
};