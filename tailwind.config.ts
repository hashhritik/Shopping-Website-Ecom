import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '300px',  
        'ss': '500px',  
        'xsm': '425px',
        'xml':'480px' ,
        'md1':'769px' ,
        'lg-md': '981px',
        'xlg': '1199px',
      },
      width: {
        "1280": "1280px",
        "1920": "1920px",
        "1400": "1400px",
        "105": "105px",
        "631": "631px",
        "337": "337px",
        "614": "614px",
        "207": "207px",
        "171": "171px",
        "162": "162px",
        "130": "130px",
        "392": "392px",
        "426": "426px",
        "396": "396px",
        "394": "394px",
        "195": "195px",
        "35": "35%",
        '65': '65%',
        '400':'400px',
        '200':'200px',
      },
      height: {
        '100':'100px',
        '10':'10px',
        '300':'300px',
        '270':'270px',
        '420':'420px',
        '550':'550px',
        '480':'480px',
        '380':'380px',
        '400':'400px',
        "56": "56px",
        "138": "138px",
        "747": "747px",
        "32": "32px",
        "333": "333px",
        "86": "86px",
        "52": "52px",
        "58": "58px",
        "756": "756px",
        "150": "150px",
        "91": "91px",
        "187": "187px",
        "30": "30px",
        "611": "611px",
        "131": "131px",
        "200": "200px",
        "105": "105%",
        "320": "320px",
        '41':'40px'
        
      },
      maxHeight: {
        "85": "85vh",
      },
      marginTop: {
        "70": "70px",
      },
      marginLeft: {
        "320": "320px",
      },
      borderRadius: {
        "10": "10px",
      },
      borderWidth: {
        "1": "1px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customGray: "#8A8A8A",
        grayish: "#484848",
      },
      fontFamily: {
        volk: ["Volkhov", "sans-serif"],
        jost: ["Jost", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        digitalNumbers: ["Digital Numbers", "sans-serif"],
      },
      letterSpacing: {
        "-0.055": "-0.055em",
      },
      rotate: {
        "18": "18deg",
      },
      boxShadow: {
        "inner-custom": "inset 0 0 0 4px #ffffff",
        "drop-custom": "0 0 0 1px #000000",
      },
      fontSize: {
        md: "18px",
        smd:'16px'
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: Function }) {
      addUtilities(
        {
          ".stroke-gray": {
            "-webkit-text-stroke": "2px gray",
          },
          ".text-transparent": {
            color: "transparent",
          },
          ".hide-scrollbar": {
            overflow: "scroll",
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          },
          ".hide-scrollbar::-webkit-scrollbar": {
            display: "none",
          },
        },
        ["responsive", "hover"]
      );
    },
  ],
};

export default config;
