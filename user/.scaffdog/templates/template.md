---
name: "template"
root: "."
output: "src/components"
ignore: []
questions:
  name: "Please enter components name."
---

# `{{ inputs.name | pascal }}/index.ts`

```typescript
export { default } from "./{{ inputs.name | pascal }}";
```

# `{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.stories.tsx`

```typescript
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {{ inputs.name | pascal }} from './{{ inputs.name | pascal }}';

export default {
title: 'Components/{{ inputs.name | pascal }}',
component: {{ inputs.name | pascal }},
} as Meta<typeof {{ inputs.name | pascal }}>;

type Story = StoryObj<typeof {{ inputs.name | pascal }}>;

export const Default: Story = {
  args: {

  },
};
```

# `{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.tsx`

```typescript
import React, { FC } from 'react';

type {{ inputs.name }}Props = {};

const {{ inputs.name | pascal }}: FC<{{ inputs.name }}Props> = () => {
return <div>{{ inputs.name }} Component</div>;
};

export default {{ inputs.name | pascal}};
```
