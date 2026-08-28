declare module 'dashboard/lifecycles' {
  export const bootstrap: import('single-spa').LifeCycles<Record<string, unknown>>['bootstrap'];
  export const mount: import('single-spa').LifeCycles<Record<string, unknown>>['mount'];
  export const unmount: import('single-spa').LifeCycles<Record<string, unknown>>['unmount'];
}

declare module 'accounts/lifecycles' {
  export const bootstrap: import('single-spa').LifeCycles<Record<string, unknown>>['bootstrap'];
  export const mount: import('single-spa').LifeCycles<Record<string, unknown>>['mount'];
  export const unmount: import('single-spa').LifeCycles<Record<string, unknown>>['unmount'];
}

declare module 'payments/lifecycles' {
  export const bootstrap: import('single-spa').LifeCycles<Record<string, unknown>>['bootstrap'];
  export const mount: import('single-spa').LifeCycles<Record<string, unknown>>['mount'];
  export const unmount: import('single-spa').LifeCycles<Record<string, unknown>>['unmount'];
}

declare module 'insurance/lifecycles' {
  export const bootstrap: import('single-spa').LifeCycles<Record<string, unknown>>['bootstrap'];
  export const mount: import('single-spa').LifeCycles<Record<string, unknown>>['mount'];
  export const unmount: import('single-spa').LifeCycles<Record<string, unknown>>['unmount'];
}
