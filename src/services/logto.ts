// ==============================================================================
// I-CAN PLATFORM — LOGTO OIDC / SSO AUTHENTICATION CONFIGURATION
// Open-source / Cloud Identity Provider integration for BINUS SSO & Students
// ==============================================================================

import { LogtoConfig } from '@logto/react';

const logtoEndpoint = import.meta.env.VITE_LOGTO_ENDPOINT || 'https://auth.i-can.binus.ac.id/';
const logtoAppId = import.meta.env.VITE_LOGTO_APP_ID || 'ican-app-client-id';

export const isLogtoConfigured = Boolean(
  import.meta.env.VITE_LOGTO_ENDPOINT && 
  import.meta.env.VITE_LOGTO_APP_ID &&
  !import.meta.env.VITE_LOGTO_ENDPOINT.includes('placeholder') &&
  !import.meta.env.VITE_LOGTO_APP_ID.includes('placeholder')
);

export const logtoConfig: LogtoConfig = {
  endpoint: logtoEndpoint,
  appId: logtoAppId,
  scopes: ['email', 'profile', 'roles', 'custom_data'],
};
