export class UiData {
  data: Record<string, any>;

  constructor() {
    this.data = {};
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

export const buildUiData = () => new UiData;