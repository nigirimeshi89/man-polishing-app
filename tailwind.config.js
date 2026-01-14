/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    DEFAULT: "#050505",
                    card: "#111111",
                },
                gold: {
                    main: "#d4af37",
                    light: "#fcf6ba",
                    dark: "#8a6e2f",
                }
            },
            backgroundImage: {
                'carbon': `
          linear-gradient(27deg, #151515 5px, transparent 5px),
          linear-gradient(207deg, #151515 5px, transparent 5px),
          linear-gradient(27deg, #222 5px, transparent 5px),
          linear-gradient(207deg, #222 5px, transparent 5px),
          linear-gradient(90deg, #1b1b1b 10px, transparent 10px),
          linear-gradient(#1d1d1d 25%, #1a1a1a 25%, #1a1a1a 50%, transparent 50%, transparent 75%, #242424 75%, #242424)
        `,
                'gold-gradient': 'linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Oswald"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}