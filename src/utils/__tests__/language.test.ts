/**
 * Tests for language utility functions
 * These tests verify localStorage functionality for language persistence
 */

import {
  getSavedLocale,
  saveLocaleToStorage,
  clearSavedLocale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from '../language'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Language Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getSavedLocale', () => {
    it('should return saved locale when valid locale is stored', () => {
      localStorageMock.getItem.mockReturnValue('vi')
      expect(getSavedLocale()).toBe('vi')
    })

    it('should return default locale when no locale is stored', () => {
      localStorageMock.getItem.mockReturnValue(null)
      expect(getSavedLocale()).toBe(DEFAULT_LOCALE)
    })

    it('should return default locale when invalid locale is stored', () => {
      localStorageMock.getItem.mockReturnValue('invalid')
      expect(getSavedLocale()).toBe(DEFAULT_LOCALE)
    })

    it('should return default locale when localStorage throws error', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })
      expect(getSavedLocale()).toBe(DEFAULT_LOCALE)
    })
  })

  describe('saveLocaleToStorage', () => {
    it('should save valid locale to localStorage', () => {
      saveLocaleToStorage('en')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('app-locale', 'en')
    })

    it('should save Vietnamese locale to localStorage', () => {
      saveLocaleToStorage('vi')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('app-locale', 'vi')
    })

    it('should not save invalid locale', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      // @ts-ignore - Testing invalid input
      saveLocaleToStorage('invalid')
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })
      saveLocaleToStorage('en')
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('clearSavedLocale', () => {
    it('should remove locale from localStorage', () => {
      clearSavedLocale()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('app-locale')
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })
      clearSavedLocale()
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})
