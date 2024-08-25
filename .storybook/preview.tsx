import type { Preview } from "@storybook/react";
import "../src/styles/global.css";
// import React from "react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    // (Story) => (
    //   <div style={{ margin: "3em" }}>
    //     {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
    //     <Story />
    //   </div>
    // ),
  ],
};

export default preview;
