// src/global.d.ts
export {};  // để TS coi đây là module riêng

interface PayPalSDK {
  Buttons(options: Record<string, unknown>): {
    render(selector: string): Promise<void>;
  };
  // … nếu cần add thêm method khác
}

declare global {
  interface Window {
    /** SDK PayPal sẽ được gắn vào đây */
    paypal?: PayPalSDK;
  }
}
