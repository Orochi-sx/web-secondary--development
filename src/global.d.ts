interface FormAttribute {
  componentId: string;
  data?: any;
  onChange?: () => void;
  type: string;
}

interface Window {
  _form: FormAttribute;
  CUSTOM_PLUGIN: any;
  pubSub: any;
}
