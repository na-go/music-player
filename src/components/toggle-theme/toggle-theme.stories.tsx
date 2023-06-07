// Component: ToggleTheme

import { action } from "@storybook/addon-actions";

import ToggleTheme from ".";

import type { Meta, StoryFn } from "@storybook/react";

const meta: Meta<typeof ToggleTheme> = {
  title: "Components/ToggleTheme",
  component: ToggleTheme,
  argTypes: {
    value: {
      control: { type: "radio" },
      options: ["light", "dark"],
    },
  },
  args: {
    value: "light",
  },
};

export default meta;

const Template: StoryFn<typeof ToggleTheme> = (args) => <ToggleTheme {...args} onClick={action("change")} />;

export const Default = Template.bind({});
