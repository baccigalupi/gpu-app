type UiDataStore = Record<string, any>;
export class UiData {
  data: UiDataStore;

  constructor(store: UiDataStore) {
    this.data = store;
  }

  update(key: string, value: any) {
    this.data[key] = value;
  }

  updater() {
    return ({ target } : Event) => {
      if (!target) return;

      const input = target as HTMLInputElement;
      this.update(input.name, input.value);
    }
  }

  get(key: string) {
    return this.data[key];
  }
}

export const buildUiData = () => {
  return new UiData({
    frameRate: 0,
    alphaValue: 0.95,
  })
}