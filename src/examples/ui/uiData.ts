export class UiData {
  data: Record<string, any>;

  constructor() {
    this.data = {};
  }

  update(key: string, value: any) {
    this.data[key] = value;
  }

  updater(key: string) {
    return ({ target } : Event) => {
      if (!target) return;

      this.update(
        key,
        (target as HTMLInputElement).value
      );
    }
  }

  get(key: string) {
    return this.data[key];
  }
}

export const buildUiData = () => new UiData;