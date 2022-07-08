class ComponentCenter {
  register() {}
  removeInstance() {}
}

export const componentCenter = new ComponentCenter();

window.componentCenter = componentCenter;

class EventCenter {
  register() {}
  triggerEvent() {}
  triggerEventNew() {}
}

export const eventCenter = new EventCenter();

window.eventCenter = eventCenter;
