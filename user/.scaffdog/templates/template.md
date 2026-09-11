---
name: 'template'
root: '.'
output: ['src/components', 'src/components/Applications']
ignore: []
questions:
  name: 'Please enter components name.'
---

# `{{ inputs.name | pascal }}/index.ts`

```typescript
export { default } from './{{ inputs.name | pascal }}';
```

# `{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.stories.tsx`

```typescript
import { Meta, StoryObj } from '@storybook/react';
import {{ inputs.name | pascal }} from './{{ inputs.name | pascal }}';
import "@globals";

export default {
title: 'Components/{{ inputs.name | pascal }}',
tags: ["autodocs"],
component: {{ inputs.name | pascal }},
parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof {{ inputs.name | pascal }}>;

type Story = StoryObj<typeof {{ inputs.name | pascal }}>;

export const Default: Story = {
  args: {},
};
```

# `{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.tsx`

```typescript
import { FC } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type {{ inputs.name | pascal }}Props = {};

const {{ inputs.name | pascal }}: FC<{{ inputs.name | pascal }}Props> = () => {
return <div>{{ inputs.name }} Component</div>;
};

export default {{ inputs.name | pascal}};
```
