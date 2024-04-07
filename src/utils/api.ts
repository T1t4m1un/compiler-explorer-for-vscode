// Refer to https://github.com/compiler-explorer/compiler-explorer/blob/main/docs/API.md
import axios, { AxiosInstance, AxiosProxyConfig, CreateAxiosDefaults } from "axios";
import { merge } from "lodash";

const baseURL = 'https://godbolt.org/api/';

// havn't support `executeParameters`
const defaultCompileOptions = {
  options: {
    compilerOptions: {
      skipAsm: false,
      executorRequest: false
    },
    filters: {
      binary: false,
      binaryObject: false,
      commentOnly: true,
      demangle: true,
      directives: true,
      execute: false,
      intel: true,
      labels: true,
      libraryCode: false,
      trim: false,
      debugCalls: false
    },
  },
  allowStoreCodeDebug: true
};

type LibraryOption = {
  id: string;
  version: string;
};

type ToolOption = {
  id: string;
  args: string;
};

type CompilationOptions = typeof defaultCompileOptions.options | {
  userArguments?: string;
  libraries?: LibraryOption[];
  tools?: ToolOption[];
};

type CompilationRequest = typeof defaultCompileOptions | {
  source: string;
  lang?: string;
  allowStoreCodeDebug: boolean;
  options: CompilationOptions;
};

const defaultGodboltServiceConfig: CreateAxiosDefaults = {
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
};

const apiEndpoint = {
  languages: 'languages',
  compilers: 'compilers',
  libraries: 'libraries',
  shortLinkInfo: 'shortlinkinfo',
  compile: 'compile',
  formats: 'formats',
  shortener: 'shortener',
};

class API {
  godboltService!: AxiosInstance;

  constructor(proxy?: AxiosProxyConfig) {
    this.godboltService = axios.create({
      ...defaultGodboltServiceConfig,
      proxy
    });

    this.godboltService.interceptors.response.use(
      response => {
        if (response.status === 200) {
          return Promise.resolve(response);
        } else {
          return Promise.reject(response);
        }
      },
    );
  }

  setErrorLogger(errorLogger: (error: any) => void) {
    this.godboltService.interceptors.response.use(undefined, errorLogger);
  }

  async getLanguagesList () {
    return this.godboltService.get(apiEndpoint.languages);
  }

  async getCompilersList (languageId: string = '') {
    return this.godboltService.get(`/${apiEndpoint.compilers}/${languageId}`);
  }

  async getLibraryList (languageId: string = '') {
    return this.godboltService.get(`${apiEndpoint.libraries}/${languageId}`);
  }

  async getShortLinkInfo (shortLinkId: string) {
    return this.godboltService.get(`${apiEndpoint.shortLinkInfo}/${shortLinkId}`);
  }

  async getShorten (shortenerRequset: any) {
    return this.godboltService.post(`${apiEndpoint.shortener}`, shortenerRequset);
  }

  async getCompileResult (compilerId: string, compilationRequest: CompilationRequest) {
    return this.godboltService.post(`compiler/${compilerId}/${apiEndpoint.compile}`, merge(defaultCompileOptions, compilationRequest));
  }

  async getFormatsList () {
    return this.godboltService.get(apiEndpoint.formats);
  }

  async getFormatResult (formatter: string) {
    return this.godboltService.post(`format/${formatter}`);
  }
}

export default API;
