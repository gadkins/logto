import type { LanguageTag } from '@logto/language-kit';
import { builtInLanguages } from '@logto/phrases-ui';
import type { CreateSignInExperience, SignInExperience } from '@logto/schemas';
import { BrandingStyle } from '@logto/schemas';

import {
  socialTarget01,
  socialTarget02,
  mockBranding,
  mockSignInExperience,
  mockSocialConnectors,
} from '#src/__mocks__/index.js';
import RequestError from '#src/errors/RequestError/index.js';

import { createConnectorLibrary } from '../connector.js';

const { jest } = import.meta;

const allCustomLanguageTags: LanguageTag[] = [];

const customPhrases = {
  findAllCustomLanguageTags: jest.fn(async () => allCustomLanguageTags),
};
const { findAllCustomLanguageTags } = customPhrases;

const signInExperiences = {
  findDefaultSignInExperience: jest.fn(),
  updateDefaultSignInExperience: jest.fn(
    async (data: Partial<CreateSignInExperience>): Promise<SignInExperience> => ({
      ...mockSignInExperience,
      ...data,
    })
  ),
};
const { findDefaultSignInExperience, updateDefaultSignInExperience } = signInExperiences;

const { MockQueries } = await import('#src/test-utils/tenant.js');
const queries = new MockQueries({
  customPhrases,
  signInExperiences,
});
const connectorLibrary = createConnectorLibrary(queries);
const getLogtoConnectors = jest.spyOn(connectorLibrary, 'getLogtoConnectors');

const { validateBranding, createSignInExperienceLibrary } = await import('./index.js');
const { validateLanguageInfo, removeUnavailableSocialConnectorTargets } =
  createSignInExperienceLibrary(queries, connectorLibrary);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('validate branding', () => {
  it('should throw when the UI style contains the slogan and slogan is empty', () => {
    expect(() => {
      validateBranding({
        ...mockBranding,
        style: BrandingStyle.Logo_Slogan,
        slogan: '',
      });
    }).toMatchError(new RequestError('sign_in_experiences.empty_slogan'));
  });

  it('should throw when the logo is empty', () => {
    expect(() => {
      validateBranding({
        ...mockBranding,
        style: BrandingStyle.Logo,
        logoUrl: ' ',
        slogan: '',
      });
    }).toMatchError(new RequestError('sign_in_experiences.empty_logo'));
  });

  it('should throw when the UI style contains the slogan and slogan is blank', () => {
    expect(() => {
      validateBranding({
        ...mockBranding,
        style: BrandingStyle.Logo_Slogan,
        slogan: ' \t\n',
      });
    }).toMatchError(new RequestError('sign_in_experiences.empty_slogan'));
  });

  it('should not throw when the UI style does not contain the slogan and slogan is empty', () => {
    expect(() => {
      validateBranding({
        ...mockBranding,
        style: BrandingStyle.Logo,
      });
    }).not.toThrow();
  });
});

describe('validate language info', () => {
  it('should call findAllCustomLanguageTags', async () => {
    await validateLanguageInfo({
      autoDetect: true,
      fallbackLanguage: 'zh-CN',
    });
    expect(findAllCustomLanguageTags).toBeCalledTimes(1);
  });

  it('should pass when the language is built-in supported', async () => {
    const builtInSupportedLanguage = 'tr-TR';
    await expect(
      validateLanguageInfo({
        autoDetect: true,
        fallbackLanguage: builtInSupportedLanguage,
      })
    ).resolves.not.toThrow();
    expect(findAllCustomLanguageTags).toBeCalledTimes(1);
  });

  it('should pass when the language is custom supported', async () => {
    const customOnlySupportedLanguage = 'zh-HK';
    expect(customOnlySupportedLanguage in builtInLanguages).toBeFalsy();
    findAllCustomLanguageTags.mockResolvedValueOnce([customOnlySupportedLanguage]);
    await expect(
      validateLanguageInfo({
        autoDetect: true,
        fallbackLanguage: customOnlySupportedLanguage,
      })
    ).resolves.not.toThrow();
    expect(findAllCustomLanguageTags).toBeCalledTimes(1);
  });

  it('unsupported fallback language should fail', async () => {
    const unsupportedLanguage = 'zh-MO';
    expect(unsupportedLanguage in builtInLanguages).toBeFalsy();
    expect(allCustomLanguageTags.includes(unsupportedLanguage)).toBeFalsy();
    await expect(
      validateLanguageInfo({
        autoDetect: true,
        fallbackLanguage: unsupportedLanguage,
      })
    ).rejects.toMatchError(
      new RequestError({
        code: 'sign_in_experiences.unsupported_default_language',
        language: unsupportedLanguage,
      })
    );
  });
});

describe('remove unavailable social connector targets', () => {
  it('should remove unavailable social connector targets in sign-in experience', async () => {
    const mockSocialConnectorTargets = mockSocialConnectors.map(
      ({ metadata: { target } }) => target
    );
    findDefaultSignInExperience.mockResolvedValueOnce({
      ...mockSignInExperience,
      socialSignInConnectorTargets: mockSocialConnectorTargets,
    });
    getLogtoConnectors.mockResolvedValueOnce(mockSocialConnectors);
    expect(mockSocialConnectorTargets).toEqual([socialTarget01, socialTarget02]);
    await removeUnavailableSocialConnectorTargets();
    expect(updateDefaultSignInExperience).toBeCalledWith({
      socialSignInConnectorTargets: [socialTarget01, socialTarget02],
    });
  });
});
