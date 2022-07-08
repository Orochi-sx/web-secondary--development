interface FormAttribute {
  componentId: string;
  data?: any;
  onChange?: () => void;
  type: string;
}

interface ComponentCenter {
  register: any;
  removeInstance: any;
}
interface EventCenter {
  register: any;
  triggerEventNew: any;
}

interface Window {
  _form: FormAttribute;
  CUSTOM_PLUGIN: any;
  componentCenter: ComponentCenter;
  eventCenter: EventCenter;
}
