
  import React from 'react';

  export interface FormAttribute {
    componentId: string;
    data?: any;
    onChange?: (values: any| any[]) => void;
    type: string;
  }
  declare  const App: React.FC<FormAttribute>

  export default App
