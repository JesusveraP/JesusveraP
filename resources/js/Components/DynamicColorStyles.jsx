import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

const colorMap = {
    green: { 50: '240, 253, 244', 100: '220, 252, 231', 200: '187, 247, 208', 300: '134, 239, 172', 400: '74, 222, 128', 500: '34, 197, 94', 600: '22, 163, 74', 700: '16, 185, 74', 800: '20, 83, 45', 900: '20, 83, 45' },
    blue: { 50: '239, 246, 255', 100: '219, 234, 254', 200: '191, 219, 254', 300: '147, 197, 253', 400: '96, 165, 250', 500: '59, 130, 246', 600: '37, 99, 235', 700: '29, 78, 216', 800: '30, 58, 138', 900: '30, 58, 138' },
    indigo: { 50: '238, 242, 255', 100: '224, 231, 255', 200: '199, 210, 254', 300: '165, 180, 252', 400: '129, 140, 248', 500: '99, 102, 241', 600: '79, 70, 229', 700: '67, 56, 202', 800: '55, 48, 163', 900: '55, 48, 163' },
    purple: { 50: '250, 245, 255', 100: '243, 232, 255', 200: '232, 204, 255', 300: '216, 180, 254', 400: '192, 132, 250', 500: '168, 85, 247', 600: '147, 51, 234', 700: '126, 34, 206', 800: '88, 28, 135', 900: '88, 28, 135' },
    red: { 50: '254, 242, 242', 100: '254, 226, 226', 200: '254, 202, 202', 300: '252, 165, 165', 400: '248, 113, 113', 500: '239, 68, 68', 600: '220, 38, 38', 700: '185, 28, 28', 800: '127, 29, 29', 900: '127, 29, 29' },
    orange: { 50: '255, 247, 237', 100: '255, 237, 213', 200: '254, 215, 170', 300: '253, 186, 116', 400: '251, 146, 60', 500: '249, 115, 22', 600: '234, 88, 12', 700: '194, 65, 12', 800: '124, 45, 18', 900: '124, 45, 18' },
    yellow: { 50: '254, 252, 232', 100: '254, 248, 204', 200: '254, 240, 138', 300: '253, 224, 71', 400: '250, 204, 21', 500: '234, 179, 8', 600: '202, 138, 4', 700: '161, 98, 7', 800: '113, 63, 18', 900: '113, 63, 18' },
    teal: { 50: '240, 253, 250', 100: '204, 251, 241', 200: '153, 246, 228', 300: '94, 234, 212', 400: '45, 212, 191', 500: '20, 184, 166', 600: '13, 148, 136', 700: '15, 118, 110', 800: '20, 83, 80', 900: '20, 83, 80' },
    cyan: { 50: '240, 249, 250', 100: '207, 250, 254', 200: '165, 243, 252', 300: '103, 232, 249', 400: '34, 211, 238', 500: '34, 211, 238', 600: '8, 145, 178', 700: '14, 116, 144', 800: '21, 94, 117', 900: '21, 94, 117' },
    gray: { 50: '249, 250, 251', 100: '243, 244, 246', 200: '229, 231, 235', 300: '209, 213, 219', 400: '156, 163, 175', 500: '107, 114, 128', 600: '75, 85, 99', 700: '55, 65, 81', 800: '31, 41, 55', 900: '17, 24, 39' },
    slate: { 50: '248, 250, 252', 100: '241, 245, 249', 200: '226, 232, 240', 300: '203, 213, 225', 400: '148, 163, 184', 500: '100, 116, 139', 600: '71, 85, 105', 700: '51, 65, 85', 800: '30, 41, 59', 900: '15, 23, 42' },
    stone: { 50: '250, 250, 249', 100: '245, 245, 244', 200: '231, 229, 228', 300: '214, 211, 209', 400: '168, 162, 158', 500: '120, 113, 108', 600: '87, 83, 82', 700: '68, 64, 60', 800: '41, 37, 36', 900: '28, 25, 23' }
};

