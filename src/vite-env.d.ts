/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_APP_MODE?: 'production' | 'demo';
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  
  // Multimodal AI Provider Routing
  readonly VITE_AI_PROVIDER?: 'auto' | 'openrouter' | 'nvidia_nim' | 'gemini';
  readonly VITE_AI_VISION_API_KEY?: string;
  
  // 1. OpenRouter Configuration
  readonly VITE_OPENROUTER_API_KEY?: string;
  readonly VITE_OPENROUTER_ENDPOINT?: string;
  readonly VITE_OPENROUTER_MODEL?: string;

  // 2. NVIDIA NIM Configuration
  readonly VITE_NVIDIA_NIM_API_KEY?: string;
  readonly VITE_NVIDIA_NIM_ENDPOINT?: string;
  readonly VITE_NVIDIA_NIM_MODEL?: string;

  // 3. Google Gemini Configuration
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_GEMINI_MODEL?: string;

  // Auth & Mock
  readonly VITE_LOGTO_ENDPOINT?: string;
  readonly VITE_LOGTO_APP_ID?: string;
  readonly VITE_USE_MOCK_CAMPUS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
