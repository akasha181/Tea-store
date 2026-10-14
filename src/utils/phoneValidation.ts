import type { PhoneValidationResult } from '../types'

/**
 * Validates and formats Pakistani mobile phone numbers.
 * Supported inputs:
 *  - 03001234567
 *  - 0300-1234567
 *  - +92 300 1234567
 *  - 00923001234567
 *  - 923001234567
 *  - 3001234567
 */
export function validatePakistaniPhone(rawInput: string): PhoneValidationResult {
  const trimmed = rawInput.trim()
  if (!trimmed) {
    return {
      isValid: false,
      formatted: '',
      normalized: '',
      errorMessage: 'Phone number is required (موبائل نمبر درج کریں).',
    }
  }

  // Strip spaces, dashes, parentheses, plus signs
  const digitsOnly = trimmed.replace(/\D/g, '')

  let localNumber = ''

  if (digitsOnly.startsWith('0092') && digitsOnly.length === 14) {
    localNumber = '0' + digitsOnly.slice(4)
  } else if (digitsOnly.startsWith('92') && digitsOnly.length === 12) {
    localNumber = '0' + digitsOnly.slice(2)
  } else if (digitsOnly.startsWith('0') && digitsOnly.length === 11) {
    localNumber = digitsOnly
  } else if (digitsOnly.startsWith('3') && digitsOnly.length === 10) {
    localNumber = '0' + digitsOnly
  } else {
    return {
      isValid: false,
      formatted: trimmed,
      normalized: digitsOnly,
      errorMessage: 'Please enter a valid 11-digit Pakistani mobile number (e.g. 0300-1234567).',
    }
  }

  // Verify it starts with 03 followed by valid mobile network code
  // 0300-0309 (Jazz), 0310-0318 (Zong), 0320-0325 (Warid), 0330-0337 (Ufone), 0340-0349 (Telenor), 0355 (SCOM)
  const pkMobileRegex = /^03[0-5][0-9]\d{7}$/

  if (!pkMobileRegex.test(localNumber)) {
    return {
      isValid: false,
      formatted: localNumber,
      normalized: localNumber,
      errorMessage: 'Please enter a valid Pakistani mobile network number starting with 03 (e.g. 0300, 0312, 0333, 0345).',
    }
  }

  // Formatted for local display: 0300-1234567
  const formatted = `${localNumber.slice(0, 4)}-${localNumber.slice(4)}`
  // Normalized international for WhatsApp: 923001234567
  const normalized = `92${localNumber.slice(1)}`

  return {
    isValid: true,
    formatted,
    normalized,
  }
}