export default function DynamicColorStyles() {
    const { systemSettings } = usePage().props;

    useEffect(() => {
        const primaryColor = systemSettings?.primary_color || 'green';
        const colorValues = colorMap[primaryColor] || colorMap.green;

        let styleTag = document.getElementById('dynamic-color-styles-main');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-color-styles-main';
            document.head.appendChild(styleTag);
        }

        const cssRules = `
            :root {
                --primary-50: ${colorValues['50']};
                --primary-100: ${colorValues['100']};
                --primary-200: ${colorValues['200']};
                --primary-300: ${colorValues['300']};
                --primary-400: ${colorValues['400']};
                --primary-500: ${colorValues['500']};
                --primary-600: ${colorValues['600']};
                --primary-700: ${colorValues['700']};
                --primary-800: ${colorValues['800']};
                --primary-900: ${colorValues['900']};
            }

            .bg-green-50 { background-color: rgb(var(--primary-50)) !important; }
            .bg-green-100 { background-color: rgb(var(--primary-100)) !important; }
            .bg-green-200 { background-color: rgb(var(--primary-200)) !important; }
            .bg-green-300 { background-color: rgb(var(--primary-300)) !important; }
            .bg-green-400 { background-color: rgb(var(--primary-400)) !important; }
            .bg-green-500 { background-color: rgb(var(--primary-500)) !important; }
            .bg-green-600 { background-color: rgb(var(--primary-600)) !important; }
            .bg-green-700 { background-color: rgb(var(--primary-700)) !important; }
            .bg-green-800 { background-color: rgb(var(--primary-800)) !important; }
            .bg-green-900 { background-color: rgb(var(--primary-900)) !important; }

            .text-green-50 { color: rgb(var(--primary-50)) !important; }
            .text-green-100 { color: rgb(var(--primary-100)) !important; }
            .text-green-200 { color: rgb(var(--primary-200)) !important; }
            .text-green-300 { color: rgb(var(--primary-300)) !important; }
            .text-green-400 { color: rgb(var(--primary-400)) !important; }
            .text-green-500 { color: rgb(var(--primary-500)) !important; }
            .text-green-600 { color: rgb(var(--primary-600)) !important; }
            .text-green-700 { color: rgb(var(--primary-700)) !important; }
            .text-green-800 { color: rgb(var(--primary-800)) !important; }
            .text-green-900 { color: rgb(var(--primary-900)) !important; }

            .border-green-50 { border-color: rgb(var(--primary-50)) !important; }
            .border-green-100 { border-color: rgb(var(--primary-100)) !important; }
            .border-green-200 { border-color: rgb(var(--primary-200)) !important; }
            .border-green-300 { border-color: rgb(var(--primary-300)) !important; }
            .border-green-400 { border-color: rgb(var(--primary-400)) !important; }
            .border-green-500 { border-color: rgb(var(--primary-500)) !important; }
            .border-green-600 { border-color: rgb(var(--primary-600)) !important; }
            .border-green-700 { border-color: rgb(var(--primary-700)) !important; }
            .border-green-800 { border-color: rgb(var(--primary-800)) !important; }
            .border-green-900 { border-color: rgb(var(--primary-900)) !important; }

            .ring-green-500 { --tw-ring-color: rgb(var(--primary-500)) !important; }
            .focus\\:ring-green-500:focus { --tw-ring-color: rgb(var(--primary-500)) !important; }
            .focus\\:border-green-500:focus { border-color: rgb(var(--primary-500)) !important; }
            
            .hover\\:bg-green-50:hover { background-color: rgb(var(--primary-50)) !important; }
            .hover\\:bg-green-100:hover { background-color: rgb(var(--primary-100)) !important; }
            .hover\\:bg-green-600:hover { background-color: rgb(var(--primary-600)) !important; }
            .hover\\:bg-green-700:hover { background-color: rgb(var(--primary-700)) !important; }
            .hover\\:text-green-600:hover { color: rgb(var(--primary-600)) !important; }
            .hover\\:text-green-700:hover { color: rgb(var(--primary-700)) !important; }
            .hover\\:border-green-300:hover { border-color: rgb(var(--primary-300)) !important; }
            .hover\\:border-green-400:hover { border-color: rgb(var(--primary-400)) !important; }
        `;

        styleTag.textContent = cssRules;

    }, [systemSettings?.primary_color]);

    return null;
}