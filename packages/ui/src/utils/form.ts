import { SignInIdentifier } from '@logto/schemas';
import i18next from 'i18next';
import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js/mobile';
import type { TFuncKey } from 'react-i18next';

import type { ErrorType } from '@/components/ErrorMessage';
import type { IdentifierInputType } from '@/components/InputFields/SmartInputField';
import { parseE164Number, parsePhoneNumber } from '@/utils/country-code';

const { t } = i18next;

const usernameRegex = /^[A-Z_a-z-][\w-]*$/;
const emailRegex = /^\S+@\S+\.\S+$/;

export const validateUsername = (username: string): ErrorType | undefined => {
  if (!username) {
    return 'username_required';
  }

  if (/^\d/.test(username)) {
    return 'username_should_not_start_with_number';
  }

  if (!usernameRegex.test(username)) {
    return 'username_invalid_charset';
  }
};

export const validateEmail = (email: string): ErrorType | undefined => {
  if (!emailRegex.test(email)) {
    return 'invalid_email';
  }
};

export const validatePhone = (value: string): ErrorType | undefined => {
  try {
    const phoneNumber = parsePhoneNumberWithError(parseE164Number(value));

    if (!phoneNumber.isValid()) {
      return 'invalid_phone';
    }
  } catch (error: unknown) {
    if (error instanceof ParseError) {
      return 'invalid_phone';
    }

    throw error;
  }
};

export const validateIdentifierField = (type: IdentifierInputType, value: string) => {
  switch (type) {
    case SignInIdentifier.Username: {
      return validateUsername(value);
    }

    case SignInIdentifier.Email: {
      return validateEmail(value);
    }

    case SignInIdentifier.Phone: {
      return validatePhone(value);
    }
    default:
  }
};

export const identifierInputPlaceholderMap: { [K in IdentifierInputType]: TFuncKey } = {
  [SignInIdentifier.Phone]: 'input.phone_number',
  [SignInIdentifier.Email]: 'input.email',
  [SignInIdentifier.Username]: 'input.username',
};

export const identifierInputDescriptionMap: { [K in IdentifierInputType]: TFuncKey } = {
  [SignInIdentifier.Phone]: 'description.phone_number',
  [SignInIdentifier.Email]: 'description.email',
  [SignInIdentifier.Username]: 'description.username',
};

export const getGeneralIdentifierErrorMessage = (
  enabledFields: IdentifierInputType[],
  type: 'required' | 'invalid'
) => {
  const data = {
    types: enabledFields.map((field) =>
      t<'translation', TFuncKey>(identifierInputDescriptionMap[field])
    ),
  };

  const code = type === 'required' ? 'error.general_required' : 'error.general_invalid';

  return t<'translation', TFuncKey>(code, data);
};

export const parseIdentifierValue = (type?: IdentifierInputType, value?: string) => {
  if (type === SignInIdentifier.Phone && value) {
    const validPhoneNumber = parsePhoneNumber(value);

    if (validPhoneNumber) {
      return {
        countryCode: validPhoneNumber.countryCallingCode,
        inputValue: validPhoneNumber.nationalNumber,
      };
    }
  }

  return {
    inputValue: value,
  };
};
