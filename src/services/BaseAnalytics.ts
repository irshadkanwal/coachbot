export abstract class BaseAnalytics {
  protected scriptLoaded = false;
  public abstract scriptId: string;
  public abstract scriptSrc: string;

  private static instances: Map<string, BaseAnalytics> = new Map();

  public constructor() { }

  public static getInstance<T extends BaseAnalytics>(this: new () => T): T {
    const className = this.name;
    if (!BaseAnalytics.instances.has(className)) {
      BaseAnalytics.instances.set(className, new this());
    }
    return BaseAnalytics.instances.get(className) as T;
  }

  public async init(): Promise<void> {
    if (this.scriptLoaded || typeof window === 'undefined') return;

    if (document.getElementById(this.scriptId)) {
      this.scriptLoaded = true;
      return;
    }

    try {
      this.beforeScriptCreation();
      await this.loadScript(this.scriptSrc);
      this.scriptLoaded = true;
      this.onScriptLoaded();
    } catch (error: any) {
      console.error(`[BaseAnalytics] Error during init script "${this.scriptId}": ${error}`);
    }
  }

  protected abstract beforeScriptCreation(): void;
  protected abstract onScriptLoaded(): void;

  private loadScript(scriptSrc: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = this.scriptId;
      script.async = true;
      script.src = scriptSrc;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load analytics script'));

      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    });
  }
}
